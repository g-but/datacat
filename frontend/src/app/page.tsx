'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormCard } from './components/FormCard';
import { DynamicForm } from './components/DynamicForm';
import { ModernFormBuilderLayout } from './components/ModernFormBuilderLayout';
import { MultiStepForm } from './components/MultiStepForm';
import { Button } from './components/Button';
import { hrIntakeTemplate } from './data/formTemplates';
import { hrOnboardingTemplate } from './data/multiStepTemplates';
import { FormData, FormTemplate, FieldConfig } from './types/form';

export default function Home() {
  const router = useRouter();
  const [currentTemplate, setCurrentTemplate] = useState<FormTemplate>(hrIntakeTemplate);
  const [useModernBuilder, setUseModernBuilder] = useState(true);
  
  // Check for selected template from templates page
  useEffect(() => {
    const selectedTemplate = localStorage.getItem('selected-template');
    if (selectedTemplate) {
      try {
        const template: FormTemplate = JSON.parse(selectedTemplate);
        setCurrentTemplate(template);
        localStorage.removeItem('selected-template'); // Clean up
      } catch (error) {
        console.error('Error loading selected template:', error);
      }
    }
  }, []);

  const handleSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  const handleFieldsChange = (fields: FieldConfig[]) => {
    console.log('Fields updated:', fields);
  };

  // If using modern builder, render it full-screen
  if (useModernBuilder && !currentTemplate.isMultiStep) {
    return (
      <ModernFormBuilderLayout
        initialFields={currentTemplate.fields}
        onSubmit={handleSubmit}
        onFieldsChange={handleFieldsChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FormCard
          title={currentTemplate.name}
          description={currentTemplate.description + " Sie können bei Bedarf benutzerdefinierte Felder hinzufügen."}
        >
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Vorlage:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{currentTemplate.name}</span>
                </div>
                {currentTemplate.isMultiStep && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    Mehrstufig
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useModernBuilder}
                    onChange={(e) => setUseModernBuilder(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Modern Builder</span>
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/templates')}
                >
                  Andere Vorlage wählen
                </Button>
              </div>
            </div>
          </div>
          
          {currentTemplate.isMultiStep && currentTemplate.steps ? (
            <MultiStepForm
              steps={currentTemplate.steps}
              onSubmit={handleSubmit}
              onStepsChange={(steps) => console.log('Steps updated:', steps)}
            />
          ) : (
            <DynamicForm
              initialFields={currentTemplate.fields}
              onSubmit={handleSubmit}
              onFieldsChange={handleFieldsChange}
            />
          )}
        </FormCard>
      </div>
    </div>
  );
}
