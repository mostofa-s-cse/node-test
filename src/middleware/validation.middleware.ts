import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/appError";
import { VALIDATION_RULES } from "../constants";

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'email' | 'number' | 'boolean';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export const validateRequest = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: any[] = [];
    const body = req.body;

    rules.forEach(rule => {
      const value = body[rule.field];
      
      // Check if required
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field: rule.field,
          message: `${rule.field} is required`
        });
        return;
      }

      // Skip validation if value is not provided and not required
      if (value === undefined || value === null) {
        return;
      }

      // Type validation
      if (rule.type) {
        switch (rule.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push({
                field: rule.field,
                message: `${rule.field} must be a string`
              });
            }
            break;
          case 'email':
            if (typeof value !== 'string' || !isValidEmail(value)) {
              errors.push({
                field: rule.field,
                message: `${rule.field} must be a valid email address`
              });
            }
            break;
          case 'number':
            if (typeof value !== 'number' || isNaN(value)) {
              errors.push({
                field: rule.field,
                message: `${rule.field} must be a number`
              });
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push({
                field: rule.field,
                message: `${rule.field} must be a boolean`
              });
            }
            break;
        }
      }

      // Length validation for strings
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be at least ${rule.minLength} characters long`
          });
        }
        
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be no more than ${rule.maxLength} characters long`
          });
        }

        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push({
            field: rule.field,
            message: `${rule.field} format is invalid`
          });
        }
      }

      // Custom validation
      if (rule.custom) {
        const result = rule.custom(value);
        if (result !== true) {
          errors.push({
            field: rule.field,
            message: typeof result === 'string' ? result : `${rule.field} is invalid`
          });
        }
      }
    });

    if (errors.length > 0) {
      const errorMessage = 'Validation failed';
      const validationError = new ValidationError(errorMessage, { errors });
      return next(validationError);
    }

    next();
  };
};

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Common validation rules
export const authValidationRules = {
  register: [
    { field: 'name', required: true, type: 'string' as const, minLength: VALIDATION_RULES.NAME_MIN_LENGTH, maxLength: VALIDATION_RULES.NAME_MAX_LENGTH },
    { field: 'email', required: true, type: 'email' as const },
    { field: 'password', required: true, type: 'string' as const, minLength: VALIDATION_RULES.PASSWORD_MIN_LENGTH, maxLength: VALIDATION_RULES.PASSWORD_MAX_LENGTH }
  ],
  login: [
    { field: 'email', required: true, type: 'email' as const },
    { field: 'password', required: true, type: 'string' as const }
  ],
  refresh: [
    { field: 'refreshToken', required: true, type: 'string' as const }
  ]
};

export const userValidationRules = {
  update: [
    { field: 'name', type: 'string' as const, minLength: VALIDATION_RULES.NAME_MIN_LENGTH, maxLength: VALIDATION_RULES.NAME_MAX_LENGTH },
    { field: 'email', type: 'email' as const }
  ]
}; 