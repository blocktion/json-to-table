import React, { forwardRef } from "react";
import { EditableColumn } from "../types/editing";

interface FieldEditorProps {
  value: unknown;
  onChange: (value: unknown) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onBlur?: () => void;
  className?: string;
  [key: string]: any;
}

export const TextEditor = forwardRef<HTMLInputElement, FieldEditorProps>(
  ({ value, onChange, onKeyDown, onBlur, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        value={value === null || value === undefined ? "" : String(value)}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={className}
        {...props}
      />
    );
  }
);

export const NumberEditor = forwardRef<HTMLInputElement, FieldEditorProps>(
  ({ value, onChange, onKeyDown, onBlur, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="number"
        value={value === null || value === undefined ? "" : Number(value)}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={`${className || ""} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        {...props}
      />
    );
  }
);

export const BooleanEditor = forwardRef<HTMLSelectElement, FieldEditorProps>(
  ({ value, onChange, onKeyDown, onBlur, className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        value={String(value)}
        onChange={(e) => onChange(e.target.value === "true")}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={className}
        {...props}
      >
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    );
  }
);

export const DateEditor = forwardRef<HTMLInputElement, FieldEditorProps>(
  ({ value, onChange, onKeyDown, onBlur, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="datetime-local"
        value={
          value instanceof Date
            ? value.toISOString().slice(0, 16)
            : typeof value === "string"
              ? value.slice(0, 16)
              : ""
        }
        onChange={(e) => onChange(new Date(e.target.value))}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={className}
        {...props}
      />
    );
  }
);

export const SelectEditor = forwardRef<HTMLSelectElement, FieldEditorProps>(
  (
    { value, onChange, onKeyDown, onBlur, className, options = [], ...props },
    ref
  ) => {
    return (
      <select
        ref={ref}
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className={className}
        {...props}
      >
        {options.map((option: { value: unknown; label: string }) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

export const createFieldEditor = (
  column: EditableColumn
): React.ComponentType<FieldEditorProps> => {
  switch (column.editorType) {
    case "text":
      return TextEditor;
    case "number":
      return NumberEditor;
    case "boolean":
      return BooleanEditor;
    case "date":
      return DateEditor;
    case "select":
      return SelectEditor;
    case "custom":
      return (
        (column.editorProps
          ?.component as React.ComponentType<FieldEditorProps>) || TextEditor
      );
    default:
      return TextEditor;
  }
};
