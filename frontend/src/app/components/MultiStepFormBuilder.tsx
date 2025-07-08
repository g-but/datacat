'use client';

import React, { useState, useEffect } from 'react';
import { FieldConfig, FormStep } from '../types/form';
import { FormField } from './FormField';
import { Button } from './Button';

interface MultiStepFormBuilderProps {
  steps: FormStep[];
  currentStep: number;
  onStepChange: (stepIndex: number) => void;
  formData: Record<string, string>;
  onFieldChange: (fieldName: string, value: string) => void;
  onSubmit: () => void;
  canSubmit: boolean;
}

export function MultiStepFormBuilder({
  steps,
  currentStep,
  onStepChange,
  formData,
  onFieldChange,
  onSubmit,
  canSubmit
}: MultiStepFormBuilderProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Check if current step is complete
  const isCurrentStepComplete = () => {
    if (!currentStepData) return false;
    
    const requiredFields = currentStepData.fields.filter(field => field.required);
    return requiredFields.every(field => formData[field.name]?.trim());
  };

  // Update completed steps when form data changes
  useEffect(() => {
    const newCompletedSteps = new Set<number>();
    
    steps.forEach((step, index) => {
      const requiredFields = step.fields.filter(field => field.required);
      const isComplete = requiredFields.every(field => formData[field.name]?.trim());
      
      if (isComplete || step.isOptional) {
        newCompletedSteps.add(index);
      }
    });
    
    setCompletedSteps(newCompletedSteps);
  }, [formData, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
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
        <p className="text-gray-500 dark:text-gray-400">Keine Schritte definiert</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${
                    status === 'completed'
                      ? 'bg-green-500 border-green-500 text-white'
                      : status === 'current'
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                  }`}
                  onClick={() => onStepChange(index)}
                >
                  {status === 'completed' ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-medium ${
                    status === 'current' 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {step.description}
                    </p>
                  )}
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        {/* Step Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentStepData.title}
              </h2>
              {currentStepData.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {currentStepData.description}
                </p>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Schritt {currentStep + 1} von {steps.length}
            </div>
          </div>
        </div>

        {/* Step Fields */}
        <div className="space-y-6">
          {currentStepData.fields.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-sm">Keine Felder in diesem Schritt</p>
              <p className="text-xs mt-1">Fügen Sie Felder über die Sidebar hinzu</p>
            </div>
          ) : (
            currentStepData.fields.map((field) => (
              <FormField
                key={field.id}
                {...field}
                value={formData[field.name] || ''}
                onChange={(e) => onFieldChange(field.name, e.target.value)}
              />
            ))
          )}
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            {!isFirstStep && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Zurück
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Step Completion Indicator */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isCurrentStepComplete() ? (
                <span className="text-green-600 dark:text-green-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Vollständig
                </span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">
                  {currentStepData.isOptional ? 'Optional' : 'Erforderlich'}
                </span>
              )}
            </div>

            {isLastStep ? (
              <Button
                type="button"
                onClick={onSubmit}
                disabled={!canSubmit}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Formular absenden
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentStepComplete() && !currentStepData.isOptional}
              >
                Weiter
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 