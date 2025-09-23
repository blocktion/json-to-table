import React, { useState, useRef, useEffect } from "react";
import { EditableColumn } from "../../types/editing";
import { createFieldEditor } from "../../utils/fieldEditors";

interface EditableCellProps {
  value: unknown;
  column: EditableColumn;
  rowIndex: number;
  isEditing: boolean;
  onStartEdit: () => void;
  onSaveEdit: (value: unknown) => void;
  onCancelEdit: () => void;
  validationError?: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  column,
  rowIndex,
  isEditing,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  validationError,
}) => {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSaveEdit(editValue);
    } else if (e.key === "Escape") {
      onCancelEdit();
    }
  };

  const handleBlur = () => {
    onSaveEdit(editValue);
  };

  if (!isEditing) {
    return (
      <div
        className="cursor-pointer hover:bg-gray-50 p-2 rounded min-h-[2rem] flex items-center"
        onClick={onStartEdit}
        title={validationError || "Click to edit"}
      >
        {column.renderer ? column.renderer(value, {}) : String(value || "")}
        {validationError && (
          <span className="text-red-500 text-xs ml-1">⚠</span>
        )}
      </div>
    );
  }

  const FieldEditor = createFieldEditor(column);

  return (
    <div className="relative">
      <FieldEditor
        ref={inputRef}
        value={editValue}
        onChange={setEditValue}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`w-full px-2 py-1 border rounded ${
          validationError ? "border-red-500" : "border-gray-300"
        }`}
        {...column.editorProps}
      />
      {validationError && (
        <div className="absolute top-full left-0 mt-1 text-xs text-red-500 bg-red-50 p-1 rounded shadow z-10">
          {validationError}
        </div>
      )}
    </div>
  );
};
