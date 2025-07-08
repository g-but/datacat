'use client';

import React from 'react';
import { FormStep, FieldTemplate, FieldConfig } from '../types/form';
import { Button } from './Button';
import { EmptyStep } from './EmptyStep';
import { useFormBuilderStore } from '../hooks/useFormBuilderStore';
import { ModernFieldBuilder, ModernFieldBuilderProps } from './ModernFormBuilder';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableFieldProps {
  field: FieldConfig;
  children: React.ReactNode;
}

function SortableField({ field, children }: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const childWithDragProps = React.cloneElement(
    children as React.ReactElement<ModernFieldBuilderProps>, 
    {
      isDragging,
      dragProps: { ...attributes, ...listeners }
    }
  );

  return (
    <div ref={setNodeRef} style={style}>
      {childWithDragProps}
    </div>
  );
}


interface MultiStepFormBuilderProps {
  stepsWithErrors: Set<string>;
  errors: Record<string, string | null>;
}

export function MultiStepFormBuilder({
  stepsWithErrors,
  errors
}: MultiStepFormBuilderProps) {
  const {
    steps,
    currentStep,
    formData,
    setCurrentStep,
    setFormData,
    addStep,
    addField,
    addTemplateFields,
    updateField,
    duplicateField,
    removeField
  } = useFormBuilderStore();

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };
  
  if (!currentStepData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Keine Schritte definiert. Fügen Sie einen in der Seitenleiste hinzu.</p>
      </div>
    );
  }

  const isCurrentStepComplete = () => {
    if (!currentStepData) return false;
    const requiredFields = currentStepData.fields.filter(field => field.required);
    return requiredFields.every(field => formData[field.name]?.trim());
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-start flex-wrap gap-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${
                    getStepStatus(index) === 'completed'
                      ? 'bg-green-500 border-green-500 text-white'
                      : getStepStatus(index) === 'current'
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                  } ${stepsWithErrors.has(step.id) ? '!border-red-500' : ''}`}
                  onClick={() => setCurrentStep(index)}
                  title={stepsWithErrors.has(step.id) ? 'Dieser Schritt hat Fehler' : ''}
                >
                  {stepsWithErrors.has(step.id) && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  )}
                  {getStepStatus(index) === 'completed' ? '✓' : index + 1}
                </div>
                <div className="ml-2 mr-3">
                  <p className={`text-sm font-medium ${
                    getStepStatus(index) === 'current' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentStepData.title}
          </h2>
          {currentStepData.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {currentStepData.description}
            </p>
          )}
        </div>

        <div className="space-y-6">
          {currentStepData.fields.length === 0 ? (
            <EmptyStep 
              onAddField={(type: FieldConfig['type']) => addField(type, currentStepData.id)}
              onAddTemplate={(template: FieldTemplate) => addTemplateFields(template, currentStepData.id)}
            />
          ) : (
            <SortableContext items={currentStepData.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-6">
                {currentStepData.fields.map(field => (
                  <SortableField key={field.id} field={field}>
                    <ModernFieldBuilder
                      field={field}
                      value={formData[field.name] || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setFormData(e.target.name, e.target.value)}
                      onUpdateField={(updates: Partial<FieldConfig>) => updateField(field.id, updates)}
                      onRemove={() => removeField(field.id)}
                      onDuplicate={() => duplicateField(field.id)}
                      error={errors[field.name]}
                    />
                  </SortableField>
                ))}
              </div>
            </SortableContext>
          )}
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Zurück
          </Button>
          
          {isLastStep ? (
             <Button
                type="submit"
                form="main-form-id" 
                disabled={Object.values(errors).some(e => e !== null)}
                className="bg-gradient-to-r from-green-600 to-emerald-600"
              >
                Absenden
              </Button>
          ) : (
             <Button
              type="button"
              onClick={handleNext}
              disabled={!isCurrentStepComplete() && !currentStepData.isOptional}
            >
              Weiter
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 