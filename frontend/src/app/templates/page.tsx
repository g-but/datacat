'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormCard } from '../components/FormCard';
import { TemplateCard } from '../components/TemplateCard';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { useTemplateManager } from '../hooks/useTemplateManager';
import { hrIntakeTemplate, formTemplates as allFormTemplates } from '../data/formTemplates';
import { FormTemplate } from '../types/form';

export default function TemplatesPage() {
  const router = useRouter();
  const { templates, searchTemplates, duplicateTemplate, deleteTemplate } = useTemplateManager();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Combine built-in templates with user templates
  const builtInTemplates = allFormTemplates;
  const allTemplates = [...builtInTemplates, ...templates];
  const filteredTemplates = searchQuery.trim() 
    ? searchTemplates(searchQuery).concat(
        builtInTemplates.filter(t => 
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : allTemplates;

  const handleSelectTemplate = (template: FormTemplate) => {
    // Store selected template in localStorage and navigate to form
    localStorage.setItem('selected-template', JSON.stringify(template));
    router.push('/');
  };

  const handleDuplicateTemplate = async (template: FormTemplate) => {
    try {
      await duplicateTemplate(template.id);
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate(templateId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const isBuiltInTemplate = (templateId: string) => {
    return builtInTemplates.some(t => t.id === templateId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FormCard
          title="Vorlagen-Bibliothek"
          description="Wählen Sie eine Vorlage aus oder erstellen Sie ein neues Formular von Grund auf."
        >
          <div className="space-y-8">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <FormField
                  type="text"
                  id="search"
                  name="search"
                  label="Vorlagen durchsuchen"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nach Name oder Beschreibung suchen..."
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  Neues Formular erstellen
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{allTemplates.length}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">Verfügbare Vorlagen</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl p-4 border border-green-200 dark:border-green-800/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{builtInTemplates.length}</p>
                    <p className="text-sm text-green-600 dark:text-green-300">Standard-Vorlagen</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/10 rounded-xl p-4 border border-purple-200 dark:border-purple-800/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{templates.length}</p>
                    <p className="text-sm text-purple-600 dark:text-purple-300">Eigene Vorlagen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={handleSelectTemplate}
                    onDuplicate={isBuiltInTemplate(template.id) ? undefined : handleDuplicateTemplate}
                    onDelete={isBuiltInTemplate(template.id) ? undefined : (t) => setShowDeleteConfirm(t.id)}
                    className={isBuiltInTemplate(template.id) ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'Keine Vorlagen gefunden' : 'Keine Vorlagen vorhanden'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {searchQuery 
                    ? 'Versuchen Sie andere Suchbegriffe oder erstellen Sie eine neue Vorlage.'
                    : 'Erstellen Sie Ihr erstes Formular und speichern Sie es als Vorlage.'
                  }
                </p>
                <Button onClick={() => router.push('/')}>
                  Neues Formular erstellen
                </Button>
              </div>
            )}
          </div>
        </FormCard>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 animate-scale-in">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Vorlage löschen
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Sind Sie sicher, dass Sie diese Vorlage dauerhaft löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1"
                  >
                    Abbrechen
                  </Button>
                  <Button
                    onClick={() => handleDeleteTemplate(showDeleteConfirm)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    Löschen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}