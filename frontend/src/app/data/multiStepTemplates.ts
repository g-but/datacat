import { FormTemplate, FormStep } from '../types/form';

export const hrOnboardingSteps: FormStep[] = [
  {
    id: 'personal-info',
    title: 'Persönliche Daten',
    description: 'Grundlegende persönliche Informationen des neuen Mitarbeiters',
    fields: [
      {
        id: 'firstName',
        type: 'text',
        name: 'firstName',
        label: 'Vorname',
        required: true,
        group: 'Name'
      },
      {
        id: 'lastName',
        type: 'text',
        name: 'lastName',
        label: 'Nachname',
        required: true,
        group: 'Name'
      },
      {
        id: 'email',
        type: 'email',
        name: 'email',
        label: 'E-Mail-Adresse',
        required: true,
        group: 'Kontakt'
      },
      {
        id: 'phone',
        type: 'tel',
        name: 'phone',
        label: 'Telefonnummer',
        group: 'Kontakt'
      },
      {
        id: 'birthDate',
        type: 'date',
        name: 'birthDate',
        label: 'Geburtsdatum',
        required: true,
        group: 'Persönliche Details'
      },
      {
        id: 'address',
        type: 'textarea',
        name: 'address',
        label: 'Adresse',
        placeholder: 'Straße, Hausnummer\nPLZ Stadt\nLand',
        rows: 3,
        group: 'Persönliche Details'
      }
    ]
  },
  {
    id: 'employment-details',
    title: 'Beschäftigungsdetails',
    description: 'Informationen zur Position und Arbeitsvereinbarung',
    fields: [
      {
        id: 'department',
        type: 'select',
        name: 'department',
        label: 'Abteilung',
        required: true,
        options: [
          { value: '', label: 'Abteilung auswählen' },
          { value: 'engineering', label: 'Technik' },
          { value: 'design', label: 'Design' },
          { value: 'product', label: 'Produkt' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'sales', label: 'Vertrieb' },
          { value: 'hr', label: 'Personalwesen' },
          { value: 'finance', label: 'Finanzen' },
          { value: 'operations', label: 'Betrieb' }
        ],
        group: 'Position'
      },
      {
        id: 'position',
        type: 'text',
        name: 'position',
        label: 'Position/Titel',
        required: true,
        group: 'Position'
      },
      {
        id: 'manager',
        type: 'text',
        name: 'manager',
        label: 'Direkter Vorgesetzter',
        placeholder: 'Name des direkten Vorgesetzten',
        group: 'Position'
      },
      {
        id: 'startDate',
        type: 'date',
        name: 'startDate',
        label: 'Startdatum',
        required: true,
        group: 'Arbeitsvereinbarung'
      },
      {
        id: 'employmentType',
        type: 'select',
        name: 'employmentType',
        label: 'Beschäftigungsart',
        required: true,
        options: [
          { value: 'full-time', label: 'Vollzeit' },
          { value: 'part-time', label: 'Teilzeit' },
          { value: 'contract', label: 'Vertrag' },
          { value: 'intern', label: 'Praktikant' }
        ],
        group: 'Arbeitsvereinbarung'
      },
      {
        id: 'workLocation',
        type: 'select',
        name: 'workLocation',
        label: 'Arbeitsort',
        required: true,
        options: [
          { value: '', label: 'Arbeitsort auswählen' },
          { value: 'office', label: 'Büro' },
          { value: 'remote', label: 'Remote' },
          { value: 'hybrid', label: 'Hybrid' }
        ],
        group: 'Arbeitsvereinbarung'
      }
    ]
  },
  {
    id: 'skills-experience',
    title: 'Fähigkeiten & Erfahrung',
    description: 'Qualifikationen und bisherige Berufserfahrung',
    fields: [
      {
        id: 'education',
        type: 'textarea',
        name: 'education',
        label: 'Bildungsabschluss',
        placeholder: 'Hochschulabschluss, Ausbildung, Zertifikate...',
        rows: 3,
        group: 'Qualifikationen'
      },
      {
        id: 'skills',
        type: 'textarea',
        name: 'skills',
        label: 'Fähigkeiten & Expertise',
        placeholder: 'Listen Sie relevante Fähigkeiten, Technologien oder Fachbereiche auf...',
        rows: 4,
        required: true,
        group: 'Qualifikationen'
      },
      {
        id: 'languages',
        type: 'textarea',
        name: 'languages',
        label: 'Sprachkenntnisse',
        placeholder: 'Deutsch (Muttersprache), Englisch (Fließend), etc.',
        rows: 2,
        group: 'Qualifikationen'
      },
      {
        id: 'previousExperience',
        type: 'textarea',
        name: 'previousExperience',
        label: 'Bisherige Berufserfahrung',
        placeholder: 'Relevante Positionen und Erfahrungen...',
        rows: 4,
        group: 'Erfahrung'
      }
    ]
  },
  {
    id: 'additional-info',
    title: 'Zusätzliche Informationen',
    description: 'Weitere Details und besondere Anforderungen',
    isOptional: true,
    fields: [
      {
        id: 'emergencyContact',
        type: 'text',
        name: 'emergencyContact',
        label: 'Notfallkontakt',
        placeholder: 'Name und Telefonnummer',
        group: 'Notfall & Sicherheit'
      },
      {
        id: 'medicalInfo',
        type: 'textarea',
        name: 'medicalInfo',
        label: 'Medizinische Informationen',
        placeholder: 'Allergien, besondere Bedürfnisse, etc. (optional)',
        rows: 2,
        group: 'Notfall & Sicherheit'
      },
      {
        id: 'equipmentNeeds',
        type: 'textarea',
        name: 'equipmentNeeds',
        label: 'Ausstattungsbedarf',
        placeholder: 'Laptop, Monitor, spezielle Software, etc.',
        rows: 3,
        group: 'Arbeitsplatz'
      },
      {
        id: 'accessRequirements',
        type: 'textarea',
        name: 'accessRequirements',
        label: 'Zugangsberechtigungen',
        placeholder: 'Systeme, Gebäudebereiche, etc.',
        rows: 2,
        group: 'Arbeitsplatz'
      },
      {
        id: 'notes',
        type: 'textarea',
        name: 'notes',
        label: 'Weitere Notizen',
        placeholder: 'Weitere Informationen oder besondere Anforderungen...',
        rows: 3,
        group: 'Sonstiges'
      }
    ]
  }
];

export const hrOnboardingTemplate: FormTemplate = {
  id: 'hr-onboarding-multistep',
  name: 'HR Mitarbeiter-Onboarding (Mehrstufig)',
  description: 'Umfassendes mehrstufiges Onboarding-Formular für neue Mitarbeiter',
  fields: hrOnboardingSteps.flatMap(step => step.fields),
  steps: hrOnboardingSteps,
  isMultiStep: true
};

export const multiStepTemplates = [hrOnboardingTemplate];