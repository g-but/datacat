'use client';

import React from 'react';
import { ModernFormBuilderLayout } from '../components/ModernFormBuilderLayout';
import { FieldConfig, FormData } from '../types/form';

export default function FormBuilderPage() {
  const handleSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    // TODO: Implement actual form submission
  };

  const handleFieldsChange = (fields: FieldConfig[]) => {
    console.log('Fields changed:', fields);
    // TODO: Implement field change handling
  };

  return (
    <ModernFormBuilderLayout
      initialFields={[]}
      onSubmit={handleSubmit}
      onFieldsChange={handleFieldsChange}
    />
  );
} 