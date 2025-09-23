import React from "react";
import { FiTrash2, FiEdit, FiX } from "react-icons/fi";

interface BulkActionsProps {
  selectedRows: Set<number>;
  onBulkDelete: () => void;
  onBulkEdit: () => void;
  onClearSelection: () => void;
  enableBulkOperations: boolean;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedRows,
  onBulkDelete,
  onBulkEdit,
  onClearSelection,
  enableBulkOperations,
}) => {
  if (!enableBulkOperations || selectedRows.size === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-blue-800">
            {selectedRows.size} row{selectedRows.size !== 1 ? "s" : ""} selected
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onBulkEdit}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              <FiEdit className="w-4 h-4" />
              <span>Edit</span>
            </button>

            <button
              onClick={onBulkDelete}
              className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <button
          onClick={onClearSelection}
          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
          title="Clear selection"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
