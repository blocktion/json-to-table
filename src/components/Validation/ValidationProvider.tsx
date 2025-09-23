import React, { createContext, useContext } from "react";
import { ValidationRule } from "../../types/editing";

interface ValidationContextType {
  rules: ValidationRule[];
  validateField: (
    field: string,
    value: unknown,
    row: unknown
  ) => { isValid: boolean; error: string | null };
  validateRow: (row: unknown) => {
    isValid: boolean;
    errors: Record<string, string>;
  };
}

const ValidationContext = createContext<ValidationContextType | null>(null);

interface ValidationProviderProps {
  rules: ValidationRule[];
  children: React.ReactNode;
}

export const ValidationProvider: React.FC<ValidationProviderProps> = ({
  rules,
  children,
}) => {
  const validateField = (field: string, value: unknown, row: unknown) => {
    const fieldRules = rules.filter((rule) => rule.field === field);

    for (const rule of fieldRules) {
      const result = rule.validator(value, row);
      if (
        result === false ||
        (typeof result === "string" && result.length > 0)
      ) {
        return {
          isValid: false,
          error:
            typeof result === "string"
              ? result
              : rule.message || `Invalid ${field}`,
        };
      }
    }

    return { isValid: true, error: null };
  };

  const validateRow = (row: unknown) => {
    const errors: Record<string, string> = {};
    let isValid = true;

    for (const rule of rules) {
      const fieldValue = (row as Record<string, unknown>)?.[rule.field];
      const result = rule.validator(fieldValue, row);

      if (
        result === false ||
        (typeof result === "string" && result.length > 0)
      ) {
        errors[rule.field] =
          typeof result === "string"
            ? result
            : rule.message || `Invalid ${rule.field}`;
        isValid = false;
      }
    }

    return { isValid, errors };
  };

  return (
    <ValidationContext.Provider value={{ rules, validateField, validateRow }}>
      {children}
    </ValidationContext.Provider>
  );
};

export const useValidationContext = () => {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error(
      "useValidationContext must be used within a ValidationProvider"
    );
  }
  return context;
};
