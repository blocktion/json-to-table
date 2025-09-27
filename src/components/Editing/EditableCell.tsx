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
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Remove auto-focus to prevent infinite loops
  // useEffect(() => {
  //   if (isEditing && inputRef.current && !hasUserInteracted) {
  //     // Only focus if this is the first cell and user hasn't interacted yet
  //     const isFirstCell = column.cleanKey === Object.keys(column).find(key => key === 'cleanKey');
  //     if (isFirstCell) {
  //       inputRef.current.focus();
  //       inputRef.current.select();
  //     }
  //   }
  // }, [isEditing, column.cleanKey, hasUserInteracted]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setHasUserInteracted(true);
    if (e.key === "Enter") {
      onSaveEdit(editValue);
    } else if (e.key === "Escape") {
      onCancelEdit();
    }
  };

  const handleBlur = () => {
    // Don't auto-save on blur to prevent infinite loops
    // User should use Enter key or click save button to save
  };

  const handleChange = (newValue: unknown) => {
    setHasUserInteracted(true);
    setEditValue(newValue);
  };

  if (!isEditing) {
    return (
      <div
        className="cursor-pointer hover:bg-gray-50 p-2 rounded min-h-[2rem] flex items-center"
        onClick={onStartEdit}
        onDoubleClick={onStartEdit}
        title={validationError || "Click or double-click to edit"}
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
        onChange={handleChange}
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
