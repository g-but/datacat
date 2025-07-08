'use client';

import React, { useState } from 'react';
import { FieldConfig, FormStep } from '../types/form';

interface SavedForm {
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title' | 'submissions'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

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

  const filteredForms = savedForms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedForms = [...filteredForms].sort((a, b) => {
    switch (sortBy) {
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'submissions':
        return b.submissionCount - a.submissionCount;
      default:
        return 0;
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
                  {savedForms.reduce((sum, form) => sum + form.submissionCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Formulare durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="flex items-center space-x-4">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Alle Status</option>
                <option value="published">Veröffentlicht</option>
                <option value="draft">Entwürfe</option>
                <option value="archived">Archiviert</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="updated">Zuletzt bearbeitet</option>
                <option value="created">Erstellungsdatum</option>
                <option value="title">Titel</option>
                <option value="submissions">Einreichungen</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  title="Rasteransicht"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  title="Listenansicht"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {sortedForms.length} Formulare gefunden
          </p>
        </div>

        {/* Forms Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedForms.map((form) => (
              <div
                key={form.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-md font-medium ${getStatusColor(form.status)}`}>
                      {getStatusLabel(form.status)}
                    </span>
                    {form.isMultiStep && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md font-medium">
                        Multi-Step
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onPreviewForm(form)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Vorschau"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDuplicateForm(form)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Duplizieren"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteForm(form.id)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Löschen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer" onClick={() => onLoadForm(form)}>
                  {form.title}
                </h3>
                
                {form.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {form.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mb-4">
                  {form.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>{form.fields.length} Felder</span>
                  <span>{form.submissionCount} Einreichungen</span>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <p>Erstellt: {formatDate(form.createdAt)}</p>
                  <p>Bearbeitet: {formatDate(form.updatedAt)}</p>
                </div>

                <button
                  onClick={() => onLoadForm(form)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Bearbeiten
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedForms.map((form) => (
              <div
                key={form.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-md font-medium ${getStatusColor(form.status)}`}>
                          {getStatusLabel(form.status)}
                        </span>
                        {form.isMultiStep && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md font-medium">
                            Multi-Step
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer" onClick={() => onLoadForm(form)}>
                        {form.title}
                      </h3>
                      {form.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {form.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{form.fields.length} Felder</span>
                        <span>{form.submissionCount} Einreichungen</span>
                        <span>Bearbeitet: {formatDate(form.updatedAt)}</span>
                        <div className="flex flex-wrap gap-1">
                          {form.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onPreviewForm(form)}
                      className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Vorschau"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDuplicateForm(form)}
                      className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Duplizieren"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onLoadForm(form)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => onDeleteForm(form.id)}
                      className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Löschen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedForms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Keine Formulare gefunden
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Versuchen Sie andere Suchbegriffe oder Filter.'
                : 'Sie haben noch keine Formulare erstellt.'
              }
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 