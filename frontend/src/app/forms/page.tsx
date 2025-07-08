'use client';

import React from 'react';
import { SavedForms } from '../components/SavedForms';
import { useRouter } from 'next/navigation';

export default function SavedFormsPage() {
  const router = useRouter();

  const handleLoadForm = (form: any) => {
    // Store form data in localStorage for the builder to pick up
    localStorage.setItem('loadedForm', JSON.stringify(form));
    // Navigate to builder
    router.push('/builder?from=saved');
  };

  const handleDuplicateForm = (form: any) => {
    // Store duplicated form data
    const duplicatedForm = {
      ...form,
      title: `${form.title} (Kopie)`,
      id: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    localStorage.setItem('loadedForm', JSON.stringify(duplicatedForm));
    router.push('/builder?from=duplicate');
  };

  const handleDeleteForm = (formId: string) => {
    console.log('Delete form:', formId);
    // TODO: Implement actual form deletion
  };

  const handlePreviewForm = (form: any) => {
    console.log('Preview form:', form);
    // TODO: Implement form preview modal
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SavedForms
        onLoadForm={handleLoadForm}
        onDuplicateForm={handleDuplicateForm}
        onDeleteForm={handleDeleteForm}
        onPreviewForm={handlePreviewForm}
      />
    </div>
  );
} 