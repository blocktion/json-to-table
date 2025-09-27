import React, { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

interface AddRowButtonProps {
  onAddRow: (rowData: unknown, insertIndex?: number) => void;
  templateRow?: unknown;
  insertIndex?: number;
  className?: string;
  disabled?: boolean;
}

export const AddRowButton: React.FC<AddRowButtonProps> = ({
  onAddRow,
  templateRow,
  insertIndex,
  className = "",
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, unknown>>({});

  const handleAddRow = () => {
    const rowData =
      Object.keys(newRowData).length > 0 ? newRowData : templateRow;
    onAddRow(rowData, insertIndex);
    setNewRowData({});
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setNewRowData({});
    setIsExpanded(false);
  };

  const handleFieldChange = (field: string, value: string) => {
    setNewRowData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRow();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        disabled={disabled}
        className={`flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
        title="Add new row"
      >
        <FiPlus className="w-4 h-4" />
        <span>Add Row</span>
      </button>
    );
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Add New Row</h3>
        <button
          onClick={handleCancel}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          title="Cancel"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Field Name
            </label>
            <input
              type="text"
              placeholder="Enter field name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type="text"
              placeholder="Enter value"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddRow}
            className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
          >
            Add Row
          </button>
        </div>
      </div>
    </div>
  );
};

// Simplified version for quick row addition
export const QuickAddRowButton: React.FC<
  Omit<AddRowButtonProps, "templateRow" | "insertIndex">
> = ({ onAddRow, className = "", disabled = false }) => {
  const handleQuickAdd = () => {
    // Create a simple row with a default ID
    const newRow = {
      id: Date.now(),
      name: "",
      // Add other common fields as needed
    };
    onAddRow(newRow);
  };

  return (
    <button
      onClick={handleQuickAdd}
      disabled={disabled}
      className={`flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      title="Add new row"
    >
      <FiPlus className="w-4 h-4" />
      <span>Add Row</span>
    </button>
  );
};
