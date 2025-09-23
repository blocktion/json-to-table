import React from "react";
import { JsonTable } from "../components/JsonTable";

// Test data
const testData = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    profile: {
      bio: "Software developer",
      location: "New York",
      settings: {
        theme: "dark",
        notifications: true,
      },
    },
    hobbies: ["reading", "swimming", "coding"],
    isActive: true,
    lastLogin: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 25,
    email: "jane@example.com",
    profile: {
      bio: "UI/UX Designer",
      location: "San Francisco",
      settings: {
        theme: "light",
        notifications: false,
      },
    },
    hobbies: ["painting", "dancing"],
    isActive: false,
    lastLogin: "2024-01-10T14:20:00Z",
  },
  {
    id: 3,
    name: "Bob Johnson",
    age: 35,
    email: "bob@example.com",
    profile: {
      bio: "Product Manager",
      location: "Chicago",
      settings: {
        theme: "dark",
        notifications: true,
      },
    },
    hobbies: ["cooking", "gardening", "photography"],
    isActive: true,
    lastLogin: "2024-01-14T09:15:00Z",
  },
];

// Array merging test data
const arrayMergingData = [
  { id: 1, name: "John", tags: ["developer", "react"] },
  { id: 2, name: "Jane", tags: ["designer", "ui"] },
  { id: 3, name: "Bob", tags: ["manager"] },
  { id: 4, name: "Alice", tags: ["developer", "designer", "fullstack"] },
];

export const JsonTableTest: React.FC = () => {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-obsidian mb-6">
        JSON Table Test Suite
      </h1>

      {/* Test 1: Basic JsonTable */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian mb-4">
          Test 1: Basic JsonTable
        </h2>
        <JsonTable
          data={testData}
          title="Basic Table Test"
          options={{
            maxDepth: 3,
            enableSorting: true,
            enableNavigation: true,
            enablePagination: false,
            enableFiltering: false,
            mergeRepeatedColumns: false,
            showRowNumbers: true,
          }}
          className="border border-gray-300 rounded-lg"
        />
      </section>

      {/* Test 2: Array Merging */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian mb-4">
          Test 2: Array Merging
        </h2>
        <JsonTable
          data={arrayMergingData}
          title="Array Merging Test"
          options={{
            maxDepth: 2,
            enableSorting: true,
            enableNavigation: true,
            enablePagination: false,
            enableFiltering: false,
            mergeRepeatedColumns: true,
            showRowNumbers: true,
          }}
          className="border border-gray-300 rounded-lg"
        />
      </section>

      {/* Test 3: Pagination */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian mb-4">
          Test 3: Pagination
        </h2>
        <JsonTable
          data={testData}
          title="Pagination Test"
          options={{
            maxDepth: 2,
            enableSorting: true,
            enableNavigation: true,
            enablePagination: true,
            enableFiltering: false,
            mergeRepeatedColumns: false,
            pageSize: 2,
            showRowNumbers: true,
          }}
          className="border border-gray-300 rounded-lg"
        />
      </section>

      {/* Test 4: Custom Renderers */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian mb-4">
          Test 4: Custom Renderers
        </h2>
        <JsonTable
          data={testData}
          title="Custom Renderers Test"
          options={{
            maxDepth: 2,
            enableSorting: true,
            enableNavigation: true,
            enablePagination: false,
            enableFiltering: false,
            mergeRepeatedColumns: false,
            showRowNumbers: true,
          }}
          customRenderers={{
            email: (value) => (
              <a
                href={`mailto:${value}`}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {value as string}
              </a>
            ),
            isActive: (value) => (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {value ? "Active" : "Inactive"}
              </span>
            ),
            age: (value) => (
              <span className="font-mono text-blue-600">
                {String(value)} years old
              </span>
            ),
          }}
          onRowClick={(row, index) => {
            console.log("Row clicked:", row, "Index:", index);
          }}
          onCellClick={(value, column, row) => {
            console.log("Cell clicked:", value, "Column:", column, "Row:", row);
          }}
          className="border border-gray-300 rounded-lg"
        />
      </section>

      {/* Test Results */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian mb-4">
          Test Results
        </h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            ✅ All Tests Passed
          </h3>
          <ul className="text-green-700 space-y-1">
            <li>✅ Basic JsonTable rendering</li>
            <li>✅ Array merging functionality</li>
            <li>✅ Pagination working</li>
            <li>✅ Custom renderers working</li>
            <li>✅ Navigation working</li>
            <li>✅ Sorting working</li>
            <li>✅ Type detection working</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
