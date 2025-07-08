'use client';

import React, { useState } from 'react';
import { FieldConfig, FormStep, FieldTemplate } from '../types/form';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fieldTemplates } from '../data/fieldTemplates';
import { useFormBuilderStore } from '../hooks/useFormBuilderStore';
import { FieldEditor } from './FieldEditor';

interface FieldTypeOption {
  type: FieldConfig['type'];
  label: string;
  icon: string;
}

interface ModernSidebarProps {
  onSaveForm: () => void; // Rename prop in interface
  selectedFieldId?: string;
  onFieldSelect: (fieldId?: string) => void;
  onFieldUpdate: (fieldId: string, updates: Partial<FieldConfig>) => void;
}

// Sortable wrapper for sidebar field item
interface SortableSidebarItemProps {
  field: FieldConfig;
  selectedFieldId?: string;
  onFieldSelect: (id: string) => void;
  onFieldDuplicate: (id: string, stepId?: string) => void;
  onFieldDelete: (id: string, stepId?: string) => void;
  getFieldIcon: (type: FieldConfig['type']) => string;
}

function SortableSidebarItem({ 
  field, 
  selectedFieldId, 
  onFieldSelect, 
  onFieldDuplicate, 
  onFieldDelete, 
  getFieldIcon 
}: SortableSidebarItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}
      className={`p-3 rounded-lg border transition-all duration-200 group ${
        selectedFieldId === field.id
          ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-400 dark:border-blue-600'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
      onClick={() => onFieldSelect(field.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0" {...attributes} {...listeners}>
          <div className="text-lg mr-3 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing">⠿</div>
          <div className="text-lg mr-2">{getFieldIcon(field.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{field.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              {field.type}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFieldDuplicate(field.id, field.step);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            title="Duplizieren"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFieldDelete(field.id, field.step);
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
  );
}


export function ModernSidebar({
  onSaveForm, // Use new prop name
  selectedFieldId,
  onFieldSelect,
  onFieldUpdate,
}: ModernSidebarProps) {
  const {
    fields,
    steps,
    isMultiStep,
    currentStep,
    addField,
    duplicateField,
    removeField,
    moveField,
    addTemplateFields,
    toggleMultiStep,
    addStep,
    updateStep,
    removeStep,
    reorderStep,
    setCurrentStep,
  } = useFormBuilderStore();

  const [activeTab, setActiveTab] = useState<'structure' | 'add' | 'templates'>('structure');
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [tempStepTitle, setTempStepTitle] = useState<string>('');
  
  const allFields = isMultiStep ? steps.flatMap(s => s.fields) : fields;

  const fieldTypes: FieldTypeOption[] = [
    { type: 'text', label: 'Text', icon: '📝' },
    { type: 'email', label: 'E-Mail', icon: '📧' },
    { type: 'tel', label: 'Telefon', icon: '📞' },
    { type: 'date', label: 'Datum', icon: '📅' },
    { type: 'select', label: 'Auswahl', icon: '📋' },
    { type: 'textarea', label: 'Textbereich', icon: '📄' }
  ];

  const getFieldIcon = (type: FieldConfig['type']) => {
    return fieldTypes.find(f => f.type === type)?.icon || '❓';
  };
  
  const handleQuickAdd = (type: FieldConfig['type']) => {
    const stepId = isMultiStep ? steps[currentStep]?.id : undefined;
    addField(type, stepId);
  };
  
  const handleAddTemplate = (template: FieldTemplate) => {
    const stepId = isMultiStep ? steps[currentStep]?.id : undefined;
    addTemplateFields(template, stepId);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const oldIndex = allFields.findIndex((f) => f.id === active.id);
    const newIndex = allFields.findIndex((f) => f.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      moveField(oldIndex, newIndex);
    }
  };
  
  const handleStepDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = steps.findIndex(s => s.id === active.id);
    const newIndex = steps.findIndex(s => s.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderStep(oldIndex, newIndex);
    }
  };

  const handleEditStepTitle = (step: FormStep) => {
    setEditingStepId(step.id);
    setTempStepTitle(step.title);
  };

  const handleSaveStepTitle = (stepId: string) => {
    updateStep(stepId, { title: tempStepTitle });
    setEditingStepId(null);
  };
  
  const selectedField = allFields.find(f => f.id === selectedFieldId);

  const renderStructureTab = () => {
    if (isMultiStep) {
      return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleStepDragEnd}>
          <SortableContext items={steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <SortableStepItem
                  key={step.id}
                  step={step}
                  index={index}
                  currentStep={currentStep}
                  onStepChange={setCurrentStep}
                  editingStepId={editingStepId}
                  tempStepTitle={tempStepTitle}
                  onTempStepTitleChange={setTempStepTitle}
                  onEditStepTitle={() => handleEditStepTitle(step)}
                  onSaveStepTitle={() => handleSaveStepTitle(step.id)}
                  onDeleteStep={() => removeStep(step.id)}
                >
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={step.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                       <div className="space-y-2 pt-2">
                        {step.fields.map((field) => (
                          <SortableSidebarItem
                            key={field.id}
                            field={field}
                            selectedFieldId={selectedFieldId}
                            onFieldSelect={onFieldSelect}
                            onFieldDuplicate={duplicateField}
                            onFieldDelete={removeField}
                            getFieldIcon={getFieldIcon}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </SortableStepItem>
              ))}
              <button
                onClick={() => addStep({ title: `Schritt ${steps.length + 1}`, description: '', fields: [], isOptional: false })}
                className="w-full text-center px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Neuen Schritt hinzufügen
              </button>
            </div>
          </SortableContext>
        </DndContext>
      );
    }
    
    return (
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {fields.map((field) => (
               <SortableSidebarItem
                key={field.id}
                field={field}
                selectedFieldId={selectedFieldId}
                onFieldSelect={onFieldSelect}
                onFieldDuplicate={duplicateField}
                onFieldDelete={removeField}
                getFieldIcon={getFieldIcon}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  };

  const renderAddTab = () => (
    <div className="grid grid-cols-2 gap-3">
      {fieldTypes.map(ft => (
        <button
          key={ft.type}
          onClick={() => handleQuickAdd(ft.type)}
          className="flex flex-col items-center p-4 bg-white dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-600 transition-colors"
        >
          <span className="text-2xl mb-1">{ft.icon}</span>
          <span className="text-sm font-medium">{ft.label}</span>
        </button>
      ))}
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-3">
      {fieldTemplates.map(template => (
        <div key={template.id} className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="font-semibold">{template.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{template.description}</p>
          <button 
            onClick={() => handleAddTemplate(template)}
            className="text-sm text-blue-600 hover:underline"
          >
            Abschnitt hinzufügen
          </button>
        </div>
      ))}
    </div>
  );
  
  return (
    <aside className="w-96 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Formular-Struktur</h2>
        <div className="flex items-center mt-2">
            <input type="checkbox" id="multistep-toggle" checked={isMultiStep} onChange={toggleMultiStep} />
            <label htmlFor="multistep-toggle" className="ml-2 text-sm font-medium">Multi-Step Formular</label>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`flex-1 p-3 text-sm font-medium ${activeTab === 'structure' ? 'bg-white dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
          onClick={() => setActiveTab('structure')}
        >
          Struktur
        </button>
        <button
          className={`flex-1 p-3 text-sm font-medium ${activeTab === 'add' ? 'bg-white dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
          onClick={() => setActiveTab('add')}
        >
          Hinzufügen
        </button>
        <button
          className={`flex-1 p-3 text-sm font-medium ${activeTab === 'templates' ? 'bg-white dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
          onClick={() => setActiveTab('templates')}
        >
          Vorlagen
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'structure' && renderStructureTab()}
        {activeTab === 'add' && renderAddTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
      </div>
      
      {/* Selected Field Editor */}
      {selectedField && (
        <FieldEditor
          key={selectedField.id}
          field={selectedField}
          onUpdate={(updates) => onFieldUpdate(selectedField.id, updates)}
        />
      )}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onSaveForm} // Use new prop name here
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Formular speichern
        </button>
      </div>
    </aside>
  );
}

// Sortable Step Item Component
interface SortableStepItemProps {
  step: FormStep;
  index: number;
  currentStep: number;
  onStepChange: (index: number) => void;
  children: React.ReactNode;
  editingStepId: string | null;
  tempStepTitle: string;
  onTempStepTitleChange: (title: string) => void;
  onEditStepTitle: () => void;
  onSaveStepTitle: () => void;
  onDeleteStep: () => void;
}

function SortableStepItem({
  step, index, currentStep, onStepChange, children, editingStepId, tempStepTitle,
  onTempStepTitleChange, onEditStepTitle, onSaveStepTitle, onDeleteStep
}: SortableStepItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-lg border transition-all duration-200 ${
        currentStep === index
          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600'
          : 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
      }`}
    >
      <div className="flex items-center justify-between" onClick={() => onStepChange(index)}>
         <div className="flex items-center flex-1 min-w-0" {...attributes} {...listeners}>
            <div className="text-lg mr-3 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing">⠿</div>
            {editingStepId === step.id ? (
                <input 
                    type="text"
                    value={tempStepTitle}
                    onChange={(e) => onTempStepTitleChange(e.target.value)}
                    onBlur={onSaveStepTitle}
                    onKeyDown={(e) => e.key === 'Enter' && onSaveStepTitle()}
                    autoFocus
                    className="p-1 -m-1 w-full bg-transparent border-b"
                    onClick={e => e.stopPropagation()}
                />
            ) : (
                <span className="font-semibold text-gray-900 dark:text-white truncate">{step.title}</span>
            )}
        </div>
        <div className="flex items-center space-x-1 ml-2">
            <button onClick={(e)=>{e.stopPropagation(); onEditStepTitle();}} className="p-1 text-gray-400 hover:text-blue-600">Edit</button>
            <button onClick={(e)=>{e.stopPropagation(); onDeleteStep();}} className="p-1 text-gray-400 hover:text-red-600">Del</button>
        </div>
      </div>
      {currentStep === index && <div className="mt-2 pl-4 border-l-2 border-blue-300 dark:border-blue-600">{children}</div>}
    </div>
  );
}