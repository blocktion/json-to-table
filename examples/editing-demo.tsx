/**
 * Comprehensive demo of the enhanced JsonTable with editing capabilities
 * This demonstrates all the new editing features implemented
 */

import React, { useState } from "react";
import { JsonTable } from "../src/components/JsonTable";

// Sample data with various data types
const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    isActive: true,
    lastLogin: "2024-01-15T10:30:00Z",
    salary: 75000,
    department: "Engineering",
    tags: ["developer", "react", "typescript"],
    profile: {
      bio: "Full-stack developer with 5+ years experience",
      location: "New York",
      skills: ["JavaScript", "TypeScript", "React", "Node.js"],
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    age: 25,
    isActive: false,
    lastLogin: "2024-01-10T14:20:00Z",
    salary: 65000,
    department: "Design",
    tags: ["designer", "ui", "ux"],
    profile: {
      bio: "UI/UX Designer passionate about user experience",
      location: "Los Angeles",
      skills: ["Figma", "Sketch", "Adobe Creative Suite"],
    },
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    age: 35,
    isActive: true,
    lastLogin: "2024-01-20T09:15:00Z",
    salary: 85000,
    department: "Engineering",
    tags: ["backend", "python", "database"],
    profile: {
      bio: "Backend developer specializing in Python and databases",
      location: "San Francisco",
      skills: ["Python", "Django", "PostgreSQL", "Redis"],
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
  {
    field: "salary",
    validator: (value: unknown) => {
      if (typeof value !== "number") return false;
      return value >= 0;
    },
    message: "Salary must be a positive number",
  },
];

// Custom field editors
const customRenderers = {
  email: (value: unknown, row: unknown) => {
    return (
      <a
        href={`mailto:${value}`}
        className="text-blue-600 hover:text-blue-800 underline"
        onClick={(e) => e.stopPropagation()}
      >
        {value as string}
      </a>
    );
  },

  isActive: (value: unknown) => {
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

  tags: (value: unknown) => {
    if (!Array.isArray(value)) return null;

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

  salary: (value: unknown) => {
    return (
      <span className="font-mono">${(value as number).toLocaleString()}</span>
    );
  },
};

// Main demo component
export const EditingDemo: React.FC = () => {
  const [data, setData] = useState(sampleData);
  const [changes, setChanges] = useState<any[]>([]);

  const handleDataChange = (newData: unknown[], dataChanges: any[]) => {
    console.log("Data changed:", dataChanges);
    setData(newData as typeof sampleData);
    setChanges(dataChanges);
  };

  const handleRowDelete = (rowIndex: number, row: unknown) => {
    console.log("Row deleted:", rowIndex, row);
    // In a real app, you might want to show a confirmation dialog
  };

  const handleFieldUpdate = (
    rowIndex: number,
    field: string,
    newValue: unknown,
    oldValue: unknown
  ) => {
    console.log("Field updated:", { rowIndex, field, newValue, oldValue });
  };

  const handleFieldDelete = (
    rowIndex: number,
    field: string,
    value: unknown
  ) => {
    console.log("Field deleted:", { rowIndex, field, value });
  };

  const handleBulkDelete = (rowIndices: number[]) => {
    console.log("Bulk delete:", rowIndices);
    // In a real app, you might want to show a confirmation dialog
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", changes);
    // In a real app, you would make an API call here
    setChanges([]);
  };

  const handleDiscardChanges = () => {
    console.log("Discarding changes");
    setChanges([]);
    // Revert to original data
    setData(sampleData);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Editable JSON Table Demo
          </h1>
          <p className="text-gray-600 mt-2">
            A comprehensive demonstration of the enhanced JsonTable with editing
            capabilities
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveChanges}
            disabled={changes.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700 transition-colors"
          >
            Save Changes ({changes.length})
          </button>
          <button
            onClick={handleDiscardChanges}
            disabled={changes.length === 0}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
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

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Row Management</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Select rows with checkboxes</li>
            <li>• Delete individual rows</li>
            <li>• Bulk delete operations</li>
            <li>• Visual selection feedback</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2">Field Editing</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Click cells to edit inline</li>
            <li>• Type-specific editors</li>
            <li>• Real-time validation</li>
            <li>• Keyboard navigation</li>
          </ul>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-medium text-purple-800 mb-2">Data Management</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Change tracking</li>
            <li>• Save/discard changes</li>
            <li>• Undo/redo support</li>
            <li>• Bulk operations</li>
          </ul>
        </div>
      </div>

      {/* Editable Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <JsonTable
          data={data}
          title="Employee Management System"
          options={{
            // Existing options
            enableSorting: true,
            enableNavigation: true,
            enablePagination: true,
            showRowNumbers: true,
            showColumnCount: true,
            showRowCount: true,

            // New editing options
            enableEditing: true,
            enableRowDeletion: true,
            enableFieldEditing: true,
            enableFieldDeletion: true,
            enableInlineEditing: true,
            enableBulkOperations: true,
            editMode: "inline",
            validationRules,

            // Pagination
            pageSize: 10,
          }}
          customRenderers={customRenderers}
          theme="default"
          onDataChange={handleDataChange}
          onRowDelete={handleRowDelete}
          onFieldUpdate={handleFieldUpdate}
          onFieldDelete={handleFieldDelete}
          onBulkDelete={handleBulkDelete}
        />
      </div>

      {/* Usage Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-800 mb-2">How to Use:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-1">Editing:</h4>
            <ul className="space-y-1">
              <li>• Click on any cell to edit it inline</li>
              <li>• Press Enter to save, Escape to cancel</li>
              <li>• Use Tab to navigate between cells</li>
              <li>• Validation errors appear below fields</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-1">Row Management:</h4>
            <ul className="space-y-1">
              <li>• Check boxes to select rows</li>
              <li>• Use action buttons to edit/delete</li>
              <li>• Select multiple rows for bulk operations</li>
              <li>• Changes are tracked and can be saved</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-800 mb-2">
          Technical Implementation:
        </h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            This demo showcases the complete editing system implemented in the
            JsonTable component, including:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Data Mutation Hooks:</strong> useDataMutation for state
              management
            </li>
            <li>
              <strong>Validation System:</strong> Real-time field validation
              with custom rules
            </li>
            <li>
              <strong>Field Editors:</strong> Type-specific editors (text,
              number, boolean, date, select)
            </li>
            <li>
              <strong>Row Management:</strong> Selection, deletion, and bulk
              operations
            </li>
            <li>
              <strong>Change Tracking:</strong> Complete audit trail of all
              modifications
            </li>
            <li>
              <strong>Theme Integration:</strong> Consistent styling with the
              existing theme system
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditingDemo;
