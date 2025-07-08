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
// The useTemplateManager is no longer needed as we save to the backend.
// import { useTemplateManager } from '../hooks/useTemplateManager';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { useFormBuilderStore } from '../hooks/useFormBuilderStore';
import { ModernFormBuilder } from './ModernFormBuilder';
import { FormPreviewModal } from './FormPreviewModal';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import AboutPage from '../about/page';
import { useAuth } from '../context/AuthContext'; // Import useAuth

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
  const { token } = useAuth(); // Use the auth context

  // Lifted state from SavedForms
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  const [formsLoading, setFormsLoading] = useState(true);

  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(undefined);
  const [currentView, setCurrentView] = useState<'builder' | 'templates' | 'saved-forms' | 'about'>('builder');
  const [formTitle, setFormTitle] = useState('Neues Formular');
  const [formDescription, setFormDescription] = useState(''); // Add description state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplatePreview, setSelectedTemplatePreview] = useState<TemplateData | SavedForm | null>(null);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);

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

  // Lifted effect from SavedForms
  useEffect(() => {
    const fetchForms = async () => {
      if (currentView !== 'saved-forms' || !token) {
        // We only fetch when the view is active and user is logged in
        setFormsLoading(false);
        return;
      }
      try {
        setFormsLoading(true);
        const res = await fetch('/api/forms', {
          headers: { 'x-auth-token': token },
        });
        if (!res.ok) throw new Error('Failed to fetch forms');
        const data = await res.json();
        const parsedData = data.map((form: any): SavedForm => ({
          id: form.id,
          title: form.title,
          description: form.description,
          fields: form.structure.fields || [],
          steps: form.structure.steps || [],
          isMultiStep: form.structure.isMultiStep || false,
          createdAt: form.created_at,
          updatedAt: form.updated_at,
          status: form.status,
          submissionCount: form.submission_count || 0,
          tags: form.structure.tags || [],
          category: form.structure.category,
        }));
        setSavedForms(parsedData);
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setFormsLoading(false);
      }
    };

    fetchForms();
  }, [token, currentView]);


  const allFields = isMultiStep ? steps.flatMap(s => s.fields) : fields;
  const { hasErrors, errors } = useFormValidation(allFields);
  const { saveNow, clearSavedData } = useAutoSave(formData, allFields);
  // const { saveTemplate } = useTemplateManager(); // This line is now removed.

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
    if (over && active.id !== over.id) {
      const flatFields = isMultiStep ? steps.flatMap(s => s.fields) : fields;
      const oldIndex = flatFields.findIndex((f) => f.id === active.id);
      const newIndex = flatFields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        moveField(oldIndex, newIndex);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasErrors) {
      clearSavedData();
      onSubmit(formData);
    }
  };

  const handleSaveForm = async (name: string, description: string) => {
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    const formPayload = {
      title: name,
      description: description,
      structure: { fields: allFields, steps, isMultiStep, tags: [] /* TODO: Implement tag editing */ },
      status: 'draft', // Or determine status from UI
    };

    const isUpdating = !!editingFormId;
    const url = isUpdating ? `/api/forms/${editingFormId}` : '/api/forms';
    const method = isUpdating ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(formPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isUpdating ? 'update' : 'save'} form`);
      }
      
      const savedForm = await response.json();

      if (isUpdating) {
        // Find and update the form in the local state
        setSavedForms(prev => prev.map(f => f.id === editingFormId ? { ...f, ...savedForm, ...savedForm.structure } : f));
      } else {
        // Add the new form to the local state
        setSavedForms(prev => [savedForm, ...prev]);
      }
      
      setShowSaveTemplateModal(false);
      setEditingFormId(null); // Reset editing state
      
    } catch (error) {
      console.error(`Error ${isUpdating ? 'updating' : 'saving'} form:`, error);
    }
  };

  const handleNewForm = () => {
    setInitialState({ fields: [], steps: [], isMultiStep: false });
    setFormTitle('Neues Formular');
    setFormDescription(''); // Reset description for new form
    setHasUnsavedChanges(false);
    setCurrentView('builder');
    setEditingFormId(null); // Ensure it's null for new forms
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
    setFormDescription(item.description || ''); // Set description on load
    setCurrentView('builder');
    if (isSavedForm) {
      setEditingFormId(item.id); // Set the ID for editing
    } else {
      setEditingFormId(null); // It's a new template, not an existing form
    }
  };

  const handleDeleteForm = async (formId: string) => {
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    // Optional: Add a confirmation dialog here before deleting
    // if (!confirm('Are you sure you want to delete this form?')) {
    //   return;
    // }

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete form');
      }

      // To update the UI, we would need to refetch the forms in SavedForms
      // or pass down a function to update the state here.
      // For now, the user will see the change on the next refresh/re-render of SavedForms.
      // A better implementation would involve lifting the forms state up to this component.
      console.log('Form deleted successfully');

      // Update state directly to trigger UI refresh
      setSavedForms(prevForms => prevForms.filter(form => form.id !== formId));

    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  const handleStatusChange = async (formId: string, newStatus: 'draft' | 'published' | 'archived') => {
    if (!token) return;

    try {
      const response = await fetch(`/api/forms/${formId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update form status');
      }
      
      const updatedForm = await response.json();
      
      // Update state directly to trigger UI refresh
      setSavedForms(prevForms => 
        prevForms.map(form => 
          form.id === formId ? { ...form, status: updatedForm.status, updatedAt: new Date().toISOString() } : form
        )
      );
      // Maybe show a success notification
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'templates':
        return <TemplateLibrary onUseTemplate={handleUseTemplate} onPreviewTemplate={setSelectedTemplatePreview} />;
      case 'saved-forms':
        return <SavedForms 
                  forms={savedForms} 
                  loading={formsLoading}
                  onLoadForm={handleUseTemplate} 
                  onDuplicateForm={() => {}} 
                  onDeleteForm={handleDeleteForm} 
                  onPreviewForm={setSelectedTemplatePreview} 
                  onStatusChange={handleStatusChange} // Pass down the new handler
                />;
      case 'about':
        return <AboutPage />;
      case 'builder':
      default:
        return (
          <div className="flex flex-1 h-full overflow-hidden">
            <ModernSidebar
              onSaveForm={() => setShowSaveTemplateModal(true)} // Rename prop here
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
            onSave={handleSaveForm} // Use the new handler
            onClose={() => {
              setShowSaveTemplateModal(false);
              setEditingFormId(null); // Also reset on close
            }}
            fields={allFields}
            initialName={formTitle}
            initialDescription={formDescription} // Use state for description
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