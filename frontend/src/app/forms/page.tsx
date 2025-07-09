'use client';

import React from 'react';
import { SavedForms } from '../components/SavedForms';
import { FormPreviewModal } from '../components/FormPreviewModal';
import { useRouter } from 'next/navigation';

interface Form {
  id: string;
  title: string;
}

export default function SavedFormsPage() {
  const router = useRouter();

  const [previewForm, setPreviewForm] = React.useState<Form | null>(null);

  const handleLoadForm = (form: Form) => {
    // Store form data in localStorage for the builder to pick up
    localStorage.setItem('loadedForm', JSON.stringify(form));
    // Navigate to builder
    router.push('/builder?from=saved');
  };

  const handleDuplicateForm = (form: Form) => {
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
    const saved = JSON.parse(localStorage.getItem('savedForms') || '[]');
    const updated = saved.filter((f: Form) => f.id !== formId);
    localStorage.setItem('savedForms', JSON.stringify(updated));
    // Simple refresh to update list
    window.location.reload();
  };

  const handlePreviewForm = (form: Form) => {
    setPreviewForm(form);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SavedForms
        forms={[]}
        loading={false}
        onLoadForm={handleLoadForm}
        onDuplicateForm={handleDuplicateForm}
        onDeleteForm={handleDeleteForm}
        onPreviewForm={handlePreviewForm}
        onStatusChange={() => {}}
      />
      <FormPreviewModal
        isOpen={!!previewForm}
        form={previewForm}
        onClose={() => setPreviewForm(null)}
      />
    </div>
  );
} 