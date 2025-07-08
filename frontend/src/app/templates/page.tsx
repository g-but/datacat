'use client';

import React from 'react';
import { TemplateLibrary } from '../components/TemplateLibrary';
import { useRouter } from 'next/navigation';

export default function TemplatesPage() {
  const router = useRouter();

  const handleUseTemplate = (template: any) => {
    // Store template data in localStorage for the builder to pick up
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    // Navigate to builder
    router.push('/builder?from=template');
  };

  const handlePreviewTemplate = (template: any) => {
    console.log('Preview template:', template);
    // TODO: Implement template preview modal
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TemplateLibrary
        onUseTemplate={handleUseTemplate}
        onPreviewTemplate={handlePreviewTemplate}
      />
    </div>
  );
}