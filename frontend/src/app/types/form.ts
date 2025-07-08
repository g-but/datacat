export interface FieldConfig {
  id: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea';
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  step?: number; // New: which step this field belongs to
  group?: string; // New: field group within a step
}

export interface FormField extends FieldConfig {
  value: string;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  isOptional?: boolean;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: FieldConfig[];
  steps?: FormStep[]; // New: multi-step configuration
  isMultiStep?: boolean; // New: flag for multi-step forms
}

export type FormData = Record<string, string>;