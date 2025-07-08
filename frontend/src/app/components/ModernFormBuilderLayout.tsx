'use client';

import React, { useState, useCallback } from 'react';
import { ModernSidebar } from './ModernSidebar';
import { ModernFieldBuilder } from './ModernFormBuilder';
import { MultiStepFormBuilder } from './MultiStepFormBuilder';
import { SaveTemplateModal } from './SaveTemplateModal';
import { TopNavigation } from './TopNavigation';
import { TemplateLibrary } from './TemplateLibrary';
import { SavedForms } from './SavedForms';
import { FieldConfig, FormData, FormStep } from '../types/form';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAutoSave } from '../hooks/useAutoSave';
import { useTemplateManager } from '../hooks/useTemplateManager';

interface ModernFormBuilderLayoutProps {
  initialFields: FieldConfig[];
  onSubmit: (data: FormData) => void;
  onFieldsChange?: (fields: FieldConfig[]) => void;
}

export function ModernFormBuilderLayout({
  initialFields,
  onSubmit,
  onFieldsChange
}: ModernFormBuilderLayoutProps) {
  const [fields, setFields] = useState<FieldConfig[]>(initialFields);
  const [formData, setFormData] = useState<FormData>(() => {
    const data: FormData = {};
    initialFields.forEach(field => {
      data[field.name] = '';
    });
    return data;
  });
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(undefined);
  
  // Multi-step form state
  const [isMultiStep, setIsMultiStep] = useState(false);
  const [steps, setSteps] = useState<FormStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Navigation state
  const [currentView, setCurrentView] = useState<'builder' | 'templates' | 'saved-forms'>('builder');
  const [formTitle, setFormTitle] = useState('Neues Formular');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { validateForm, validateSingleField, getFieldError, hasErrors } = useFormValidation(fields);
  const { savedData, saveNow, clearSavedData, getLastSaveTime, hasSavedData } = useAutoSave(formData, fields);
  const { saveTemplate } = useTemplateManager();

  // Auto-load saved data
  React.useEffect(() => {
    if (savedData && Object.keys(formData).every(key => !formData[key])) {
      setFormData(savedData.formData);
      if (savedData.fields.length !== fields.length) {
        setFields(savedData.fields);
        onFieldsChange?.(savedData.fields);
      }
    }
  }, [savedData]);

  // Track unsaved changes
  React.useEffect(() => {
    setHasUnsavedChanges(fields.length > 0 || steps.length > 0);
  }, [fields, steps, formData]);

  const createQuickField = useCallback((type: FieldConfig['type']) => {
    const fieldNames = {
      text: 'Textfeld',
      email: 'E-Mail',
      tel: 'Telefon',
      date: 'Datum',
      select: 'Auswahl',
      textarea: 'Textbereich'
    };

    const fieldConfig: FieldConfig = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      name: `${fieldNames[type]?.toLowerCase().replace(/[^a-z]/g, '_') || type}_${Date.now()}`,
      label: fieldNames[type] || type,
      required: false,
      placeholder: type === 'select' ? undefined : `${fieldNames[type]} eingeben...`,
      options: type === 'select' ? [
        { value: '', label: 'Auswahl treffen' },
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ] : undefined,
      rows: type === 'textarea' ? 3 : undefined
    };

    const newFields = [...fields, fieldConfig];
    setFields(newFields);
    setFormData(prev => ({
      ...prev,
      [fieldConfig.name]: ''
    }));
    onFieldsChange?.(newFields);
  }, [fields, onFieldsChange]);

  const createQuickFieldAtPosition = useCallback((type: FieldConfig['type'], position: number) => {
    const fieldNames = {
      text: 'Textfeld',
      email: 'E-Mail',
      tel: 'Telefon',
      date: 'Datum',
      select: 'Auswahl',
      textarea: 'Textbereich'
    };

    const fieldConfig: FieldConfig = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      name: `${fieldNames[type]?.toLowerCase().replace(/[^a-z]/g, '_') || type}_${Date.now()}`,
      label: fieldNames[type] || type,
      required: false,
      placeholder: type === 'select' ? undefined : `${fieldNames[type]} eingeben...`,
      options: type === 'select' ? [
        { value: '', label: 'Auswahl treffen' },
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ] : undefined,
      rows: type === 'textarea' ? 3 : undefined
    };

    const newFields = [...fields];
    newFields.splice(position, 0, fieldConfig);
    setFields(newFields);
    setFormData(prev => ({
      ...prev,
      [fieldConfig.name]: ''
    }));
    onFieldsChange?.(newFields);
  }, [fields, onFieldsChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFieldBlur = (fieldName: string) => {
    const value = formData[fieldName] || '';
    validateSingleField(fieldName, value);
  };

  const updateField = (fieldId: string, updates: Partial<FieldConfig>) => {
    const newFields = fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    );
    setFields(newFields);
    onFieldsChange?.(newFields);
  };

  const removeField = (fieldId: string) => {
    const fieldToRemove = fields.find(field => field.id === fieldId);
    const newFields = fields.filter(field => field.id !== fieldId);
    setFields(newFields);
    
    if (fieldToRemove) {
      setFormData(prev => {
        const newData = { ...prev };
        delete newData[fieldToRemove.name];
        return newData;
      });
    }
    onFieldsChange?.(newFields);
  };

  const duplicateField = (fieldId: string) => {
    const fieldToDuplicate = fields.find(field => field.id === fieldId);
    if (fieldToDuplicate) {
      const duplicatedField: FieldConfig = {
        ...fieldToDuplicate,
        id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${fieldToDuplicate.name}_copy_${Date.now()}`,
        label: `${fieldToDuplicate.label} (Kopie)`
      };

      const fieldIndex = fields.findIndex(field => field.id === fieldId);
      const newFields = [
        ...fields.slice(0, fieldIndex + 1),
        duplicatedField,
        ...fields.slice(fieldIndex + 1)
      ];
      
      setFields(newFields);
      setFormData(prev => ({
        ...prev,
        [duplicatedField.name]: ''
      }));
      onFieldsChange?.(newFields);
    }
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    setFields(newFields);
    onFieldsChange?.(newFields);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formData);
    
    if (errors.length === 0) {
      clearSavedData();
      onSubmit(formData);
    }
  };

  const handleSaveAsTemplate = async (name: string, description: string) => {
    await saveTemplate(name, description, fields);
  };

  // Multi-step form handlers
  const handleToggleMultiStep = () => {
    setIsMultiStep(!isMultiStep);
    if (!isMultiStep && steps.length === 0) {
      // Create first step when enabling multi-step
      const firstStep: FormStep = {
        id: `step-${Date.now()}`,
        title: 'Schritt 1',
        description: 'Erster Schritt',
        fields: [],
        isOptional: false
      };
      setSteps([firstStep]);
    }
  };

  const handleCreateStep = (stepData: Omit<FormStep, 'id'>) => {
    const newStep: FormStep = {
      ...stepData,
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setSteps([...steps, newStep]);
  };

  const handleCreateStepAtPosition = (stepData: Omit<FormStep, 'id'>, position: number) => {
    const newStep: FormStep = {
      ...stepData,
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    const newSteps = [...steps];
    newSteps.splice(position, 0, newStep);
    setSteps(newSteps);
  };

  const handleUpdateStep = (stepId: string, updates: Partial<FormStep>) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const handleDeleteStep = (stepId: string) => {
    const newSteps = steps.filter(step => step.id !== stepId);
    setSteps(newSteps);
    
    // Move fields from deleted step back to unassigned
    const updatedFields = fields.map(field => 
      field.step === stepId ? { ...field, step: undefined } : field
    );
    setFields(updatedFields);
    onFieldsChange?.(updatedFields);
    
    // Adjust current step if necessary
    if (currentStep >= newSteps.length && newSteps.length > 0) {
      setCurrentStep(newSteps.length - 1);
    }
  };

  const handleAssignFieldToStep = (fieldId: string, stepId: string) => {
    const updatedFields = fields.map(field => 
      field.id === fieldId ? { ...field, step: parseInt(stepId) } : field
    );
    setFields(updatedFields);
    onFieldsChange?.(updatedFields);
    
    // Update step's fields array
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      const field = fields.find(f => f.id === fieldId);
      if (field) {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex] = {
          ...updatedSteps[stepIndex],
          fields: [...updatedSteps[stepIndex].fields, field]
        };
        setSteps(updatedSteps);
      }
    }
  };

  const handleReorderSteps = (fromIndex: number, toIndex: number) => {
    const newSteps = [...steps];
    const [movedStep] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, movedStep);
    setSteps(newSteps);
  };

  // Navigation handlers
  const handleNewForm = () => {
    setFields([]);
    setFormData({});
    setSteps([]);
    setIsMultiStep(false);
    setCurrentStep(0);
    setFormTitle('Neues Formular');
    setHasUnsavedChanges(false);
    setCurrentView('builder');
  };

  const handlePreviewForm = () => {
    // TODO: Implement form preview
    console.log('Preview form:', { fields, steps, isMultiStep });
  };

  const handleUseTemplate = (template: any) => {
    const newFields = template.fields.map((field: any) => ({
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    
    setFields(newFields);
    setFormData(() => {
      const data: FormData = {};
      newFields.forEach((field: FieldConfig) => {
        data[field.name] = '';
      });
      return data;
    });
    setFormTitle(template.name);
    setHasUnsavedChanges(true);
    setCurrentView('builder');
    onFieldsChange?.(newFields);
  };

  const handleLoadForm = (form: any) => {
    setFields(form.fields);
    setSteps(form.steps || []);
    setIsMultiStep(form.isMultiStep || false);
    setFormData(() => {
      const data: FormData = {};
      form.fields.forEach((field: FieldConfig) => {
        data[field.name] = '';
      });
      return data;
    });
    setFormTitle(form.title);
    setHasUnsavedChanges(false);
    setCurrentView('builder');
    onFieldsChange?.(form.fields);
  };

  const handleDuplicateForm = (form: any) => {
    const duplicatedFields = form.fields.map((field: FieldConfig) => ({
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${field.name}_copy`
    }));
    
    setFields(duplicatedFields);
    setSteps(form.steps ? form.steps.map((step: FormStep) => ({
      ...step,
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    })) : []);
    setIsMultiStep(form.isMultiStep || false);
    setFormData(() => {
      const data: FormData = {};
      duplicatedFields.forEach((field: FieldConfig) => {
        data[field.name] = '';
      });
      return data;
    });
    setFormTitle(`${form.title} (Kopie)`);
    setHasUnsavedChanges(true);
    setCurrentView('builder');
    onFieldsChange?.(duplicatedFields);
  };

  const handleDeleteForm = (formId: string) => {
    // TODO: Implement form deletion
    console.log('Delete form:', formId);
  };

  const handlePreviewTemplate = (template: any) => {
    // TODO: Implement template preview
    console.log('Preview template:', template);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <TopNavigation
        currentView={currentView}
        onViewChange={setCurrentView}
        onNewForm={handleNewForm}
        onSaveForm={saveNow}
        onPreviewForm={handlePreviewForm}
        formTitle={formTitle}
        onTitleChange={setFormTitle}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Main Content */}
      {currentView === 'templates' ? (
        <TemplateLibrary
          onUseTemplate={handleUseTemplate}
          onPreviewTemplate={handlePreviewTemplate}
        />
      ) : currentView === 'saved-forms' ? (
        <SavedForms
          onLoadForm={handleLoadForm}
          onDuplicateForm={handleDuplicateForm}
          onDeleteForm={handleDeleteForm}
          onPreviewForm={handlePreviewForm}
        />
      ) : (
        <div className="flex flex-1 h-full">
          {/* Sidebar */}
          <ModernSidebar
        onAddField={createQuickField}
        onAddFieldAtPosition={createQuickFieldAtPosition}
        onSaveTemplate={() => setShowSaveTemplateModal(true)}
        onSaveDraft={saveNow}
        canSubmit={!hasErrors}
        fields={fields}
        onFieldSelect={(fieldId) => setSelectedFieldId(fieldId)}
        onFieldMove={(fieldId, direction) => {
          const fieldIndex = fields.findIndex(f => f.id === fieldId);
          if (fieldIndex === -1) return;
          
          const newIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
          if (newIndex < 0 || newIndex >= fields.length) return;
          
          moveField(fieldIndex, newIndex);
        }}
        onFieldDuplicate={duplicateField}
        onFieldDelete={removeField}
        onFieldReorder={(fromIndex, toIndex) => moveField(fromIndex, toIndex)}
        onAddFieldTemplate={(template) => {
          const newFields = [...fields];
          const newFormData = { ...formData };
          
          template.fields.forEach(fieldTemplate => {
            const fieldConfig: FieldConfig = {
              ...fieldTemplate,
              id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: `${fieldTemplate.name}_${Date.now()}`
            };
            newFields.push(fieldConfig);
            newFormData[fieldConfig.name] = '';
          });
          
          setFields(newFields);
          setFormData(newFormData);
          onFieldsChange?.(newFields);
        }}
        selectedFieldId={selectedFieldId}
        steps={steps}
        isMultiStep={isMultiStep}
        onToggleMultiStep={handleToggleMultiStep}
        onCreateStep={handleCreateStep}
        onCreateStepAtPosition={handleCreateStepAtPosition}
        onUpdateStep={handleUpdateStep}
        onDeleteStep={handleDeleteStep}
        onAssignFieldToStep={handleAssignFieldToStep}
        onReorderSteps={handleReorderSteps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isMultiStep ? 'Multi-Step Formular' : 'Formular-Editor'}
              </h1>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {isMultiStep 
                  ? `Schritt ${currentStep + 1} von ${steps.length}` 
                  : `${fields.length} Felder`
                }
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isMultiStep && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Multi-Step Modus aktiv
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isMultiStep ? (
            <MultiStepFormBuilder
              steps={steps}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              formData={formData}
              onFieldChange={(fieldName, value) => {
                setFormData(prev => ({
                  ...prev,
                  [fieldName]: value
                }));
              }}
              onSubmit={() => handleSubmit({} as React.FormEvent)}
              canSubmit={!hasErrors}
            />
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Auto-save Notification */}
              {hasSavedData && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 animate-fade-in backdrop-blur-sm mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Automatisch gespeichert {getLastSaveTime()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={clearSavedData}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium hover:underline transition-all duration-200"
                    >
                      Entwurf löschen
                    </button>
                  </div>
                </div>
              )}

              {/* Single-step form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {fields.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Erstellen Sie Ihr erstes Feld
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Verwenden Sie die Sidebar, um Felder hinzuzufügen, Vorlagen zu verwenden oder Multi-Step zu aktivieren.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {fields.map((field) => (
                      <ModernFieldBuilder
                        key={field.id}
                        field={field}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        onUpdateField={(updates) => updateField(field.id, updates)}
                        onRemove={() => removeField(field.id)}
                        onDuplicate={() => duplicateField(field.id)}
                        error={getFieldError(field.name)}
                        isDragging={draggedField === field.id}
                      />
                    ))}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="submit"
                        disabled={hasErrors}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Formular absenden
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>

          {/* Save Template Modal */}
          <SaveTemplateModal
            isOpen={showSaveTemplateModal}
            onClose={() => setShowSaveTemplateModal(false)}
            onSave={handleSaveAsTemplate}
            fields={fields}
          />
        </div>
      )}
    </div>
  );
}