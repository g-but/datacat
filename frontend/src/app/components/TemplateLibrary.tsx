'use client';

import React, { useState } from 'react';
import { FieldConfig } from '../types/form';

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  fields: Omit<FieldConfig, 'id'>[];
  tags: string[];
  isPopular?: boolean;
  createdAt: string;
  usageCount: number;
}

interface TemplateLibraryProps {
  onUseTemplate: (template: FormTemplate) => void;
  onPreviewTemplate: (template: FormTemplate) => void;
}

export function TemplateLibrary({ onUseTemplate, onPreviewTemplate }: TemplateLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const templates: FormTemplate[] = [
    {
      id: 'employee-onboarding',
      name: 'Mitarbeiter-Onboarding',
      description: 'Vollständiges Onboarding-Formular für neue Mitarbeiter mit allen notwendigen Informationen',
      category: 'hr',
      icon: '👥',
      tags: ['hr', 'onboarding', 'personal', 'kontakt'],
      isPopular: true,
      createdAt: '2024-01-15',
      usageCount: 145,
      fields: [
        { type: 'text', name: 'vorname', label: 'Vorname', required: true },
        { type: 'text', name: 'nachname', label: 'Nachname', required: true },
        { type: 'email', name: 'email', label: 'E-Mail-Adresse', required: true },
        { type: 'tel', name: 'telefon', label: 'Telefonnummer', required: true },
        { type: 'date', name: 'geburtsdatum', label: 'Geburtsdatum', required: true },
        { type: 'text', name: 'position', label: 'Position', required: true },
        { type: 'date', name: 'startdatum', label: 'Startdatum', required: true },
        { type: 'select', name: 'abteilung', label: 'Abteilung', required: true, options: [
          { value: '', label: 'Abteilung wählen' },
          { value: 'it', label: 'IT' },
          { value: 'hr', label: 'Human Resources' },
          { value: 'sales', label: 'Vertrieb' },
          { value: 'marketing', label: 'Marketing' }
        ]}
      ]
    },
    {
      id: 'customer-feedback',
      name: 'Kundenfeedback',
      description: 'Sammeln Sie wertvolles Feedback von Ihren Kunden mit diesem umfassenden Formular',
      category: 'feedback',
      icon: '⭐',
      tags: ['feedback', 'kunde', 'bewertung', 'zufriedenheit'],
      isPopular: true,
      createdAt: '2024-01-10',
      usageCount: 89,
      fields: [
        { type: 'text', name: 'name', label: 'Name', required: false },
        { type: 'email', name: 'email', label: 'E-Mail (optional)', required: false },
        { type: 'select', name: 'bewertung', label: 'Gesamtbewertung', required: true, options: [
          { value: '', label: 'Bewertung wählen' },
          { value: '5', label: '⭐⭐⭐⭐⭐ Ausgezeichnet' },
          { value: '4', label: '⭐⭐⭐⭐ Gut' },
          { value: '3', label: '⭐⭐⭐ Durchschnittlich' },
          { value: '2', label: '⭐⭐ Schlecht' },
          { value: '1', label: '⭐ Sehr schlecht' }
        ]},
        { type: 'textarea', name: 'kommentar', label: 'Ihr Feedback', required: true, rows: 4 },
        { type: 'select', name: 'weiterempfehlung', label: 'Würden Sie uns weiterempfehlen?', required: true, options: [
          { value: '', label: 'Auswahl treffen' },
          { value: 'ja', label: 'Ja, definitiv' },
          { value: 'vielleicht', label: 'Vielleicht' },
          { value: 'nein', label: 'Nein' }
        ]}
      ]
    },
    {
      id: 'event-registration',
      name: 'Event-Anmeldung',
      description: 'Professionelles Anmeldeformular für Events, Workshops und Veranstaltungen',
      category: 'events',
      icon: '🎉',
      tags: ['event', 'anmeldung', 'workshop', 'veranstaltung'],
      createdAt: '2024-01-08',
      usageCount: 67,
      fields: [
        { type: 'text', name: 'vorname', label: 'Vorname', required: true },
        { type: 'text', name: 'nachname', label: 'Nachname', required: true },
        { type: 'email', name: 'email', label: 'E-Mail-Adresse', required: true },
        { type: 'tel', name: 'telefon', label: 'Telefonnummer', required: false },
        { type: 'text', name: 'firma', label: 'Firma/Organisation', required: false },
        { type: 'select', name: 'ticket_typ', label: 'Ticket-Typ', required: true, options: [
          { value: '', label: 'Ticket-Typ wählen' },
          { value: 'standard', label: 'Standard (CHF 50)' },
          { value: 'premium', label: 'Premium (CHF 100)' },
          { value: 'student', label: 'Student (CHF 25)' }
        ]},
        { type: 'textarea', name: 'besondere_anforderungen', label: 'Besondere Anforderungen', required: false, rows: 3 }
      ]
    },
    {
      id: 'contact-form',
      name: 'Kontaktformular',
      description: 'Einfaches und effektives Kontaktformular für Ihre Website',
      category: 'contact',
      icon: '📞',
      tags: ['kontakt', 'website', 'anfrage', 'support'],
      isPopular: true,
      createdAt: '2024-01-12',
      usageCount: 234,
      fields: [
        { type: 'text', name: 'name', label: 'Name', required: true },
        { type: 'email', name: 'email', label: 'E-Mail-Adresse', required: true },
        { type: 'text', name: 'betreff', label: 'Betreff', required: true },
        { type: 'textarea', name: 'nachricht', label: 'Nachricht', required: true, rows: 5 }
      ]
    },
    {
      id: 'job-application',
      name: 'Bewerbungsformular',
      description: 'Umfassendes Formular für Stellenbewerbungen mit allen wichtigen Informationen',
      category: 'hr',
      icon: '💼',
      tags: ['bewerbung', 'job', 'hr', 'karriere'],
      createdAt: '2024-01-05',
      usageCount: 156,
      fields: [
        { type: 'text', name: 'vorname', label: 'Vorname', required: true },
        { type: 'text', name: 'nachname', label: 'Nachname', required: true },
        { type: 'email', name: 'email', label: 'E-Mail-Adresse', required: true },
        { type: 'tel', name: 'telefon', label: 'Telefonnummer', required: true },
        { type: 'text', name: 'position', label: 'Gewünschte Position', required: true },
        { type: 'select', name: 'verfuegbarkeit', label: 'Verfügbarkeit', required: true, options: [
          { value: '', label: 'Verfügbarkeit wählen' },
          { value: 'sofort', label: 'Sofort verfügbar' },
          { value: '1monat', label: 'In 1 Monat' },
          { value: '3monate', label: 'In 3 Monaten' },
          { value: 'nach_vereinbarung', label: 'Nach Vereinbarung' }
        ]},
        { type: 'textarea', name: 'motivation', label: 'Motivation', required: true, rows: 4 }
      ]
    },
    {
      id: 'survey-basic',
      name: 'Basis-Umfrage',
      description: 'Einfache Umfrage-Vorlage für Marktforschung und Meinungsumfragen',
      category: 'survey',
      icon: '📊',
      tags: ['umfrage', 'marktforschung', 'meinung', 'daten'],
      createdAt: '2024-01-03',
      usageCount: 78,
      fields: [
        { type: 'select', name: 'alter', label: 'Altersgruppe', required: true, options: [
          { value: '', label: 'Altersgruppe wählen' },
          { value: '18-25', label: '18-25 Jahre' },
          { value: '26-35', label: '26-35 Jahre' },
          { value: '36-45', label: '36-45 Jahre' },
          { value: '46-55', label: '46-55 Jahre' },
          { value: '56+', label: '56+ Jahre' }
        ]},
        { type: 'select', name: 'geschlecht', label: 'Geschlecht', required: false, options: [
          { value: '', label: 'Auswahl treffen' },
          { value: 'männlich', label: 'Männlich' },
          { value: 'weiblich', label: 'Weiblich' },
          { value: 'divers', label: 'Divers' },
          { value: 'keine_angabe', label: 'Keine Angabe' }
        ]},
        { type: 'textarea', name: 'feedback', label: 'Ihr Feedback', required: true, rows: 4 }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'Alle Kategorien', icon: '📋' },
    { id: 'hr', name: 'Personal & HR', icon: '👥' },
    { id: 'contact', name: 'Kontakt', icon: '📞' },
    { id: 'feedback', name: 'Feedback', icon: '⭐' },
    { id: 'events', name: 'Events', icon: '🎉' },
    { id: 'survey', name: 'Umfragen', icon: '📊' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const popularTemplates = templates.filter(t => t.isPopular).slice(0, 3);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Vorlagen-Bibliothek</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Starten Sie schnell mit professionellen Formular-Vorlagen
          </p>
        </div>

        {/* Popular Templates */}
        {searchTerm === '' && selectedCategory === 'all' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="mr-2">🔥</span>
              Beliebte Vorlagen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {popularTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => onUseTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{template.icon}</div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {template.usageCount} mal verwendet
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewTemplate(template);
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Vorschau"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                  placeholder="Vorlagen durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))}
              </div>

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
            {filteredTemplates.length} Vorlagen gefunden
          </p>
        </div>

        {/* Templates Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => onUseTemplate(template)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-2xl">{template.icon}</div>
                  <div className="flex items-center space-x-2">
                    {template.isPopular && (
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-md font-medium">
                        Beliebt
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewTemplate(template);
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Vorschau"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{template.fields.length} Felder</span>
                  <span>{template.usageCount} mal verwendet</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => onUseTemplate(template)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{template.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {template.name}
                        </h3>
                        {template.isPopular && (
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-md font-medium">
                            Beliebt
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {template.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{template.fields.length} Felder</span>
                        <span>{template.usageCount} mal verwendet</span>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map((tag) => (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewTemplate(template);
                      }}
                      className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Vorschau"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onUseTemplate(template)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Verwenden
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Keine Vorlagen gefunden
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Versuchen Sie andere Suchbegriffe oder wählen Sie eine andere Kategorie.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
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