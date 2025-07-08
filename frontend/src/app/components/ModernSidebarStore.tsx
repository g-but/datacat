import React from 'react';
import { ModernSidebar } from './ModernSidebar';
import { useFormBuilderStore } from '../hooks/useFormBuilderStore';

// Wrapper component that injects store-based state & actions into ModernSidebar
export function ModernSidebarStore(
  props: React.ComponentProps<typeof ModernSidebar>
) {
  const {
    fields,
    steps,
    isMultiStep,
    currentStep,
    duplicateField,
    removeField,
    reorderField,
  } = useFormBuilderStore((state) => ({
    fields: state.fields,
    steps: state.steps,
    isMultiStep: state.isMultiStep,
    currentStep: state.currentStep,
    duplicateField: state.duplicateField,
    removeField: state.removeField,
    reorderField: state.reorderField,
  }));

  return (
    <ModernSidebar
      {...props}
      // override with store values
      fields={fields}
      steps={steps}
      isMultiStep={isMultiStep}
      currentStep={currentStep}
      // ensure wrapper triggers store updates, then optional external callbacks
      onFieldDuplicate={(id) => {
        duplicateField(id);
        props.onFieldDuplicate?.(id);
      }}
      onFieldDelete={(id) => {
        removeField(id);
        props.onFieldDelete?.(id);
      }}
      onFieldReorder={(from, to) => {
        reorderField(from, to);
        props.onFieldReorder?.(from, to);
      }}
    />
  );
} 