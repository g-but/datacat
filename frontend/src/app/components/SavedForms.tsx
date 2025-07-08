'use client';

import React, { useState } from 'react';
import { FieldConfig, FormStep } from '../types/form';
import { FilterControls, Filter, FilterOption } from './FilterControls';

export interface SavedForm {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  steps?: FormStep[];
  isMultiStep: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  submissionCount: number;
  tags: string[];
  category?: string;
}

interface SavedFormsProps {
  onLoadForm: (form: SavedForm) => void;
  onDuplicateForm: (form: SavedForm) => void;
  onDeleteForm: (formId: string) => void;
  onPreviewForm: (form: SavedForm) => void;
}

export function SavedForms({ onLoadForm, onDuplicateForm, onDeleteForm, onPreviewForm }: SavedFormsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({ status: 'all' });
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'title' | 'submissionCount'>('updatedAt');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Mock data - in real app this would come from API
  const savedForms: SavedForm[] = [
    {
      id: 'form-1',
      title: 'Mitarbeiter-Onboarding 2024',
      description: 'Vollständiges Onboarding-Formular für neue Mitarbeiter',
      fields: [
        { id: '1', type: 'text', name: 'vorname', label: 'Vorname', required: true },
        { id: '2', type: 'text', name: 'nachname', label: 'Nachname', required: true },
        { id: '3', type: 'email', name: 'email', label: 'E-Mail', required: true },
      ],
      isMultiStep: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      status: 'published',
      submissionCount: 45,
      tags: ['hr', 'onboarding', 'personal'],
      category: 'hr'
    },
    {
      id: 'form-2',
      title: 'Kundenfeedback Q1 2024',
      description: 'Sammlung von Kundenfeedback für das erste Quartal',
      fields: [
        { id: '1', type: 'text', name: 'name', label: 'Name', required: false },
        { id: '2', type: 'email', name: 'email', label: 'E-Mail', required: false },
        { id: '3', type: 'select', name: 'bewertung', label: 'Bewertung', required: true, options: [] },
      ],
      isMultiStep: false,
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-18T16:45:00Z',
      status: 'published',
      submissionCount: 128,
      tags: ['feedback', 'kunde', 'bewertung'],
      category: 'feedback'
    },
    {
      id: 'form-3',
      title: 'Event-Anmeldung Workshop',
      description: 'Anmeldeformular für den kommenden Workshop',
      fields: [
        { id: '1', type: 'text', name: 'name', label: 'Name', required: true },
        { id: '2', type: 'email', name: 'email', label: 'E-Mail', required: true },
      ],
      isMultiStep: false,
      createdAt: '2024-01-08T11:20:00Z',
      updatedAt: '2024-01-08T11:20:00Z',
      status: 'draft',
      submissionCount: 0,
      tags: ['event', 'workshop', 'anmeldung'],
      category: 'events'
    },
    {
      id: 'form-4',
      title: 'Bewerbungsformular Senior Developer',
      description: 'Spezifisches Bewerbungsformular für Senior Developer Position',
      fields: [
        { id: '1', type: 'text', name: 'name', label: 'Name', required: true },
        { id: '2', type: 'email', name: 'email', label: 'E-Mail', required: true },
        { id: '3', type: 'textarea', name: 'erfahrung', label: 'Berufserfahrung', required: true },
      ],
      isMultiStep: true,
      createdAt: '2024-01-05T14:00:00Z',
      updatedAt: '2024-01-12T10:30:00Z',
      status: 'archived',
      submissionCount: 23,
      tags: ['bewerbung', 'developer', 'senior'],
      category: 'hr'
    },
    {
      id: 'form-5',
      title: 'Kontaktformular Website',
      description: 'Standard-Kontaktformular für die Unternehmenswebsite',
      fields: [
        { id: '1', type: 'text', name: 'name', label: 'Name', required: true },
        { id: '2', type: 'email', name: 'email', label: 'E-Mail', required: true },
        { id: '3', type: 'textarea', name: 'nachricht', label: 'Nachricht', required: true },
      ],
      isMultiStep: false,
      createdAt: '2024-01-03T08:45:00Z',
      updatedAt: '2024-01-19T13:20:00Z',
      status: 'published',
      submissionCount: 89,
      tags: ['kontakt', 'website', 'allgemein'],
      category: 'contact'
    }
  ];

  const statusOptions: FilterOption[] = [
    { value: 'all', label: 'Alle Status' },
    { value: 'published', label: 'Veröffentlicht' },
    { value: 'draft', label: 'Entwurf' },
    { value: 'archived', label: 'Archiviert' },
  ];

  const sortOptions: FilterOption[] = [
    { value: 'updatedAt', label: 'Zuletzt aktualisiert' },
    { value: 'createdAt', label: 'Erstelldatum' },
    { value: 'title', label: 'Titel (A-Z)' },
    { value: 'submissionCount', label: 'Einreichungen' },
  ];

  const filters: Filter[] = [
    { id: 'status', label: 'Status', options: statusOptions }
  ];

  const handleFilterChange = (filterId: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [filterId]: value }));
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value as typeof sortBy);
  };

  const filteredForms = savedForms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedFilters.status === 'all' || form.status === selectedFilters.status;
    
    return matchesSearch && matchesStatus;
  });

  const sortedForms = [...filteredForms].sort((a, b) => {
    switch (sortBy) {
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'submissionCount':
        return b.submissionCount - a.submissionCount;
      case 'updatedAt':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  const getStatusColor = (status: SavedForm['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'archived':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: SavedForm['status']) => {
    switch (status) {
      case 'published':
        return 'Veröffentlicht';
      case 'draft':
        return 'Entwurf';
      case 'archived':
        return 'Archiviert';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gespeicherte Formulare</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Verwalten Sie Ihre erstellten Formulare und deren Einreichungen
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📊</div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gesamt</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{savedForms.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Veröffentlicht</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {savedForms.filter(f => f.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📝</div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Entwürfe</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {savedForms.filter(f => f.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📋</div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Einreichungen</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {savedForms.reduce((acc, f) => acc + f.submissionCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          sortByOptions={sortOptions}
          currentSortBy={sortBy}
          onSortByChange={handleSortByChange}
        >
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    aria-label="List View"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    aria-label="Grid View"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                    </svg>
                </button>
            </div>
        </FilterControls>
        
        {/* Forms List/Grid */}
        {sortedForms.length > 0 ? (
          viewMode === 'list' ? (
            <div className="space-y-4">
              {sortedForms.map(form => (
                <div key={form.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                       <div className="text-2xl hidden sm:block">
                        {form.isMultiStep ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 truncate group-hover:underline cursor-pointer" onClick={() => onLoadForm(form)}>
                          {form.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{form.description}</p>
                      </div>
                    </div>
        
                    <div className="hidden md:flex items-center space-x-4 mx-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-700 dark:text-gray-300">
                           <span>{form.submissionCount}</span>
                           <span className="text-xs text-gray-500">Einreichungen</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(form.status)}`}>
                            {getStatusLabel(form.status)}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button onClick={() => onPreviewForm(form)} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Vorschau">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button onClick={() => onDuplicateForm(form)} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Duplizieren">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                        <button onClick={() => onDeleteForm(form.id)} className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" title="Löschen">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedForms.map(form => (
                 <div key={form.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 group">
                    <div>
                        <div className="flex items-start justify-between mb-4">
                           <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(form.status)}`}>
                              {getStatusLabel(form.status)}
                           </span>
                           <div className="text-2xl">
                             {form.isMultiStep ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                           </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:underline cursor-pointer" onClick={() => onLoadForm(form)}>
                            {form.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-10 overflow-hidden">
                            {form.description}
                        </p>
                    </div>
                    <div className="mt-4">
                       <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span>{form.submissionCount} Einreichungen</span>
                          <span>Aktualisiert: {formatDate(form.updatedAt)}</span>
                       </div>
                       <div className="flex items-center space-x-2">
                           <button onClick={() => onLoadForm(form)} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm">
                               Bearbeiten
                           </button>
                           <button onClick={() => onPreviewForm(form)} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Vorschau">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                           </button>
                           <button onClick={() => onDeleteForm(form.id)} className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" title="Löschen">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                       </div>
                    </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📂</div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Keine Formulare gefunden</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Ihre Suche ergab keine Treffer. Versuchen Sie es mit anderen Filtern.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 