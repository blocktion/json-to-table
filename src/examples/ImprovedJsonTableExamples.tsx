import React from "react";
import { JsonTable } from "../components/JsonTable";
import { ThemeProvider } from "../styles/theme-provider";

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

export const ImprovedJsonTableExamples: React.FC = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}
      >
        Improved JSON Table Examples
      </h1>

      {/* Default Theme */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          Default Theme
        </h2>
        <JsonTable
          data={sampleData}
          title="Default Theme Table"
          theme="default"
          options={{
            maxDepth: 3,
            enableSorting: true,
            enableNavigation: true,
            enablePagination: true,
            pageSize: 2,
            showRowNumbers: true,
          }}
          customRenderers={{
            email: (value) => (
              <a
                href={`mailto:${value}`}
                style={{
                  color: "#3b82f6",
                  textDecoration: "underline",
                }}
              >
                {value as string}
              </a>
            ),
            isActive: (value) => (
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  backgroundColor: value ? "#dcfce7" : "#fef2f2",
                  color: value ? "#166534" : "#991b1b",
                }}
              >
                {value ? "Active" : "Inactive"}
              </span>
            ),
          }}
        />
      </section>

      {/* Dark Theme */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          Dark Theme
        </h2>
        <div
          style={{
            backgroundColor: "#111827",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          <JsonTable
            data={sampleData}
            title="Dark Theme Table"
            theme="dark"
            options={{
              maxDepth: 2,
              enableSorting: true,
              enableNavigation: true,
              enablePagination: false,
              showRowNumbers: false,
            }}
          />
        </div>
      </section>

      {/* Minimal Theme */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          Minimal Theme
        </h2>
        <JsonTable
          data={sampleData}
          title="Minimal Theme Table"
          theme="minimal"
          options={{
            maxDepth: 2,
            enableSorting: true,
            enableNavigation: false,
            enablePagination: false,
            showRowNumbers: false,
          }}
        />
      </section>

      {/* Custom Theme Provider */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          Custom Theme Provider
        </h2>
        <ThemeProvider theme="dark">
          <JsonTable
            data={sampleData}
            title="Custom Theme Provider Table"
            options={{
              maxDepth: 3,
              enableSorting: true,
              enableNavigation: true,
              enablePagination: true,
              pageSize: 2,
              showRowNumbers: true,
            }}
            onRowClick={(row, index) => {
              console.log("Row clicked:", row, "at index:", index);
            }}
            onCellClick={(value, column, row) => {
              console.log("Cell clicked:", {
                value,
                column: column.displayName,
                row,
              });
            }}
          />
        </ThemeProvider>
      </section>

      {/* Advanced Features */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          Advanced Features
        </h2>
        <JsonTable
          data={sampleData}
          title="Advanced Features Table"
          theme="default"
          options={{
            maxDepth: 4,
            enableSorting: true,
            enableNavigation: true,
            enablePagination: true,
            enableFiltering: true,
            mergeRepeatedColumns: true,
            pageSize: 2,
            showRowNumbers: true,
            showColumnCount: true,
            showRowCount: true,
          }}
          customRenderers={{
            name: (value, row) => (
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  {(value as string).charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: "500" }}>{value as string}</span>
              </div>
            ),
            age: (value) => (
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "0.25rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                {String(value)} years
              </span>
            ),
          }}
        />
      </section>
    </div>
  );
};
