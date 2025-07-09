export interface FieldConfig {
  id: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>; // For select, radio
  defaultValue?: string | boolean;
  step?: string; // For multi-step forms
  rows?: number; // For textarea
  group?: string; // For grouping fields
  conditionalLogic?: {
    fieldId: string; // ID of the field to check
    condition: 'isEqualTo' | 'isNotEqualTo' | 'contains' | 'doesNotContain';
    value: string;
  };
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

export interface FieldTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: Omit<FieldConfig, 'id'>[];
}

export type FormData = Record<string, string>;