'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ModernSidebar } from '../components/ModernSidebar';
import { MultiStepFormBuilder } from './MultiStepFormBuilder';
import { SaveTemplateModal } from './SaveTemplateModal';
import { TopNavigation } from './TopNavigation';
import { TemplateLibrary } from './TemplateLibrary';
import { SavedForms } from './SavedForms';
import { FieldConfig, FormData, FormStep, FormTemplate, FieldTemplate } from '../types/form';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAutoSave } from '../hooks/useAutoSave';
import { useTemplateManager } from '../hooks/useTemplateManager';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormBuilderStore } from '../hooks/useFormBuilderStore';
import { ModernFormBuilder } from './ModernFormBuilder';
import { FormPreviewModal } from './FormPreviewModal';
import { TemplatePreviewModal } from './TemplatePreviewModal';

interface ModernFormBuilderLayoutProps {
  initialState?: Partial<ReturnType<typeof useFormBuilderStore.getState>>;
  onSubmit: (data: FormData) => void;
}

export function ModernFormBuilderLayout({
  initialState,
  onSubmit,
}: ModernFormBuilderLayoutProps) {
  // Centralized state from Zustand
  const {
    fields,
    steps,
    formData,
    isMultiStep,
    currentStep,
    setInitialState,
    setFormData,
    addField,
    updateField,
    removeField,
    duplicateField,
    moveField,
    addTemplateFields,
    addStep,
    updateStep,
    removeStep,
    reorderStep,
    toggleMultiStep,
    setCurrentStep,
  } = useFormBuilderStore();
  
  // Local UI state
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(undefined);
  const [currentView, setCurrentView] = useState<'builder' | 'templates' | 'saved-forms'>('builder');
  const [formTitle, setFormTitle] = useState('Neues Formular');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplatePreview, setSelectedTemplatePreview] = useState<any | null>(null);

  // Initialize store on mount or when initialState prop changes
  useEffect(() => {
    setInitialState({
      fields: initialState?.fields || [],
      steps: initialState?.steps || [],
      isMultiStep: initialState?.isMultiStep || false,
    });
    if (initialState?.fields || initialState?.steps) {
      setHasUnsavedChanges(true);
    }
  }, [initialState, setInitialState]);
  
  // Derived state for validation and auto-save
  const allFields = isMultiStep ? steps.flatMap(s => s.fields) : fields;
  const { getFieldError, hasErrors, errors } = useFormValidation(allFields);
  const { saveNow, clearSavedData, getLastSaveTime, hasSavedData } = useAutoSave(
    formData, 
    allFields
  );
  const { saveTemplate } = useTemplateManager();

  const getStepsWithErrors = useCallback((): Set<string> => {
    const stepErrorSet = new Set<string>();
    if (!hasErrors || !isMultiStep) return stepErrorSet;

    for (const step of steps) {
      for (const field of step.fields) {
        if (errors[field.name]) {
          stepErrorSet.add(step.id);
          break;
        }
      }
    }
    return stepErrorSet;
  }, [errors, steps, hasErrors, isMultiStep]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(allFields.length > 0);
  }, [allFields]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const flatFields = isMultiStep ? steps.flatMap(s => s.fields) : fields;
  
    const oldIndex = flatFields.findIndex((f) => f.id === active.id);
    const newIndex = flatFields.findIndex((f) => f.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;
  
    moveField(oldIndex, newIndex);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Re-validate all fields on submit. The hook should handle this.
    if (!hasErrors) {
      clearSavedData();
      onSubmit(formData);
    }
  };

  const handleSaveAsTemplate = async (name: string, description: string) => {
    const templateData = isMultiStep ? { steps } : { fields };
    await saveTemplate(name, description, templateData.fields, templateData.steps, isMultiStep);
    setShowSaveTemplateModal(false);
  };

  const handleNewForm = () => {
    setInitialState({ fields: [], steps: [], isMultiStep: false });
    setFormTitle('Neues Formular');
    setHasUnsavedChanges(false);
    setCurrentView('builder');
  };

  const handleUseTemplate = (template: FormTemplate) => {
    setInitialState({
      fields: template.fields || [],
      steps: template.steps || [],
      isMultiStep: template.isMultiStep || false,
    });
    setFormTitle(template.name);
    setCurrentView('builder');
  };
  
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        <TopNavigation
          currentView={currentView}
          onViewChange={setCurrentView}
          onNewForm={handleNewForm}
          onSaveForm={saveNow}
          onPreviewForm={() => setShowPreviewModal(true)}
          formTitle={formTitle}
          onTitleChange={setFormTitle}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        {currentView === 'templates' ? (
          <TemplateLibrary
            onUseTemplate={handleUseTemplate}
            onPreviewTemplate={setSelectedTemplatePreview}
          />
        ) : currentView === 'saved-forms' ? (
          <SavedForms
            onLoadForm={handleUseTemplate} // Re-using handleUseTemplate as it now just loads state
            onDuplicateForm={() => { /* TODO */ }}
            onDeleteForm={() => { /* TODO */ }}
            onPreviewForm={setSelectedTemplatePreview}
          />
        ) : (
          <div className="flex flex-1 h-full overflow-hidden">
            <ModernSidebar
              onAddField={(type) => addField(type, isMultiStep ? steps[currentStep]?.id : undefined)}
              onSaveTemplate={() => setShowSaveTemplateModal(true)}
              selectedFieldId={selectedFieldId}
              onFieldSelect={setSelectedFieldId}
              onFieldUpdate={(id, updates) => updateField(id, updates)}
              onFieldDuplicate={(id) => duplicateField(id, isMultiStep ? steps.find(s => s.fields.some(f=>f.id===id))?.id : undefined)}
              onFieldDelete={(id) => removeField(id, isMultiStep ? steps.find(s => s.fields.some(f=>f.id===id))?.id : undefined)}
              onAddFieldTemplate={(template) => addTemplateFields(template, isMultiStep ? steps[currentStep]?.id : undefined)}
              isMultiStep={isMultiStep}
              onToggleMultiStep={toggleMultiStep}
              steps={steps}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              onCreateStep={(data) => addStep(data)}
              onUpdateStep={updateStep}
              onDeleteStep={removeStep}
              onReorderSteps={reorderStep}
            />
            
            <main className="flex-1 flex flex-col">
              <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formTitle}
                  </h1>
                   <div className="text-sm text-gray-500 dark:text-gray-400">
                    {isMultiStep 
                      ? `${steps.length} Schritte / ${allFields.length} Felder`
                      : `${fields.length} Felder`
                    }
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-6">
                {isMultiStep ? (
                  <MultiStepFormBuilder
                    steps={steps}
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                    formData={formData}
                    onFieldChange={(name, value) => setFormData(name, value)}
                    onUpdateStep={updateStep}
                    onAddField={(type, stepId) => addField(type, stepId)}
                    onAddTemplate={(template, stepId) => addTemplateFields(template, stepId)}
                    stepsWithErrors={getStepsWithErrors()}
                    errors={errors}
                    onFieldUpdate={updateField}
                    onFieldDuplicate={duplicateField}
                    onFieldRemove={removeField}
                  />
                ) : (
                  <div className="max-w-4xl mx-auto">
                    {allFields.length === 0 ? (
                      <div className="text-center py-16">
                         <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                           Formular-Editor
                         </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                          Fügen Sie Felder hinzu, um Ihr Formular zu erstellen.
                        </p>
                         <div className="flex justify-center gap-4">
                          <button
                            type="button"
                            onClick={() => addField('text')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                          >
                            Textfeld hinzufügen
                          </button>
                           <button
                            type="button"
                            onClick={toggleMultiStep}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                          >
                             Multi-Step erstellen
                           </button>
                         </div>
                       </div>
                    ) : (
                      <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                        <ModernFormBuilder
                          fields={fields}
                          formData={formData}
                          onFieldChange={handleInputChange}
                          onUpdateField={updateField}
                          onRemoveField={removeField}
                          onDuplicateField={duplicateField}
                          errors={errors}
                        />
                      </SortableContext>
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>
        )}

        <SaveTemplateModal
          isOpen={showSaveTemplateModal}
          onClose={() => setShowSaveTemplateModal(false)}
          onSave={handleSaveAsTemplate}
          fields={fields}
          steps={steps}
          isMultiStep={isMultiStep}
        />

        <FormPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          fields={allFields}
          steps={isMultiStep ? steps : undefined}
          isMultiStep={isMultiStep}
          title={formTitle}
        />

        {selectedTemplatePreview && (
          <TemplatePreviewModal
            isOpen={!!selectedTemplatePreview}
            onClose={() => setSelectedTemplatePreview(null)}
            template={selectedTemplatePreview}
            onUseTemplate={handleUseTemplate}
          />
        )}
      </div>
    </DndContext>
  );
}