'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { FormField } from './FormField';
import { FieldConfig } from '../types/form';

interface FieldEditorProps {
  field: FieldConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<FieldConfig>) => void;
  onDelete: () => void;
  availableGroups: string[];
}

export function FieldEditor({
  field,
  isOpen,
  onClose,
  onSave,
  onDelete,
  availableGroups
}: FieldEditorProps) {
  const [editedField, setEditedField] = useState<Partial<FieldConfig>>(field);

  useEffect(() => {
    if (isOpen) {
      setEditedField(field);
    }
  }, [field, isOpen]);

  const handleSave = () => {
    if (!editedField.label?.trim()) return;
    
    onSave({
      ...editedField,
      name: editedField.label?.toLowerCase().replace(/\s+/g, '_') || field.name
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Möchten Sie dieses Feld wirklich löschen?')) {
      onDelete();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Feld bearbeiten
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Bearbeiten Sie die Eigenschaften des Feldes
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {/* Field Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                type="text"
                id="fieldLabel"
                name="fieldLabel"
                label="Feldbezeichnung"
                value={editedField.label || ''}
                onChange={(e) => setEditedField(prev => ({ ...prev, label: e.target.value }))}
                placeholder="z.B. Vollständiger Name"
                required
              />

              <FormField
                type="text"
                id="fieldPlaceholder"
                name="fieldPlaceholder"
                label="Platzhaltertext"
                value={editedField.placeholder || ''}
                onChange={(e) => setEditedField(prev => ({ ...prev, placeholder: e.target.value }))}
                placeholder="z.B. Max Mustermann"
              />

              {availableGroups.length > 0 && (
                <FormField
                  type="select"
                  id="fieldGroup"
                  name="fieldGroup"
                  label="Gruppe"
                  value={editedField.group || ''}
                  onChange={(e) => setEditedField(prev => ({ ...prev, group: e.target.value || undefined }))}
                  options={[
                    { value: '', label: 'Keine Gruppe' },
                    ...availableGroups.map(group => ({ value: group, label: group }))
                  ]}
                />
              )}

              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <input
                    type="checkbox"
                    id="fieldRequired"
                    checked={editedField.required || false}
                    onChange={(e) => setEditedField(prev => ({ ...prev, required: e.target.checked }))}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fieldRequired" className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Pflichtfeld
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Dieses Feld muss ausgefüllt werden
                    </p>
                  </label>
                </div>
              </div>

              {/* Special field type configurations */}
              {editedField.type === 'textarea' && (
                <FormField
                  type="select"
                  id="fieldRows"
                  name="fieldRows"
                  label="Zeilen"
                  value={String(editedField.rows || 3)}
                  onChange={(e) => setEditedField(prev => ({ ...prev, rows: parseInt(e.target.value) }))}
                  options={[
                    { value: '3', label: '3 Zeilen' },
                    { value: '5', label: '5 Zeilen' },
                    { value: '8', label: '8 Zeilen' },
                    { value: '10', label: '10 Zeilen' }
                  ]}
                />
              )}

              {editedField.type === 'select' && editedField.options && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Auswahloptionen
                  </label>
                  <div className="space-y-2">
                    {editedField.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) => {
                            const newOptions = [...(editedField.options || [])];
                            newOptions[index] = { ...option, label: e.target.value };
                            setEditedField(prev => ({ ...prev, options: newOptions }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Option eingeben"
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = editedField.options?.filter((_, i) => i !== index);
                              setEditedField(prev => ({ ...prev, options: newOptions }));
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = [...(editedField.options || []), { value: `option${Date.now()}`, label: 'Neue Option' }];
                        setEditedField(prev => ({ ...prev, options: newOptions }));
                      }}
                      className="mt-2"
                    >
                      + Option hinzufügen
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Vorschau:</h4>
              <div className="pointer-events-none">
                <FormField
                  type={editedField.type || 'text'}
                  id="preview"
                  name="preview"
                  label={editedField.label || 'Feldbezeichnung'}
                  value=""
                  onChange={() => {}}
                  placeholder={editedField.placeholder || 'Platzhaltertext...'}
                  required={editedField.required || false}
                  options={editedField.options}
                  rows={editedField.rows}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Feld löschen
          </Button>
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Abbrechen
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!editedField.label?.trim()}
            >
              Änderungen speichern
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}