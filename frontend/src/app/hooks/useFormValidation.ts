import { useState, useCallback } from 'react';
import { FieldConfig, FormData } from '../types/form';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (value: string) => string | null;
}

export function useFormValidation(fields: FieldConfig[]) {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateField = useCallback((field: FieldConfig, value: string): ValidationError | null => {
    // Required field validation
    if (field.required && (!value || value.trim() === '')) {
      return {
        field: field.name,
        message: `${field.label} ist erforderlich`
      };
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') {
      return null;
    }

    // Email validation
    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return {
          field: field.name,
          message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
        };
      }
    }

    // Phone validation
    if (field.type === 'tel') {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
      if (!phoneRegex.test(value)) {
        return {
          field: field.name,
          message: 'Bitte geben Sie eine gültige Telefonnummer ein'
        };
      }
    }

    // Date validation
    if (field.type === 'date') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return {
          field: field.name,
          message: 'Bitte geben Sie ein gültiges Datum ein'
        };
      }
    }

    // Text length validation
    if (field.type === 'text' || field.type === 'textarea') {
      if (value.length < 2) {
        return {
          field: field.name,
          message: `${field.label} muss mindestens 2 Zeichen enthalten`
        };
      }
      if (value.length > 500) {
        return {
          field: field.name,
          message: `${field.label} darf maximal 500 Zeichen enthalten`
        };
      }
    }

    return null;
  }, []);

  const validateForm = useCallback((formData: FormData): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    fields.forEach(field => {
      const value = formData[field.name] || '';
      const error = validateField(field, value);
      if (error) {
        newErrors.push(error);
      }
    });

    setErrors(newErrors);
    return newErrors;
  }, [fields, validateField]);

  const validateSingleField = useCallback((fieldName: string, value: string): ValidationError | null => {
    const field = fields.find(f => f.name === fieldName);
    if (!field) return null;

    const error = validateField(field, value);
    
    // Update errors state
    setErrors(prevErrors => {
      const filteredErrors = prevErrors.filter(e => e.field !== fieldName);
      return error ? [...filteredErrors, error] : filteredErrors;
    });

    return error;
  }, [fields, validateField]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getFieldError = useCallback((fieldName: string): string | null => {
    const error = errors.find(e => e.field === fieldName);
    return error ? error.message : null;
  }, [errors]);

  const hasErrors = errors.length > 0;
  const isValid = !hasErrors;

  return {
    errors,
    validateForm,
    validateSingleField,
    clearErrors,
    getFieldError,
    hasErrors,
    isValid
  };
}