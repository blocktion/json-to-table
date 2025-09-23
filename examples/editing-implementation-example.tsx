/**
 * Example implementation of the proposed editing functionality
 * This demonstrates how the enhanced JsonTable would work with editing capabilities
 */

import React, { useState } from "react";
import {
  JsonTable,
  EditableTableOptions,
  DataChange,
} from "@parallaxsolutions/json-to-table";

// Example data
const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    isActive: true,
    lastLogin: "2024-01-15T10:30:00Z",
    tags: ["developer", "react"],
    profile: {
      bio: "Full-stack developer",
      location: "New York",
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    age: 25,
    isActive: false,
    lastLogin: "2024-01-10T14:20:00Z",
    tags: ["designer", "ui"],
    profile: {
      bio: "UI/UX Designer",
      location: "Los Angeles",
    },
  },
];

// Validation rules
const validationRules = [
  {
    field: "email",
    validator: (value: unknown) => {
      if (typeof value !== "string") return false;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    message: "Invalid email format",
  },
  {
    field: "age",
    validator: (value: unknown) => {
      if (typeof value !== "number") return false;
      return value >= 18 && value <= 100;
    },
    message: "Age must be between 18 and 100",
  },
  {
    field: "name",
    validator: (value: unknown) => {
      if (typeof value !== "string") return false;
      return value.trim().length >= 2;
    },
    message: "Name must be at least 2 characters",
  },
];

// Custom field editors
const customRenderers = {
  email: (value: unknown, row: unknown) => {
    return (
      <a href={`mailto:${value}`} className="text-blue-600 underline">
        {value as string}
      </a>
    );
  },

  isActive: (value: unknown, row: unknown) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {value ? "Active" : "Inactive"}
      </span>
    );
  },

  tags: (value: unknown, row: unknown) => {
    return (
      <div className="flex flex-wrap gap-1">
        {(value as string[]).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  },
};

// Main component example
export const EditableTableExample: React.FC = () => {
  const [data, setData] = useState(sampleData);
  const [changes, setChanges] = useState<DataChange[]>([]);

  const handleDataChange = (newData: unknown[], dataChanges: DataChange[]) => {
    console.log("Data changed:", dataChanges);
    setData(newData as typeof sampleData);
    setChanges(dataChanges);
  };

  const handleRowDelete = (rowIndex: number, row: unknown) => {
    console.log("Row deleted:", rowIndex, row);
    // Handle row deletion logic
  };

  const handleFieldUpdate = (
    rowIndex: number,
    field: string,
    newValue: unknown,
    oldValue: unknown
  ) => {
    console.log("Field updated:", { rowIndex, field, newValue, oldValue });
    // Handle field update logic
  };

  const handleFieldDelete = (
    rowIndex: number,
    field: string,
    value: unknown
  ) => {
    console.log("Field deleted:", { rowIndex, field, value });
    // Handle field deletion logic
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", changes);
    // Implement save logic (API call, etc.)
    setChanges([]);
  };

  const handleDiscardChanges = () => {
    console.log("Discarding changes");
    setChanges([]);
    // Revert to original data
  };

  const editableOptions: EditableTableOptions = {
    // Existing options
    enableSorting: true,
    enableNavigation: true,
    enablePagination: true,
    showRowNumbers: true,

    // New editing options
    enableEditing: true,
    enableRowDeletion: true,
    enableFieldEditing: true,
    enableFieldDeletion: true,
    enableInlineEditing: true,
    enableBulkOperations: true,
    editMode: "inline",
    validationRules,

    // Callbacks
    onDataChange: handleDataChange,
    onRowDelete: handleRowDelete,
    onFieldUpdate: handleFieldUpdate,
    onFieldDelete: handleFieldDelete,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Editable JSON Table</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSaveChanges}
            disabled={changes.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            Save Changes ({changes.length})
          </button>
          <button
            onClick={handleDiscardChanges}
            disabled={changes.length === 0}
            className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
          >
            Discard Changes
          </button>
        </div>
      </div>

      {/* Changes Summary */}
      {changes.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Pending Changes:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            {changes.map((change, index) => (
              <li key={index}>
                {change.type === "row_delete" &&
                  `Row ${change.rowIndex} deleted`}
                {change.type === "field_update" &&
                  `Row ${change.rowIndex}, ${change.field}: ${change.oldValue} → ${change.newValue}`}
                {change.type === "field_delete" &&
                  `Row ${change.rowIndex}, ${change.field} deleted`}
                {change.type === "field_add" &&
                  `Row ${change.rowIndex}, ${change.field} added`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Editable Table */}
      <JsonTable
        data={data}
        title="Editable Users Table"
        options={editableOptions}
        customRenderers={customRenderers}
        theme="default"
      />

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">How to Use:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Click on any cell to edit it inline</li>
          <li>• Use the row action buttons to delete rows</li>
          <li>• Select multiple rows for bulk operations</li>
          <li>• Right-click on cells for field-specific actions</li>
          <li>• Press Enter to save, Escape to cancel editing</li>
        </ul>
      </div>
    </div>
  );
};

export default EditableTableExample;
