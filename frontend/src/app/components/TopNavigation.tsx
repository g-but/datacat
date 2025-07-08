'use client';

import React, { useState } from 'react';

interface TopNavigationProps {
  currentView?: 'builder' | 'templates' | 'saved-forms';
  onNewForm: () => void;
  onSaveForm: () => void;
  onPreviewForm: () => void;
  formTitle?: string;
  onTitleChange?: (title: string) => void;
  hasUnsavedChanges?: boolean;
}

export function TopNavigation({
  currentView = 'builder',
  onNewForm,
  onSaveForm,
  onPreviewForm,
  formTitle = 'Neues Formular',
  onTitleChange,
  hasUnsavedChanges = false
}: TopNavigationProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(formTitle);

  const handleTitleSave = () => {
    onTitleChange?.(tempTitle);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(formTitle);
    setIsEditingTitle(false);
  };

  const navItems = [
    { id: 'builder', label: 'Formular Builder', icon: '🏗️' },
    { id: 'templates', label: 'Vorlagen-Bibliothek', icon: '📚' },
    { id: 'saved-forms', label: 'Gespeicherte Formulare', icon: '💾' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FB</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Form Builder</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'templates') window.location.href = '/templates';
                  else if (item.id === 'saved-forms') window.location.href = '/forms';
                  else if (item.id === 'builder') window.location.href = '/builder';
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Center - Form Title (only in builder view) */}
        {currentView === 'builder' && (
          <div className="flex items-center space-x-2">
            {isEditingTitle ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSave();
                    if (e.key === 'Escape') handleTitleCancel();
                  }}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleTitleSave}
                  className="p-1 text-green-600 hover:text-green-700"
                  title="Speichern"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={handleTitleCancel}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Abbrechen"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center space-x-2 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{formTitle}</h1>
                {hasUnsavedChanges && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" title="Ungespeicherte Änderungen" />
                )}
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Right side - Quick Actions */}
        <div className="flex items-center space-x-3">
          {currentView === 'builder' && (
            <>
              {/* Quick Save */}
              <button
                onClick={onSaveForm}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  hasUnsavedChanges
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Formular speichern"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm">Speichern</span>
              </button>

              {/* Preview */}
              <button
                onClick={onPreviewForm}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                title="Formular-Vorschau"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm">Vorschau</span>
              </button>
            </>
          )}

          {/* New Form */}
          <button
            onClick={onNewForm}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            title="Neues Formular erstellen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm">Neu</span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-2 pl-3 border-l border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">U</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}