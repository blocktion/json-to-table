import React from "react";
import { FiTrash2 } from "react-icons/fi";

interface RowActionsProps {
  rowIndex: number;
  row: unknown;
  isSelected: boolean;
  onDelete: () => void;
  onSelect: (selected: boolean) => void;
  enableDeletion: boolean;
}

export const RowActions: React.FC<RowActionsProps> = ({
  rowIndex,
  row,
  isSelected,
  onDelete,
  onSelect,
  enableDeletion,
}) => {
  return (
    <div className="flex items-center space-x-2 group">
      {/* Selection checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelect(e.target.checked)}
        className="rounded border-gray-300"
      />

      {/* Action buttons */}
      <div className="flex items-center space-x-1">
        {enableDeletion && (
          <button
            onClick={onDelete}
            className="p-1 text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            title="Delete row"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
