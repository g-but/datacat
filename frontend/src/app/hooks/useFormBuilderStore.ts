// created_date: 2025-07-08
// last_modified_date: 2025-07-09
// last_modified_summary: "Vollständiges Refactoring für zentralisierte Zustandsverwaltung. Fügt formData, umgeschriebene Aktionen für Multi-Step hinzu."

import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { FieldConfig, FormStep, FieldTemplate } from '../types/form';

interface FormBuilderState {
  fields: FieldConfig[];
  steps: FormStep[];
  formData: Record<string, string>;
  isMultiStep: boolean;
  currentStep: number;

  // Actions
  setInitialState: (data: { fields?: FieldConfig[], steps?: FormStep[], isMultiStep?: boolean }) => void;
  setFormData: (name: string, value: string) => void;

  addField: (type: FieldConfig['type'], stepId?: string) => void;
  updateField: (fieldId: string, updates: Partial<FieldConfig>, stepId?: string) => void;
  removeField: (fieldId: string, stepId?: string) => void;
  duplicateField: (fieldId: string, stepId?: string) => void;
  moveField: (fromIndex: number, toIndex: number) => void;
  addTemplateFields: (template: FieldTemplate, stepId?: string) => void;

  addStep: (step: Omit<FormStep, 'id'>) => void;
  updateStep: (stepId: string, updates: Partial<FormStep>) => void;
  removeStep: (stepId: string) => void;
  reorderStep: (from: number, to: number) => void;

  toggleMultiStep: () => void;
  setCurrentStep: (index: number) => void;
}

const createField = (type: FieldConfig['type'], stepId?: string): FieldConfig => {
  const fieldDefaults: Record<FieldConfig['type'], Partial<FieldConfig>> = {
    text: { label: 'Textfeld', placeholder: 'Text eingeben...' },
    email: { label: 'E-Mail', placeholder: 'E-Mail eingeben...' },
    tel: { label: 'Telefon', placeholder: 'Telefonnummer eingeben...' },
    date: { label: 'Datum', placeholder: '' },
    select: { label: 'Auswahl', options: [{ value: 'option1', label: 'Option 1' }] },
    textarea: { label: 'Textbereich', placeholder: 'Text eingeben...', rows: 3 },
  };
  const defaults = fieldDefaults[type];
  const id = `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const name = `${(defaults.label || type).toLowerCase().replace(/\s+/g, '_')}_${id.substring(0, 4)}`;

  return {
    id,
    type,
    name,
    label: defaults.label || 'Neues Feld',
    ...defaults,
    step: stepId,
  };
};

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  fields: [],
  steps: [],
  formData: {},
  isMultiStep: false,
  currentStep: 0,

  setInitialState: (data) => set({
    fields: data.fields || [],
    steps: data.steps || [],
    isMultiStep: data.isMultiStep || false,
    formData: (data.fields || []).concat((data.steps || []).flatMap(s => s.fields)).reduce((acc, f) => ({...acc, [f.name]: ''}), {}),
  }),

  setFormData: (name, value) => set(state => ({
    formData: { ...state.formData, [name]: value }
  })),

  addField: (type, stepId) => {
    const newField = createField(type, stepId);
    set(state => {
      const newFormData = { ...state.formData, [newField.name]: '' };
      if (state.isMultiStep) {
        const targetStepId = stepId || state.steps[state.currentStep]?.id;
        if (!targetStepId) return {}; // Should not happen
        return {
          steps: state.steps.map(s =>
            s.id === targetStepId ? { ...s, fields: [...s.fields, newField] } : s
          ),
          formData: newFormData,
        };
      }
      return { fields: [...state.fields, newField], formData: newFormData };
    });
  },

  updateField: (fieldId, updates, stepId) => set(state => {
    if (state.isMultiStep) {
      const targetStepId = stepId || state.steps.find(s => s.fields.some(f => f.id === fieldId))?.id;
      return {
        steps: state.steps.map(s =>
          s.id === targetStepId
            ? { ...s, fields: s.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f) }
            : s
        )
      };
    }
    return { fields: state.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f) };
  }),

  removeField: (fieldId, stepId) => set(state => {
    let fieldToRemove: FieldConfig | undefined;
    const newFormData = { ...state.formData };

    if (state.isMultiStep) {
      const targetStepId = stepId || state.steps.find(s => s.fields.some(f => f.id === fieldId))?.id;
      if (!targetStepId) return {};

      const newSteps = state.steps.map(s => {
        if (s.id !== targetStepId) return s;
        const newFields = s.fields.filter(f => {
          if (f.id === fieldId) {
            fieldToRemove = f;
            return false;
          }
          return true;
        });
        return { ...s, fields: newFields };
      });
      if (fieldToRemove) delete newFormData[fieldToRemove.name];
      return { steps: newSteps, formData: newFormData };
    }

    const newFields = state.fields.filter(f => {
      if (f.id === fieldId) {
        fieldToRemove = f;
        return false;
      }
      return true;
    });
    if (fieldToRemove) delete newFormData[fieldToRemove.name];
    return { fields: newFields, formData: newFormData };
  }),

  duplicateField: (fieldId, stepId) => set(state => {
    let fieldToDuplicate: FieldConfig | undefined;
    if (state.isMultiStep) {
      const step = stepId ? state.steps.find(s => s.id === stepId) : state.steps.find(s => s.fields.some(f => f.id === fieldId));
      if (step) fieldToDuplicate = step.fields.find(f => f.id === fieldId);
    } else {
      fieldToDuplicate = state.fields.find(f => f.id === fieldId);
    }

    if (!fieldToDuplicate) return {};

    const newField: FieldConfig = {
      ...fieldToDuplicate,
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${fieldToDuplicate.name}_copy_${Date.now()}`,
      label: `${fieldToDuplicate.label} (Kopie)`,
    };
    const newFormData = { ...state.formData, [newField.name]: '' };

    if (state.isMultiStep) {
      const step = stepId ? state.steps.find(s => s.id === stepId) : state.steps.find(s => s.fields.some(f => f.id === fieldId));
      if (!step) return {};
      
      const fieldIndex = step.fields.findIndex(f => f.id === fieldId);
      const newStepFields = [
        ...step.fields.slice(0, fieldIndex + 1),
        newField,
        ...step.fields.slice(fieldIndex + 1)
      ];
      return {
        steps: state.steps.map(s => s.id === step.id ? {...s, fields: newStepFields} : s),
        formData: newFormData
      };
    }

    const fieldIndex = state.fields.findIndex(f => f.id === fieldId);
    const newFields = [
      ...state.fields.slice(0, fieldIndex + 1),
      newField,
      ...state.fields.slice(fieldIndex + 1)
    ];
    return { fields: newFields, formData: newFormData };
  }),

  addTemplateFields: (template, stepId) => set(state => {
    const newFields = template.fields.map(field => ({
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      step: stepId,
    }));
    const newFormData = newFields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), state.formData);
    
    if(state.isMultiStep) {
        const targetStepId = stepId || state.steps[state.currentStep]?.id;
        if (!targetStepId) return {};
        return {
          steps: state.steps.map(s =>
            s.id === targetStepId ? { ...s, fields: [...s.fields, ...newFields] } : s
          ),
          formData: newFormData
        };
    }
    return { fields: [...state.fields, ...newFields], formData: newFormData };
  }),

  moveField: (fromIndex, toIndex) => set(state => {
    if(state.isMultiStep) {
      let fromStepIndex = -1, fromFieldIndex = -1;
      let toStepIndex = -1, toFieldIndex = -1;
      let currentIndex = 0;
      
      // This logic correctly identifies the source and destination of the moved field
      // across the entire multi-step form structure.
      for(let i=0; i<state.steps.length; i++) {
          for(let j=0; j<state.steps[i].fields.length; j++) {
              if (currentIndex === fromIndex) {
                  fromStepIndex = i;
                  fromFieldIndex = j;
              }
              if (currentIndex === toIndex) {
                  toStepIndex = i;
                  toFieldIndex = j;
              }
              currentIndex++;
          }
      }

      if (fromStepIndex !== -1 && toStepIndex !== -1) {
          const newSteps = [...state.steps];
          // Logic for moving within the same step
          if (fromStepIndex === toStepIndex) {
              const step = newSteps[fromStepIndex];
              step.fields = arrayMove(step.fields, fromFieldIndex, toFieldIndex);
          } else { // Logic for moving between different steps
              const [movedField] = newSteps[fromStepIndex].fields.splice(fromFieldIndex, 1);
              movedField.step = newSteps[toStepIndex].id;
              newSteps[toStepIndex].fields.splice(toFieldIndex, 0, movedField);
          }
          return { steps: newSteps };
      }
      return {}; // Return empty object if something went wrong
    }
    // Logic for single-step forms
    return { fields: arrayMove(state.fields, fromIndex, toIndex) };
  }),

  addStep: (step) => set((state) => ({
    steps: [...state.steps, { ...step, id: `step-${Date.now()}` }],
  })),

  updateStep: (stepId, updates) => set((state) => ({
    steps: state.steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)),
  })),

  removeStep: (stepId) => set((state) => ({
    steps: state.steps.filter((s) => s.id !== stepId),
  })),

  reorderStep: (from, to) => set((state) => ({
    steps: arrayMove(state.steps, from, to),
  })),

  toggleMultiStep: () => set((state) => {
    if (!state.isMultiStep && state.steps.length === 0) {
      // First time enabling, create initial step
      return { 
        isMultiStep: true,
        steps: [{ id: `step-${Date.now()}`, title: 'Schritt 1', description: '', fields: [], isOptional: false }]
      };
    }
    return { isMultiStep: !state.isMultiStep };
  }),

  setCurrentStep: (idx) => set(() => ({ currentStep: idx })),
})); 