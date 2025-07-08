import { FieldTemplate } from '../types/form';

export const fieldTemplates: FieldTemplate[] = [
    {
      id: 'personal-info',
      name: 'Persönliche Daten',
      description: 'Vorname, Nachname, Geburtsdatum',
      icon: '👤',
      fields: [
        { type: 'text', name: 'vorname', label: 'Vorname', required: true, placeholder: 'Vorname eingeben...' },
        { type: 'text', name: 'nachname', label: 'Nachname', required: true, placeholder: 'Nachname eingeben...' },
        { type: 'date', name: 'geburtsdatum', label: 'Geburtsdatum', required: false }
      ]
    },
    {
      id: 'contact-info',
      name: 'Kontaktdaten',
      description: 'E-Mail, Telefon, Handy',
      icon: '📞',
      fields: [
        { type: 'email', name: 'email', label: 'E-Mail-Adresse', required: true, placeholder: 'name@beispiel.de' },
        { type: 'tel', name: 'telefon', label: 'Telefon', required: false, placeholder: '+41 XX XXX XX XX' },
        { type: 'tel', name: 'handy', label: 'Handy', required: false, placeholder: '+41 XX XXX XX XX' }
      ]
    },
    {
      id: 'address-info',
      name: 'Adresse',
      description: 'Strasse, PLZ, Ort, Land',
      icon: '🏠',
      fields: [
        { type: 'text', name: 'strasse', label: 'Strasse und Hausnummer', required: true, placeholder: 'Musterstrasse 123' },
        { type: 'text', name: 'plz', label: 'PLZ', required: true, placeholder: '8000' },
        { type: 'text', name: 'ort', label: 'Ort', required: true, placeholder: 'Zürich' },
        { type: 'select', name: 'land', label: 'Land', required: true, options: [
          { value: '', label: 'Land wählen' },
          { value: 'ch', label: 'Schweiz' },
          { value: 'de', label: 'Deutschland' },
          { value: 'at', label: 'Österreich' },
          { value: 'fr', label: 'Frankreich' }
        ]}
      ]
    },
    {
      id: 'work-info',
      name: 'Berufsinformationen',
      description: 'Position, Abteilung, Startdatum',
      icon: '💼',
      fields: [
        { type: 'text', name: 'position', label: 'Position', required: true, placeholder: 'z.B. Software Engineer' },
        { type: 'text', name: 'abteilung', label: 'Abteilung', required: false, placeholder: 'z.B. IT' },
        { type: 'date', name: 'startdatum', label: 'Startdatum', required: true },
        { type: 'select', name: 'arbeitszeit', label: 'Arbeitszeit', required: true, options: [
          { value: '', label: 'Arbeitszeit wählen' },
          { value: 'vollzeit', label: 'Vollzeit' },
          { value: 'teilzeit', label: 'Teilzeit' },
          { value: 'praktikum', label: 'Praktikum' }
        ]}
      ]
    },
    {
      id: 'emergency-contact',
      name: 'Notfallkontakt',
      description: 'Name, Beziehung, Telefon',
      icon: '🚨',
      fields: [
        { type: 'text', name: 'notfall_name', label: 'Name der Kontaktperson', required: true, placeholder: 'Vollständiger Name' },
        { type: 'text', name: 'notfall_beziehung', label: 'Beziehung', required: true, placeholder: 'z.B. Ehepartner, Eltern' },
        { type: 'tel', name: 'notfall_telefon', label: 'Telefonnummer', required: true, placeholder: '+41 XX XXX XX XX' }
      ]
    }
  ]; 