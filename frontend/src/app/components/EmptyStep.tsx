'use client';

import React from 'react';
import { FieldConfig, FieldTemplate } from '../types/form';
import { fieldTemplates } from '../data/fieldTemplates';
import { formTemplates } from '../data/formTemplates';
import { useFormBuilderStore } from '../hooks/useFormBuilderStore';
import { ConfirmDialog } from './ConfirmDialog';

interface EmptyStepProps {
  onAddField: (type: FieldConfig['type']) => void;
  onAddTemplate: (template: FieldTemplate) => void;
}

const quickFieldTypes: Array<{type: FieldConfig['type'], label: string, icon: string}> = [
  { type: 'text', label: 'Text', icon: '📝' },
  { type: 'email', label: 'E-Mail', icon: '📧' },
  { type: 'tel', label: 'Telefon', icon: '📞' },
  { type: 'date', label: 'Datum', icon: '📅' },
  { type: 'select', label: 'Auswahl', icon: '📋' },
  { type: 'textarea', label: 'Textbereich', icon: '📄' }
];

export function EmptyStep({ onAddField, onAddTemplate }: EmptyStepProps) {
  const { loadTemplate } = useFormBuilderStore();
  const [pendingTemplateId, setPendingTemplateId] = React.useState<string | null>(null);

  return (
    <div className="text-center py-12 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
      <div className="text-4xl mb-4">✨</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Fügen Sie Ihr erstes Feld hinzu
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Beginnen Sie mit einem einzelnen Feld oder fügen Sie eine vordefinierte Sektion hinzu.
      </p>

      <div className="max-w-2xl mx-auto">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
          Einzelne Felder
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
          {quickFieldTypes.map((fieldType) => (
            <button
              key={fieldType.type}
              onClick={() => onAddField(fieldType.type)}
              className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 text-center group"
            >
              <div className="text-3xl mb-2">{fieldType.icon}</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {fieldType.label}
              </div>
            </button>
          ))}
        </div>

        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
          Sektionen
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {fieldTemplates.map((template) => (
            <div
              key={template.id}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer group text-left"
              onClick={() => onAddTemplate(template)}
            >
              <div className="flex items-start">
                <div className="text-2xl mr-4 mt-1">{template.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {template.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {template.fields.length} Felder
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
          Komplette Formulare
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {formTemplates.map((template) => (
            <div
              key={template.id}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-400 dark:hover:border-green-500 transition-all duration-200 cursor-pointer group text-left"
              onClick={() => setPendingTemplateId(template.id)}
            >
              <div className="flex items-start">
                <div className="text-2xl mr-4 mt-1">📄</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {template.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {template.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* confirmation dialog */}
      <ConfirmDialog
        isOpen={!!pendingTemplateId}
        title="Formular-Vorlage laden"
        message="Das aktuelle Formular wird überschrieben. Möchten Sie fortfahren?"
        confirmLabel="Übernehmen"
        onConfirm={() => {
          const tmpl = formTemplates.find(t => t.id === pendingTemplateId);
          if (tmpl) loadTemplate(tmpl);
          setPendingTemplateId(null);
        }}
        onCancel={() => setPendingTemplateId(null)}
      />
    </div>
  );
} 