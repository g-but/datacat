'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ModernSidebar } from '../components/ModernSidebar';
import { MultiStepFormBuilder } from './MultiStepFormBuilder';
import { SaveTemplateModal } from './SaveTemplateModal';
import { TopNavigation } from './TopNavigation';
import { TemplateLibrary, TemplateData } from './TemplateLibrary';
import { SavedForms, SavedForm } from './SavedForms';
import { FieldConfig, FormData, FormStep, FormTemplate } from '../types/form';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAutoSave } from '../hooks/useAutoSave';
import { useTemplateManager } from '../hooks/useTemplateManager';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { useFormBuilderStore } from '../hooks/useFormBuilderStore';
import { ModernFormBuilder } from './ModernFormBuilder';
import { FormPreviewModal } from './FormPreviewModal';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import AboutPage from '../about/page';

interface ModernFormBuilderLayoutProps {
  initialState?: Partial<ReturnType<typeof useFormBuilderStore.getState>>;
  onSubmit: (data: FormData) => void;
}

export function ModernFormBuilderLayout({
  initialState,
  onSubmit,
}: ModernFormBuilderLayoutProps) {
  const {
    fields,
    steps,
    formData,
    isMultiStep,
    currentStep,
    setInitialState,
    setFormData,
    moveField,
    updateField,
    removeField,
    duplicateField
  } = useFormBuilderStore();

  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(undefined);
  const [currentView, setCurrentView] = useState<'builder' | 'templates' | 'saved-forms' | 'about'>('builder');
  const [formTitle, setFormTitle] = useState('Neues Formular');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplatePreview, setSelectedTemplatePreview] = useState<TemplateData | SavedForm | null>(null);

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

  const allFields = isMultiStep ? steps.flatMap(s => s.fields) : fields;
  const { hasErrors, errors } = useFormValidation(allFields);
  const { saveNow, clearSavedData } = useAutoSave(formData, allFields);
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
    if (oldIndex !== -1 && newIndex !== -1) {
      moveField(oldIndex, newIndex);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasErrors) {
      clearSavedData();
      onSubmit(formData);
    }
  };

  const handleSaveAsTemplate = async (name: string, description: string) => {
    await saveTemplate(name, description, allFields);
    setShowSaveTemplateModal(false);
  };

  const handleNewForm = () => {
    setInitialState({ fields: [], steps: [], isMultiStep: false });
    setFormTitle('Neues Formular');
    setHasUnsavedChanges(false);
    setCurrentView('builder');
  };

  const handleUseTemplate = (item: TemplateData | SavedForm) => {
    const isSavedForm = 'title' in item;
    const fieldsWithIds: FieldConfig[] = item.fields.map((field, index) => ({
      ...field,
      id: (field as FieldConfig).id || `field-${Date.now()}-${index}`
    }));

    setInitialState({
      fields: fieldsWithIds,
      steps: item.steps || [],
      isMultiStep: item.isMultiStep || false,
    });
    setFormTitle(isSavedForm ? item.title : item.name);
    setCurrentView('builder');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'templates':
        return <TemplateLibrary onUseTemplate={handleUseTemplate} onPreviewTemplate={setSelectedTemplatePreview} />;
      case 'saved-forms':
        return <SavedForms onLoadForm={handleUseTemplate} onDuplicateForm={() => {}} onDeleteForm={() => {}} onPreviewForm={setSelectedTemplatePreview} />;
      case 'about':
        return <AboutPage />;
      case 'builder':
      default:
        return (
          <div className="flex flex-1 h-full overflow-hidden">
            <ModernSidebar
              onSaveTemplate={() => setShowSaveTemplateModal(true)}
              selectedFieldId={selectedFieldId}
              onFieldSelect={setSelectedFieldId}
              onFieldUpdate={updateField}
            />
            <main className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6">
                {isMultiStep ? (
                  <MultiStepFormBuilder stepsWithErrors={getStepsWithErrors()} errors={errors} />
                ) : (
                  <div className="max-w-4xl mx-auto">
                    <ModernFormBuilder
                      fields={fields}
                      formData={formData}
                      onFieldChange={handleInputChange}
                      onUpdateField={updateField}
                      onRemoveField={removeField}
                      onDuplicateField={duplicateField}
                      errors={errors}
                    />
                  </div>
                )}
              </div>
            </main>
          </div>
        );
    }
  };
  
  const getPreviewTemplate = (): FormTemplate | null => {
    if (!selectedTemplatePreview) return null;

    const isSavedForm = 'title' in selectedTemplatePreview;
    
    return {
        id: selectedTemplatePreview.id,
        name: isSavedForm ? selectedTemplatePreview.title : selectedTemplatePreview.name,
        description: selectedTemplatePreview.description || '',
        fields: selectedTemplatePreview.fields as FieldConfig[],
        isMultiStep: !!selectedTemplatePreview.isMultiStep
    };
  }

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
        
        {renderContent()}

        {showSaveTemplateModal && (
          <SaveTemplateModal
            isOpen={showSaveTemplateModal}
            onSave={handleSaveAsTemplate}
            onClose={() => setShowSaveTemplateModal(false)}
            fields={allFields}
          />
        )}
        
        {showPreviewModal && (
          <FormPreviewModal
            isOpen={showPreviewModal}
            form={{ title: formTitle, fields: allFields }}
            onClose={() => setShowPreviewModal(false)}
          />
        )}

        {selectedTemplatePreview && (
          <TemplatePreviewModal
            isOpen={!!selectedTemplatePreview}
            template={getPreviewTemplate()}
            onClose={() => setSelectedTemplatePreview(null)}
          />
        )}
      </div>
    </DndContext>
  );
}