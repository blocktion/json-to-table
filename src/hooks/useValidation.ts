import { useCallback, useMemo } from "react";
import { ValidationRule } from "../types/editing";

export const useValidation = (rules: ValidationRule[] = []) => {
  const validateField = useCallback(
    (field: string, value: unknown, row: unknown) => {
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
    },
    [rules]
  );

  const validateRow = useCallback(
    (row: unknown) => {
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
    },
    [rules]
  );

  const validateChanges = useCallback(
    (
      changes: Array<{ field?: string; newValue?: unknown; rowIndex: number }>,
      data: unknown[]
    ) => {
      const validationErrors: Record<string, string> = {};
      let hasErrors = false;

      changes.forEach((change) => {
        if (change.field && change.newValue !== undefined) {
          const row = data[change.rowIndex];
          const result = validateField(change.field, change.newValue, row);

          if (!result.isValid && result.error) {
            const errorKey = `${change.rowIndex}_${change.field}`;
            validationErrors[errorKey] = result.error;
            hasErrors = true;
          }
        }
      });

      return { hasErrors, validationErrors };
    },
    [validateField]
  );

  const getFieldError = useCallback(
    (
      rowIndex: number,
      field: string,
      validationErrors: Record<string, string>
    ) => {
      const errorKey = `${rowIndex}_${field}`;
      return validationErrors[errorKey] || null;
    },
    []
  );

  return {
    validateField,
    validateRow,
    validateChanges,
    getFieldError,
  };
};
