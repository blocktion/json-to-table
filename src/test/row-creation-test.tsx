/**
 * Test file to verify row creation functionality
 * This demonstrates the complete row creation implementation
 */

import React, { useState } from "react";
import { JsonTable } from "../components/JsonTable";

// Test data
const testData = [
  { id: 1, name: "John Doe", email: "john@example.com", age: 30 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", age: 25 },
];

// Test component
export const RowCreationTest: React.FC = () => {
  const [data, setData] = useState(testData);
  const [changes, setChanges] = useState<any[]>([]);

  const handleDataChange = (newData: unknown[], dataChanges: any[]) => {
    console.log("Data changed:", dataChanges);
    setData(newData as typeof testData);
    setChanges(dataChanges);
  };

  const handleRowAdd = (rowIndex: number, row: unknown) => {
    console.log("Row added at index:", rowIndex, "Row data:", row);
  };

  const handleRowDelete = (rowIndex: number, row: unknown) => {
    console.log("Row deleted at index:", rowIndex, "Row data:", row);
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
  };

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
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Row Creation Test
        </h1>
        <p className="text-gray-600">
          Test the complete row creation functionality implementation
        </p>
      </div>

      {/* Changes Summary */}
      {changes.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Changes Made:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            {changes.map((change, index) => (
              <li key={index}>
                {change.type === "row_add" &&
                  `Row added at index ${change.rowIndex}`}
                {change.type === "row_delete" &&
                  `Row deleted at index ${change.rowIndex}`}
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

      {/* Test Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Test Instructions:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. Click the "Add Row" button to create a new row</li>
          <li>2. Edit the new row's fields by clicking on them</li>
          <li>3. Try deleting the new row using the delete button</li>
          <li>4. Check the console for event logs</li>
          <li>5. Verify changes are tracked in the changes summary above</li>
        </ul>
      </div>

      {/* Test Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <JsonTable
          data={data}
          options={{
            // Core features
            enableSorting: true,
            enableNavigation: true,
            enablePagination: true,
            showRowNumbers: true,

            // Editing features
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
          customRenderers={{
            email: (value) => (
              <a
                href={`mailto:${value}`}
                className="text-blue-600 hover:text-blue-800 underline"
                onClick={(e) => e.stopPropagation()}
              >
                {value as string}
              </a>
            ),
          }}
          theme="default"
          onDataChange={handleDataChange}
          onRowAdd={handleRowAdd}
          onRowDelete={handleRowDelete}
          onFieldUpdate={handleFieldUpdate}
          onFieldDelete={handleFieldDelete}
          onBulkDelete={handleBulkDelete}
        />
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-800 mb-2">
          Implementation Details:
        </h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>This test verifies the complete row creation implementation:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>DataChange Interface:</strong> Added "row_add" type
            </li>
            <li>
              <strong>useDataMutation Hook:</strong> Added addRow() function
            </li>
            <li>
              <strong>AddRowButton Component:</strong> UI for adding rows
            </li>
            <li>
              <strong>JsonTable Integration:</strong> onRowAdd event handler
            </li>
            <li>
              <strong>Change Tracking:</strong> Row additions are tracked
            </li>
            <li>
              <strong>Validation:</strong> New rows respect validation rules
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RowCreationTest;
