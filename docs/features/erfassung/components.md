# Erfassung 5-Step Workflow UI Design

## Overview
Detailed UI component design for the Erfassung product cataloging workflow, following the established Formular design patterns and maintaining consistency with existing components.

## Workflow Steps

### Step Definition
```typescript
interface ErfassungStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<ErfassungStepProps>;
  isOptional: boolean;
  canSkip: boolean;
  validationRequired: boolean;
}

const erfassungSteps: ErfassungStep[] = [
  {
    id: 'photos',
    title: 'Fotos hochladen',
    description: 'Laden Sie Produktfotos für die KI-Analyse hoch',
    component: PhotoUploadStep,
    isOptional: false,
    canSkip: false,
    validationRequired: true
  },
  {
    id: 'analysis',
    title: 'KI-Analyse',
    description: 'Automatische Erkennung von Produktdaten',
    component: AnalysisStep,
    isOptional: false,
    canSkip: false,
    validationRequired: false
  },
  {
    id: 'review',
    title: 'Daten prüfen',
    description: 'Überprüfen und korrigieren Sie die erkannten Daten',
    component: ReviewStep,
    isOptional: false,
    canSkip: false,
    validationRequired: true
  },
  {
    id: 'export',
    title: 'Export',
    description: 'Exportieren Sie die Daten in Ihr ERP-System',
    component: ExportStep,
    isOptional: true,
    canSkip: true,
    validationRequired: false
  },
  {
    id: 'inventory',
    title: 'Tabellen-Übersicht',
    description: 'Verwalten Sie Ihre strukturierten Produktdaten',
    component: InventoryStep,
    isOptional: true,
    canSkip: true,
    validationRequired: false
  }
];
```

## Main Workflow Component

### ErfassungWorkflow.tsx
```typescript
'use client';

import React, { useState, useCallback } from 'react';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { PhotoUploadStep } from './steps/PhotoUploadStep';
import { AnalysisStep } from './steps/AnalysisStep';
import { ReviewStep } from './steps/ReviewStep';
import { ExportStep } from './steps/ExportStep';
import { InventoryStep } from './steps/InventoryStep';
import { Button } from '../components/Button';
import { useErfassungStore } from '../hooks/useErfassungStore';

interface ErfassungWorkflowProps {
  productId?: string; // For editing existing products
  mode?: 'create' | 'edit' | 'view';
}

export function ErfassungWorkflow({ 
  productId, 
  mode = 'create' 
}: ErfassungWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const {
    product,
    photos,
    analysisResults,
    isProcessing,
    validateStep,
    canProceedToStep
  } = useErfassungStore();

  const stepComponents = [
    PhotoUploadStep,
    AnalysisStep,
    ReviewStep,
    ExportStep,
    InventoryStep
  ];

  const handleStepChange = useCallback(async (stepIndex: number) => {
    if (stepIndex === currentStep) return;
    
    // Validate current step before proceeding
    if (stepIndex > currentStep) {
      const isValid = await validateStep(currentStep);
      if (!isValid) return;
      
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
    }
    
    // Check if user can access the target step
    if (canProceedToStep(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  }, [currentStep, completedSteps, validateStep, canProceedToStep]);

  const handleNext = () => {
    if (currentStep < erfassungSteps.length - 1) {
      handleStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = stepComponents[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {mode === 'edit' ? 'Produkt bearbeiten' : 'Neues Produkt erfassen'}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {erfassungSteps[currentStep].description}
              </p>
            </div>
            
            {/* Save Draft Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* Save draft logic */}}
              disabled={isProcessing}
            >
              Entwurf speichern
            </Button>
          </div>
          
          {/* Progress Indicator */}
          <div className="mt-6">
            <ProgressIndicator
              steps={erfassungSteps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepChange}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CurrentStepComponent
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={currentStep < erfassungSteps.length - 1}
            canGoPrevious={currentStep > 0}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
```

## Step Components

### 1. Photo Upload Step (PhotoUploadStep.tsx)
```typescript
'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/Button';

interface PhotoUploadStepProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isProcessing: boolean;
}

export function PhotoUploadStep({
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isProcessing
}: PhotoUploadStepProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });
    
    setPhotos(prev => [...prev, ...validFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 10,
    multiple: true
  });

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const canProceed = photos.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-8">
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Produktfotos hochladen
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Laden Sie 1-10 Fotos Ihres Produkts hoch. Verschiedene Winkel und Details helfen der KI bei der Analyse.
          </p>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <input {...getInputProps()} />
          <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          
          {isDragActive ? (
            <p className="text-blue-600 dark:text-blue-400">
              Fotos hier ablegen...
            </p>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Klicken Sie hier oder ziehen Sie Fotos hierher
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                JPG, PNG, WebP bis zu 10MB pro Datei
              </p>
            </div>
          )}
        </div>

        {/* Photo Preview Grid */}
        {photos.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Hochgeladene Fotos ({photos.length}/10)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={`${photo.name}-${index}`}
                  className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"
                >
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Produkt Foto ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removePhoto(index)}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-all"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs truncate">{photo.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photo Type Hints */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
            Empfohlene Fotoarten für beste Ergebnisse:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Produktübersicht (alle Seiten)
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Typenschild/Etikett (Nahaufnahme)
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Maßangaben (mit Lineal/Maßband)
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Gewicht (auf Waage)
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
        >
          Zurück
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canProceed || !canGoNext}
          className="min-w-[120px]"
        >
          {isProcessing ? 'Lädt...' : 'Weiter zur Analyse'}
        </Button>
      </div>
    </div>
  );
}
```

### 2. Analysis Step (AnalysisStep.tsx)
```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { CogIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/Button';

interface AnalysisStepProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isProcessing: boolean;
}

export function AnalysisStep({
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isProcessing
}: AnalysisStepProps) {
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const analysisTasks = [
    { name: 'Fotos werden verarbeitet...', duration: 2000 },
    { name: 'Text wird erkannt (OCR)...', duration: 3000 },
    { name: 'Produktkategorie wird bestimmt...', duration: 2500 },
    { name: 'Abmessungen werden geschätzt...', duration: 2000 },
    { name: 'Produktbeschreibung wird generiert...', duration: 3500 },
    { name: 'Analyse wird abgeschlossen...', duration: 1000 }
  ];

  useEffect(() => {
    let taskIndex = 0;
    let progress = 0;

    const runAnalysis = () => {
      if (taskIndex < analysisTasks.length) {
        const task = analysisTasks[taskIndex];
        setCurrentTask(task.name);
        
        const increment = 100 / analysisTasks.length;
        const duration = task.duration;
        const steps = 20;
        const stepDuration = duration / steps;
        const stepIncrement = increment / steps;
        
        let step = 0;
        const interval = setInterval(() => {
          step++;
          progress += stepIncrement;
          setAnalysisProgress(Math.min(progress, (taskIndex + 1) * increment));
          
          if (step >= steps) {
            clearInterval(interval);
            taskIndex++;
            if (taskIndex < analysisTasks.length) {
              setTimeout(runAnalysis, 200);
            } else {
              setAnalysisComplete(true);
              setCurrentTask('Analyse abgeschlossen!');
            }
          }
        }, stepDuration);
      }
    };

    if (!analysisComplete && isProcessing) {
      runAnalysis();
    }
  }, [isProcessing, analysisComplete]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-8">
          {analysisComplete ? (
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
          ) : (
            <CogIcon className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          )}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {analysisComplete ? 'Analyse abgeschlossen' : 'KI-Analyse läuft'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {analysisComplete 
              ? 'Die Produktdaten wurden erfolgreich analysiert und extrahiert.'
              : 'Unsere KI analysiert Ihre Produktfotos und extrahiert relevante Informationen.'
            }
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{currentTask}</span>
            <span>{Math.round(analysisProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
        </div>

        {/* Analysis Results Preview */}
        {analysisComplete && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
            <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-4">
              Erkannte Daten (Vorschau)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-800 dark:text-green-200">Produkttyp:</span>
                <span className="ml-2 text-green-700 dark:text-green-300">Elektronikgerät</span>
              </div>
              <div>
                <span className="font-medium text-green-800 dark:text-green-200">Hersteller:</span>
                <span className="ml-2 text-green-700 dark:text-green-300">Samsung</span>
              </div>
              <div>
                <span className="font-medium text-green-800 dark:text-green-200">Modell:</span>
                <span className="ml-2 text-green-700 dark:text-green-300">Galaxy Tab S8</span>
              </div>
              <div>
                <span className="font-medium text-green-800 dark:text-green-200">Vertrauen:</span>
                <span className="ml-2 text-green-700 dark:text-green-300">87%</span>
              </div>
            </div>
          </div>
        )}

        {/* Warning for Low Confidence */}
        {analysisComplete && (
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Überprüfung empfohlen
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Einige Daten wurden mit geringer Sicherheit erkannt. Bitte überprüfen Sie die Ergebnisse im nächsten Schritt.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || !analysisComplete}
        >
          Zurück
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!analysisComplete || !canGoNext}
          className="min-w-[120px]"
        >
          Daten überprüfen
        </Button>
      </div>
    </div>
  );
}
```

### 3. Review Step (ReviewStep.tsx)
```typescript
'use client';

import React, { useState } from 'react';
import { PencilIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/Button';

interface ReviewStepProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isProcessing: boolean;
}

export function ReviewStep({
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isProcessing
}: ReviewStepProps) {
  const [productData, setProductData] = useState({
    title: 'Samsung Galaxy Tab S8',
    articleNumber: 'SM-X700NZAA',
    manufacturer: 'Samsung',
    shortDescription: 'Android Tablet mit 11" Display',
    longDescription: 'Hochwertiges Android-Tablet mit 11-Zoll-Display, 8GB RAM und 128GB Speicher. Perfekt für Arbeit und Entertainment.',
    length: 253.8,
    width: 165.3,
    height: 6.3,
    weight: 503,
    mainCategoryA: 'Elektronik',
    mainCategoryB: 'Computer & Tablets',
    subCategoryA: 'Tablets',
    subCategoryB: 'Android Tablets',
    stockQuantity: 15,
    price: 649.99,
    unit: 'Stück'
  });

  const [confidenceScores, setConfidenceScores] = useState({
    title: 0.92,
    articleNumber: 0.87,
    manufacturer: 0.95,
    shortDescription: 0.78,
    longDescription: 0.82,
    length: 0.65,
    width: 0.65,
    height: 0.68,
    weight: 0.89,
    mainCategoryA: 0.91,
    mainCategoryB: 0.88,
    subCategoryA: 0.93,
    subCategoryB: 0.85
  });

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 dark:text-green-400';
    if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConfidenceIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircleIcon className="h-4 w-4" />;
    return <ExclamationTriangleIcon className="h-4 w-4" />;
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Produktdaten überprüfen und korrigieren
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Überprüfen Sie die von der KI erkannten Daten und korrigieren Sie diese bei Bedarf.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Grundinformationen
            </h3>
            
            {Object.entries(productData).slice(0, 5).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {key === 'title' && 'Produkttitel'}
                    {key === 'articleNumber' && 'Artikelnummer'}
                    {key === 'manufacturer' && 'Hersteller'}
                    {key === 'shortDescription' && 'Kurzbeschreibung'}
                    {key === 'longDescription' && 'Ausführliche Beschreibung'}
                  </label>
                  {confidenceScores[key as keyof typeof confidenceScores] && (
                    <div className={`flex items-center text-xs ${getConfidenceColor(confidenceScores[key as keyof typeof confidenceScores])}`}>
                      {getConfidenceIcon(confidenceScores[key as keyof typeof confidenceScores])}
                      <span className="ml-1">
                        {Math.round(confidenceScores[key as keyof typeof confidenceScores] * 100)}%
                      </span>
                    </div>
                  )}
                </div>
                
                {key === 'longDescription' ? (
                  <textarea
                    value={value as string}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Dimensions and Categories */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Abmessungen & Kategorien
            </h3>
            
            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              {['length', 'width', 'height', 'weight'].map((dimension) => (
                <div key={dimension} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {dimension === 'length' && 'Länge (mm)'}
                      {dimension === 'width' && 'Breite (mm)'}
                      {dimension === 'height' && 'Höhe (mm)'}
                      {dimension === 'weight' && 'Gewicht (g)'}
                    </label>
                    {confidenceScores[dimension as keyof typeof confidenceScores] && (
                      <div className={`flex items-center text-xs ${getConfidenceColor(confidenceScores[dimension as keyof typeof confidenceScores])}`}>
                        {getConfidenceIcon(confidenceScores[dimension as keyof typeof confidenceScores])}
                        <span className="ml-1">
                          {Math.round(confidenceScores[dimension as keyof typeof confidenceScores] * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={productData[dimension as keyof typeof productData] as number}
                    onChange={(e) => handleFieldChange(dimension, parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
            </div>

            {/* Categories */}
            <div className="space-y-4">
              {['mainCategoryA', 'mainCategoryB', 'subCategoryA', 'subCategoryB'].map((category) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category === 'mainCategoryA' && 'Hauptkategorie A'}
                      {category === 'mainCategoryB' && 'Hauptkategorie B'}
                      {category === 'subCategoryA' && 'Unterkategorie A'}
                      {category === 'subCategoryB' && 'Unterkategorie B'}
                    </label>
                    {confidenceScores[category as keyof typeof confidenceScores] && (
                      <div className={`flex items-center text-xs ${getConfidenceColor(confidenceScores[category as keyof typeof confidenceScores])}`}>
                        {getConfidenceIcon(confidenceScores[category as keyof typeof confidenceScores])}
                        <span className="ml-1">
                          {Math.round(confidenceScores[category as keyof typeof confidenceScores] * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={productData[category as keyof typeof productData] as string}
                    onChange={(e) => handleFieldChange(category, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
        >
          Zurück
        </Button>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => {/* Save draft */}}
            disabled={isProcessing}
          >
            Als Entwurf speichern
          </Button>
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            className="min-w-[120px]"
          >
            Zum Tabellen-Export
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## Responsive Design Considerations

### Mobile Optimization
- Touch-friendly photo upload interface
- Collapsible sections for better mobile navigation
- Swipe gestures for step navigation
- Optimized form inputs for mobile keyboards

### Tablet Optimization
- Grid layouts optimized for tablet screens
- Enhanced photo preview for better product inspection
- Multi-column forms for efficient data entry

### Desktop Enhancements
- Drag-and-drop photo reordering
- Keyboard shortcuts for power users
- Side-by-side photo and data comparison
- Advanced filtering and search capabilities

## Accessibility Features

### Screen Reader Support
- Proper ARIA labels for all interactive elements
- Descriptive alt text for product photos
- Clear navigation announcements
- Step progress announcements

### Keyboard Navigation
- Full keyboard accessibility
- Logical tab order
- Skip links for efficiency
- Keyboard shortcuts for common actions

### Visual Accessibility
- High contrast mode support
- Configurable text sizing
- Color-blind friendly confidence indicators
- Clear focus indicators

## Performance Optimization

### Progressive Loading
- Lazy load photo previews
- Progressive form rendering
- Background processing indicators
- Optimistic UI updates

### Caching Strategy
- Cache uploaded photos locally
- Store form progress in localStorage
- Implement offline mode for data entry
- Background sync when online

## Next Steps

1. **Component Implementation**: Build individual step components
2. **State Management**: Implement useErfassungStore hook
3. **API Integration**: Connect with backend services
4. **Testing**: Unit and integration tests
5. **User Testing**: Validate workflow with real users
6. **Performance Optimization**: Implement performance improvements
7. **Accessibility Audit**: Ensure full accessibility compliance