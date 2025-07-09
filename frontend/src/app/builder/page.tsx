'use client';

import React from 'react';
import { ModernFormBuilderLayout } from '../components/ModernFormBuilderLayout';
import { FieldConfig, FormData } from '../types/form';

export default function FormBuilderPage() {
  const handleSubmit = (data: FormData) => {
    // For MVP: persist form data locally until backend is ready
    const submissions = JSON.parse(localStorage.getItem('submittedForms') || '[]');
    submissions.push({ id: Date.now(), data });
    localStorage.setItem('submittedForms', JSON.stringify(submissions));
  };

  const handleFieldsChange = (_fields: FieldConfig[]) => {
    // Placeholder for side-effects (e.g., analytics) – intentionally left blank
  };

  return (
    <ModernFormBuilderLayout
      onSubmit={handleSubmit}
      onFieldsChange={handleFieldsChange}
    />
  );
} 