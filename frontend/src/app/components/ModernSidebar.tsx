'use client';

import React, { useState } from 'react';
import { FieldConfig, FormStep } from '../types/form';

interface FieldTypeOption {
  type: FieldConfig['type'];
  label: string;
  icon: string;
}

interface FieldTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: Omit<FieldConfig, 'id'>[];
}

interface ModernSidebarProps {
  onAddField: (type: FieldConfig['type']) => void;
  onAddFieldAtPosition?: (type: FieldConfig['type'], position: number) => void;
  onSaveTemplate: () => void;
  onSaveDraft: () => void;
  canSubmit: boolean;
  fields?: FieldConfig[];
  onFieldSelect?: (fieldId: string) => void;
  onFieldMove?: (fieldId: string, direction: 'up' | 'down') => void;
  onFieldDuplicate?: (fieldId: string) => void;
  onFieldDelete?: (fieldId: string) => void;
  onFieldReorder?: (fromIndex: number, toIndex: number) => void;
  onAddFieldTemplate?: (template: FieldTemplate) => void;
  selectedFieldId?: string;
  // Multi-step form props
  steps?: FormStep[];
  isMultiStep?: boolean;
  onToggleMultiStep?: () => void;
  onCreateStep?: (step: Omit<FormStep, 'id'>) => void;
  onCreateStepAtPosition?: (step: Omit<FormStep, 'id'>, position: number) => void;
  onUpdateStep?: (stepId: string, updates: Partial<FormStep>) => void;
  onDeleteStep?: (stepId: string) => void;
  onAssignFieldToStep?: (fieldId: string, stepId: string) => void;
  onReorderSteps?: (fromIndex: number, toIndex: number) => void;
  currentStep?: number;
  onStepChange?: (stepIndex: number) => void;
}

export function ModernSidebar({
  onAddField,
  onAddFieldAtPosition,
  onSaveTemplate,
  onSaveDraft,
  canSubmit,
  fields = [],
  onFieldSelect,
  onFieldMove,
  onFieldDuplicate,
  onFieldDelete,
  onFieldReorder,
  onAddFieldTemplate,
  selectedFieldId,
  // Multi-step props
  steps = [],
  isMultiStep = false,
  onToggleMultiStep,
  onCreateStep,
  onCreateStepAtPosition,
  onUpdateStep,
  onDeleteStep,
  onAssignFieldToStep,
  onReorderSteps,
  currentStep = 0,
  onStepChange
}: ModernSidebarProps) {
  const [activeTab, setActiveTab] = useState<'structure' | 'add' | 'templates' | 'steps'>('structure');
  const [showAddFields, setShowAddFields] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [previewOrder, setPreviewOrder] = useState<FieldConfig[]>([]);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
  const [highlightedFields, setHighlightedFields] = useState<{before: number | null, after: number | null}>({before: null, after: null});
  const [hoverInsertionIndex, setHoverInsertionIndex] = useState<number | null>(null);
  const [showFieldTypeSelector, setShowFieldTypeSelector] = useState(false);
  const [selectedInsertionPosition, setSelectedInsertionPosition] = useState<number | null>(null);
  const [hoverStepInsertionIndex, setHoverStepInsertionIndex] = useState<number | null>(null);

  const fieldTypes: FieldTypeOption[] = [
    { type: 'text', label: 'Text', icon: '📝' },
    { type: 'email', label: 'E-Mail', icon: '📧' },
    { type: 'tel', label: 'Telefon', icon: '📞' },
    { type: 'date', label: 'Datum', icon: '📅' },
    { type: 'select', label: 'Auswahl', icon: '📋' },
    { type: 'textarea', label: 'Textbereich', icon: '📄' }
  ];

  const fieldTemplates: FieldTemplate[] = [
    {
      id: 'personal-info',
      name: 'Persönliche Daten',
      description: 'Vorname, Nachname, Geburtsdatum',
      icon: '👤',
      fields: [
        { type: 'text', name: 'vorname', label: 'Vorname', required: true, placeholder: 'Vorname eingeben...' },
        { type: 'text', name: 'nachname', label: 'Nachname', required: true, placeholder: 'Nachname eingeben...' },
        { type: 'date', name: 'geburtsdatum', label: 'Geburtsdatum', required: false }
      ]
    },
    {
      id: 'contact-info',
      name: 'Kontaktdaten',
      description: 'E-Mail, Telefon, Handy',
      icon: '📞',
      fields: [
        { type: 'email', name: 'email', label: 'E-Mail-Adresse', required: true, placeholder: 'name@beispiel.de' },
        { type: 'tel', name: 'telefon', label: 'Telefon', required: false, placeholder: '+41 XX XXX XX XX' },
        { type: 'tel', name: 'handy', label: 'Handy', required: false, placeholder: '+41 XX XXX XX XX' }
      ]
    },
    {
      id: 'address-info',
      name: 'Adresse',
      description: 'Strasse, PLZ, Ort, Land',
      icon: '🏠',
      fields: [
        { type: 'text', name: 'strasse', label: 'Strasse und Hausnummer', required: true, placeholder: 'Musterstrasse 123' },
        { type: 'text', name: 'plz', label: 'PLZ', required: true, placeholder: '8000' },
        { type: 'text', name: 'ort', label: 'Ort', required: true, placeholder: 'Zürich' },
        { type: 'select', name: 'land', label: 'Land', required: true, options: [
          { value: '', label: 'Land wählen' },
          { value: 'ch', label: 'Schweiz' },
          { value: 'de', label: 'Deutschland' },
          { value: 'at', label: 'Österreich' },
          { value: 'fr', label: 'Frankreich' }
        ]}
      ]
    },
    {
      id: 'work-info',
      name: 'Berufsinformationen',
      description: 'Position, Abteilung, Startdatum',
      icon: '💼',
      fields: [
        { type: 'text', name: 'position', label: 'Position', required: true, placeholder: 'z.B. Software Engineer' },
        { type: 'text', name: 'abteilung', label: 'Abteilung', required: false, placeholder: 'z.B. IT' },
        { type: 'date', name: 'startdatum', label: 'Startdatum', required: true },
        { type: 'select', name: 'arbeitszeit', label: 'Arbeitszeit', required: true, options: [
          { value: '', label: 'Arbeitszeit wählen' },
          { value: 'vollzeit', label: 'Vollzeit' },
          { value: 'teilzeit', label: 'Teilzeit' },
          { value: 'praktikum', label: 'Praktikum' }
        ]}
      ]
    },
    {
      id: 'emergency-contact',
      name: 'Notfallkontakt',
      description: 'Name, Beziehung, Telefon',
      icon: '🚨',
      fields: [
        { type: 'text', name: 'notfall_name', label: 'Name der Kontaktperson', required: true, placeholder: 'Vollständiger Name' },
        { type: 'text', name: 'notfall_beziehung', label: 'Beziehung', required: true, placeholder: 'z.B. Ehepartner, Eltern' },
        { type: 'tel', name: 'notfall_telefon', label: 'Telefonnummer', required: true, placeholder: '+41 XX XXX XX XX' }
      ]
    }
  ];

  const getFieldIcon = (type: FieldConfig['type']) => {
    return fieldTypes.find(ft => ft.type === type)?.icon || '📝';
  };

  const handleQuickAdd = (type: FieldConfig['type']) => {
    onAddField(type);
    setShowAddFields(false);
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 't':
            e.preventDefault();
            handleQuickAdd('text');
            break;
          case 'e':
            e.preventDefault();
            handleQuickAdd('email');
            break;
          case 's':
            e.preventDefault();
            onSaveDraft();
            break;
          case 'n':
            e.preventDefault();
            setActiveTab('add');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddTemplate = (template: FieldTemplate) => {
    onAddFieldTemplate?.(template);
  };

  const handleInsertionClick = (position: number) => {
    setSelectedInsertionPosition(position);
    setShowFieldTypeSelector(true);
  };

  const handleFieldTypeSelect = (type: FieldConfig['type']) => {
    if (selectedInsertionPosition !== null) {
      onAddFieldAtPosition?.(type, selectedInsertionPosition);
    }
    setShowFieldTypeSelector(false);
    setSelectedInsertionPosition(null);
    setHoverInsertionIndex(null);
  };

  const handleInsertionHover = (position: number) => {
    setHoverInsertionIndex(position);
  };

  const handleInsertionLeave = () => {
    setHoverInsertionIndex(null);
  };

  const handleStepInsertionClick = (position: number) => {
    onCreateStepAtPosition?.({
      title: `Schritt ${position + 1}`,
      description: '',
      fields: [],
      isOptional: false
    }, position);
  };

  const handleStepInsertionHover = (position: number) => {
    setHoverStepInsertionIndex(position);
  };

  const handleStepInsertionLeave = () => {
    setHoverStepInsertionIndex(null);
  };

  // Helper function to create live preview order
  const createPreviewOrder = (dragIndex: number, hoverIndex: number): FieldConfig[] => {
    const newOrder = [...fields];
    const draggedField = newOrder[dragIndex];
    
    // Remove dragged field from its current position
    newOrder.splice(dragIndex, 1);
    
    // Adjust insertion index if we're moving down
    const adjustedIndex = hoverIndex > dragIndex ? hoverIndex - 1 : hoverIndex;
    
    // Insert it at the new position
    newOrder.splice(adjustedIndex, 0, draggedField);
    
    return newOrder;
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    setPreviewOrder([...fields]); // Initialize preview with current order
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
      // Create live preview of the new order
      const newPreviewOrder = createPreviewOrder(draggedIndex, index);
      setPreviewOrder(newPreviewOrder);
    }
  };

  // Handle drag over container (between fields)
  const handleContainerDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex === null) return;
    
    // Calculate insertion point based on mouse position
    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    // Find all field elements
    const fieldElements = container.querySelectorAll('[data-field-index]');
    let insertIndex = fields.length; // Default to end
    
    for (let i = 0; i < fieldElements.length; i++) {
      const fieldElement = fieldElements[i] as HTMLElement;
      const fieldRect = fieldElement.getBoundingClientRect();
      const fieldY = fieldRect.top - rect.top;
      const fieldHeight = fieldRect.height;
      
      // If mouse is in the upper half of this field, insert before it
      if (y < fieldY + fieldHeight / 2) {
        insertIndex = i;
        break;
      }
    }
    
    // Don't show insertion indicator if dropping on same position
    if (insertIndex === draggedIndex || insertIndex === draggedIndex + 1) {
      setInsertionIndex(null);
      setHighlightedFields({before: null, after: null});
      return;
    }
    
    setInsertionIndex(insertIndex);
    
    // Calculate the actual final positions after the drag operation
    const finalOrder = createPreviewOrder(draggedIndex, insertIndex);
    
    // Find the fields that will be before and after the dragged field in the final order
    const draggedFieldId = fields[draggedIndex].id;
    const finalDraggedIndex = finalOrder.findIndex(f => f.id === draggedFieldId);
    
    const beforeIndex = finalDraggedIndex > 0 ? finalDraggedIndex - 1 : null;
    const afterIndex = finalDraggedIndex < finalOrder.length - 1 ? finalDraggedIndex + 1 : null;
    
    // Map back to original indices for highlighting
    const beforeFieldId = beforeIndex !== null ? finalOrder[beforeIndex].id : null;
    const afterFieldId = afterIndex !== null ? finalOrder[afterIndex].id : null;
    
    const originalBeforeIndex = beforeFieldId ? fields.findIndex(f => f.id === beforeFieldId) : null;
    const originalAfterIndex = afterFieldId ? fields.findIndex(f => f.id === afterFieldId) : null;
    
    setHighlightedFields({
      before: originalBeforeIndex,
      after: originalAfterIndex
    });
    
    // Create preview order for insertion
    setPreviewOrder(finalOrder);
  };

  // Handle drop on container
  const handleContainerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null && insertionIndex !== null) {
      // Use the same logic as createPreviewOrder for consistency
      const targetIndex = insertionIndex > draggedIndex ? insertionIndex - 1 : insertionIndex;
      onFieldReorder?.(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    setPreviewOrder([]);
    setInsertionIndex(null);
    setHighlightedFields({before: null, after: null});
  };

  const handleDragLeave = () => {
    // Don't reset dragOverIndex here to maintain smooth transitions
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onFieldReorder?.(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    setPreviewOrder([]);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setPreviewOrder([]);
    setInsertionIndex(null);
    setHighlightedFields({before: null, after: null});
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Formular Builder
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Verwalten Sie Ihre Formularstruktur
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('structure')}
          className={`flex-1 px-2 py-3 text-xs font-medium transition-colors ${
            activeTab === 'structure'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Struktur
        </button>
        <button
          onClick={() => setActiveTab('steps')}
          className={`flex-1 px-2 py-3 text-xs font-medium transition-colors ${
            activeTab === 'steps'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Schritte
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 px-2 py-3 text-xs font-medium transition-colors ${
            activeTab === 'templates'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Vorlagen
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 px-2 py-3 text-xs font-medium transition-colors ${
            activeTab === 'add'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Felder
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'structure' && (
          <div className="p-4 space-y-4">
            {/* Quick Actions */}
            <div className="space-y-2 mb-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickAdd('text')}
                  className="flex items-center justify-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                  title="Schnell Text-Feld hinzufügen"
                >
                  <span className="mr-1">📝</span>
                  Text
                </button>
                <button
                  onClick={() => handleQuickAdd('email')}
                  className="flex items-center justify-center px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm font-medium"
                  title="Schnell E-Mail-Feld hinzufügen"
                >
                  <span className="mr-1">📧</span>
                  E-Mail
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickAdd('select')}
                  className="flex items-center justify-center px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium"
                  title="Schnell Auswahl-Feld hinzufügen"
                >
                  <span className="mr-1">📋</span>
                  Auswahl
                </button>
                <button
                  onClick={() => handleQuickAdd('textarea')}
                  className="flex items-center justify-center px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors text-sm font-medium"
                  title="Schnell Textbereich hinzufügen"
                >
                  <span className="mr-1">📄</span>
                  Textbereich
                </button>
              </div>
            </div>

            {/* Form Structure */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Formular Struktur ({fields.length})
                </h3>
                {fields.length > 0 && (
                  <button
                    onClick={onSaveTemplate}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    title="Als Vorlage speichern"
                  >
                    Als Vorlage
                  </button>
                )}
              </div>
          
              {fields.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-sm">Noch keine Felder</p>
                  <p className="text-xs mt-1">Wählen Sie "Vorlagen" oder "Felder"</p>
                </div>
              ) : (
                <div 
                  className="space-y-2"
                  onDragOver={handleContainerDragOver}
                  onDrop={handleContainerDrop}
                >
                  {/* Insertion point at the beginning */}
                  {draggedIndex === null && (
                    <div
                      className={`transition-all duration-200 ${
                        hoverInsertionIndex === 0 ? 'h-8' : 'h-2'
                      }`}
                      onMouseEnter={() => handleInsertionHover(0)}
                      onMouseLeave={handleInsertionLeave}
                      onClick={() => handleInsertionClick(0)}
                    >
                      {hoverInsertionIndex === 0 && (
                        <div className="h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Feld hinzufügen
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Use preview order during drag, otherwise use original fields */}
                  {(previewOrder.length > 0 ? previewOrder : fields).map((field, index) => {
                    // Find the original index for drag handlers
                    const originalIndex = fields.findIndex(f => f.id === field.id);
                    return (
                    <React.Fragment key={field.id}>
                      {/* Enhanced insertion indicator with context (only during drag) */}
                      {draggedIndex !== null && insertionIndex === index && (
                        <div className="relative my-2">
                          {/* Context text */}
                          <div className="text-center mb-2">
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700">
                              {index === 0 ? 'An den Anfang' : 
                               index === fields.length ? 'An das Ende' : 
                               highlightedFields.before !== null && highlightedFields.after !== null
                                 ? `Zwischen "${fields[highlightedFields.before]?.label}" und "${fields[highlightedFields.after]?.label}"`
                                 : highlightedFields.before !== null
                                 ? `Nach "${fields[highlightedFields.before]?.label}"`
                                 : highlightedFields.after !== null
                                 ? `Vor "${fields[highlightedFields.after]?.label}"`
                                 : 'Hier einfügen'}
                            </span>
                          </div>
                          {/* Enhanced insertion line */}
                          <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full mx-2 animate-pulse shadow-lg relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-700 rounded-full animate-pulse"></div>
                            {/* Arrow indicators */}
                            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rotate-45 border-2 border-white dark:border-gray-800 shadow-md"></div>
                            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rotate-45 border-2 border-white dark:border-gray-800 shadow-md"></div>
                          </div>
                        </div>
                      )}
                      
                      <div
                        data-field-index={originalIndex}
                        draggable
                        onDragStart={(e) => handleDragStart(e, originalIndex)}
                        onDragOver={(e) => handleDragOver(e, originalIndex)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, originalIndex)}
                        onDragEnd={handleDragEnd}
                        className={`p-3 rounded-lg border transition-all duration-200 cursor-move ${
                          selectedFieldId === field.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                            : draggedIndex === originalIndex
                            ? 'bg-gray-200 dark:bg-gray-600 border-gray-400 dark:border-gray-500 opacity-50 scale-105'
                            : dragOverIndex === originalIndex
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-600'
                            : highlightedFields.before === originalIndex || highlightedFields.after === originalIndex
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600 ring-2 ring-green-200 dark:ring-green-800'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => onFieldSelect?.(field.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1 min-w-0">
                            {/* Drag Handle */}
                            <div className="mr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-move">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                              </svg>
                            </div>
                            
                            <div className="text-lg mr-2">{getFieldIcon(field.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {field.label}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                {field.type}
                                {field.required && (
                                  <span className="ml-1 text-red-500">*</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Field Actions */}
                          <div className="flex items-center space-x-1 ml-2">
                            {/* Duplicate */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onFieldDuplicate?.(field.id);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                              title="Duplizieren"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            
                            {/* Delete */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onFieldDelete?.(field.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              title="Löschen"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Insertion point after each field (only when not dragging) */}
                      {draggedIndex === null && (
                        <div
                          className={`transition-all duration-200 ${
                            hoverInsertionIndex === originalIndex + 1 ? 'h-8' : 'h-2'
                          }`}
                          onMouseEnter={() => handleInsertionHover(originalIndex + 1)}
                          onMouseLeave={handleInsertionLeave}
                          onClick={() => handleInsertionClick(originalIndex + 1)}
                        >
                          {hoverInsertionIndex === originalIndex + 1 && (
                            <div className="h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Feld hinzufügen
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                    );
                  })}
                  
                  {/* Enhanced insertion indicator at the end */}
                  {insertionIndex === fields.length && (
                    <div className="relative my-2">
                      {/* Context text */}
                      <div className="text-center mb-2">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700">
                          An das Ende
                        </span>
                      </div>
                      {/* Enhanced insertion line */}
                      <div className="h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full mx-2 animate-pulse shadow-lg relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-700 rounded-full animate-pulse"></div>
                        {/* Arrow indicators */}
                        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rotate-45 border-2 border-white dark:border-gray-800 shadow-md"></div>
                        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rotate-45 border-2 border-white dark:border-gray-800 shadow-md"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Keyboard Shortcuts Help */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Tastenkürzel</h4>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Text-Feld:</span>
                    <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Ctrl+T</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>E-Mail-Feld:</span>
                    <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Ctrl+E</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Speichern:</span>
                    <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Ctrl+S</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Felder hinzufügen:</span>
                    <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Ctrl+N</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="p-4 space-y-4">
            {/* Multi-step Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Multi-Step Form</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Aufteilen in mehrere Schritte</p>
              </div>
              <button
                onClick={onToggleMultiStep}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isMultiStep
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isMultiStep ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {isMultiStep ? (
              <div className="space-y-4">
                {/* Steps List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Schritte ({steps.length})
                    </h3>
                    <button
                      onClick={() => onCreateStep?.({
                        title: `Schritt ${steps.length + 1}`,
                        description: '',
                        fields: [],
                        isOptional: false
                      })}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Schritt
                    </button>
                  </div>

                  {steps.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-sm">Noch keine Schritte</p>
                      <p className="text-xs mt-1">Erstellen Sie Ihren ersten Schritt</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Insertion point at the beginning */}
                      <div
                        className={`transition-all duration-200 ${
                          hoverStepInsertionIndex === 0 ? 'h-8' : 'h-2'
                        }`}
                        onMouseEnter={() => handleStepInsertionHover(0)}
                        onMouseLeave={handleStepInsertionLeave}
                        onClick={() => handleStepInsertionClick(0)}
                      >
                        {hoverStepInsertionIndex === 0 && (
                          <div className="h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Schritt hinzufügen
                            </span>
                          </div>
                        )}
                      </div>

                      {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                          <div
                            className={`p-3 rounded-lg border transition-all cursor-pointer ${
                              currentStep === index
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => onStepChange?.(index)}
                          >
                            <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1 min-w-0">
                              <div className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium mr-3">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {step.title}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {step.fields.length} Felder
                                  {step.isOptional && ' • Optional'}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteStep?.(step.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                title="Schritt löschen"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Insertion point after each step */}
                          <div
                            className={`transition-all duration-200 ${
                              hoverStepInsertionIndex === index + 1 ? 'h-8' : 'h-2'
                            }`}
                            onMouseEnter={() => handleStepInsertionHover(index + 1)}
                            onMouseLeave={handleStepInsertionLeave}
                            onClick={() => handleStepInsertionClick(index + 1)}
                          >
                            {hoverStepInsertionIndex === index + 1 && (
                              <div className="h-8 bg-blue-100 dark:bg-blue-900/30 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  Schritt hinzufügen
                                </span>
                              </div>
                            )}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                {/* Field Assignment */}
                {steps.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                      Felder zuweisen
                    </h3>
                    
                    <div className="space-y-2">
                      {fields.filter(field => !field.step).map((field) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="text-lg mr-2">{getFieldIcon(field.type)}</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {field.label}
                            </div>
                          </div>
                          <select
                            onChange={(e) => onAssignFieldToStep?.(field.id, e.target.value)}
                            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
                          >
                            <option value="">Schritt wählen</option>
                            {steps.map((step, index) => (
                              <option key={step.id} value={step.id}>
                                Schritt {index + 1}: {step.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>

                    {fields.filter(field => !field.step).length === 0 && (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        <p className="text-sm">Alle Felder sind Schritten zugewiesen</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-sm">Einfaches Formular</p>
                <p className="text-xs mt-1">Aktivieren Sie Multi-Step für erweiterte Optionen</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
              Feld-Vorlagen
            </h3>
            
            <div className="space-y-3">
              {fieldTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleAddTemplate(template)}
                >
                  <div className="flex items-start">
                    <div className="text-2xl mr-3 mt-1">{template.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {template.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {template.description}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {template.fields.length} Felder
                </div>
              </div>
                    <div className="text-gray-400 group-hover:text-blue-500 transition-colors ml-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
              Einzelne Felder
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {fieldTypes.map((field) => (
                <button
                  key={field.type}
                  onClick={() => handleQuickAdd(field.type)}
                  className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 text-center group"
                >
                  <div className="text-xl mb-2">{field.icon}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {field.label}
              </div>
            </button>
          ))}
        </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        <button
          onClick={onSaveDraft}
          className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Entwurf speichern
        </button>

        <button
          onClick={onSaveTemplate}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-800 text-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Als Vorlage speichern
        </button>
      </div>

      {/* Field Type Selector Modal */}
      {showFieldTypeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowFieldTypeSelector(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Feldtyp auswählen
              </h3>
              <button
                onClick={() => setShowFieldTypeSelector(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {fieldTypes.map((field) => (
                <button
                  key={field.type}
                  onClick={() => handleFieldTypeSelect(field.type)}
                  className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 text-center group"
                >
                  <div className="text-2xl mb-2">{field.icon}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {field.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}