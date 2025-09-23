import React from "react";
import { FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";

interface RowActionsProps {
  rowIndex: number;
  row: unknown;
  isSelected: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSelect: (selected: boolean) => void;
  enableEditing: boolean;
  enableDeletion: boolean;
}

export const RowActions: React.FC<RowActionsProps> = ({
  rowIndex,
  row,
  isSelected,
  isEditing,
  onEdit,
  onDelete,
  onSelect,
  enableEditing,
  enableDeletion,
}) => {
  return (
    <div className="flex items-center space-x-2">
      {/* Selection checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelect(e.target.checked)}
        className="rounded border-gray-300"
      />

      {/* Action buttons */}
      <div className="flex items-center space-x-1">
        {enableEditing && (
          <button
            onClick={onEdit}
            disabled={isEditing}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
            title="Edit row"
          >
            <FiEdit className="w-4 h-4" />
          </button>
        )}

        {enableDeletion && (
          <button
            onClick={onDelete}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete row"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        )}

        <button
          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
          title="More actions"
        >
          <FiMoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
