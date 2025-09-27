import React from "react";
import { JsonTable } from "../components/JsonTable";

// Example data for demonstrations
const sampleData = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    address: {
      street: "123 Main St",
      city: "New York",
      country: "USA",
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
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      country: "USA",
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
    address: {
      street: "789 Pine Rd",
      city: "Chicago",
      country: "USA",
    },
    hobbies: ["cooking", "gardening", "photography"],
    isActive: true,
    lastLogin: "2024-01-14T09:15:00Z",
  },
];

const complexData = [
  {
    user: {
      profile: {
        name: "Alice",
        age: 28,
        preferences: {
          theme: "dark",
          language: "en",
        },
      },
      settings: {
        notifications: true,
        privacy: "public",
      },
    },
    posts: [
      { title: "Hello World", content: "My first post", likes: 10 },
      { title: "React Tips", content: "Some useful tips", likes: 25 },
    ],
    metadata: {
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T12:00:00Z",
    },
  },
  {
    user: {
      profile: {
        name: "Bob",
        age: 32,
        preferences: {
          theme: "light",
          language: "es",
        },
      },
      settings: {
        notifications: false,
        privacy: "private",
      },
    },
    posts: [
      { title: "TypeScript Guide", content: "Advanced patterns", likes: 50 },
    ],
    metadata: {
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-12T15:30:00Z",
    },
  },
];

export const JsonTableExamples: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-obsidian mb-6">
        JSON Table Examples
      </h1>

      {/* Basic Table */}
      <section>
        <h2 className="text-2xl font-semibold text-obsidian mb-4">
          Basic Table
        </h2>
        <JsonTable
          data={sampleData}
          options={{
            maxDepth: 2,
            enableSorting: true,
            enableNavigation: false,
            enablePagination: false,
            enableFiltering: false,
            mergeRepeatedColumns: false,
            showRowNumbers: false,
          }}
          className="mb-6"
        />
      </section>

      {/* Navigable Table */}
      <section>
        <h2 className="text-2xl font-semibold text-obsidian mb-4">
          Navigable Table
        </h2>
        <JsonTable
          data={sampleData}
          options={{
            maxDepth: 3,
            enableSorting: true,
            enableNavigation: true,
            enablePagination: false,
            enableFiltering: false,
            mergeRepeatedColumns: false,
            showRowNumbers: false,
          }}
          className="mb-6"
        />
      </section>

      {/* Auto-detected Table with Merging */}
      <section>
        <h2 className="text-2xl font-semibold text-obsidian mb-4">
          Auto-detected Table with Column Merging
        </h2>
        <JsonTable
          data={sampleData}
          options={{
            maxDepth: 3,
            enableSorting: true,
            enableNavigation: true,
            enablePagination: false,
            enableFiltering: false,
            mergeRepeatedColumns: true,
            showRowNumbers: false,
          }}
          className="mb-6"
        />
      </section>

      {/* Advanced JsonTable with All Features */}
      <section>
        <h2 className="text-2xl font-semibold text-obsidian mb-4">
          Advanced JsonTable with All Features
        </h2>
        <JsonTable
          data={sampleData}
          options={{
            maxDepth: 3,
            enableSorting: true,
            enableNavigation: true,
            enablePagination: true,
            enableFiltering: true,
            mergeRepeatedColumns: true,
            pageSize: 10,
            showRowNumbers: true,
          }}
          onRowClick={(row, index) => console.log("Row clicked:", row)}
          onCellClick={(value, column, row) =>
            console.log("Cell clicked:", value)
          }
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
          }}
          className="mb-6"
        />
      </section>

      {/* Complex Nested Data */}
      <section>
        <h2 className="text-2xl font-semibold text-obsidian mb-4">
          Complex Nested Data
        </h2>
        <JsonTable
          data={complexData}
          options={{
            maxDepth: 4,
            enableSorting: true,
            enableNavigation: true,
            enablePagination: false,
            enableFiltering: false,
            mergeRepeatedColumns: false,
            showRowNumbers: true,
          }}
          className="mb-6"
        />
      </section>

      {/* Array Merging Example */}
      <section>
        <h2 className="text-2xl font-semibold text-obsidian mb-4">
          Array Merging Example
        </h2>
        <JsonTable
          data={[
            { id: 1, name: "John", tags: ["developer"] },
            { id: 2, name: "Jane", tags: ["designer"] },
            { id: 3, name: "Bob", tags: ["manager"] },
            { id: 4, name: "Alice", tags: ["developer", "designer"] },
          ]}
          options={{
            maxDepth: 2,
            enableSorting: true,
            enableNavigation: true,
            enablePagination: false,
            enableFiltering: false,
            mergeRepeatedColumns: true,
            showRowNumbers: true,
          }}
          className="mb-6"
        />
      </section>
    </div>
  );
};
