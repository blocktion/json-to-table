# @blocktion/json-to-table

A powerful, modular React component for converting JSON data to navigable tables with advanced features like automatic column detection, theming, array merging, type detection, and sub-table navigation. This component is part of the **Blocktion platform** ecosystem.

> **Note**: This component was originally developed for the [Blocktion platform](https://blocktion.io) - an intelligent workflow automation platform. We've open-sourced this component for anyone to use in their React projects. Read the [root folder README](../../README.md) to understand what Blocktion is.

## ✨ Features

### Core Features

- **🚀 Automatic Column Detection**: Automatically generates columns from any object structure
- **🔗 Nested Navigation**: Click on cells to navigate into nested objects and arrays as separate sub-tables
- **📊 Smart Sorting**: Click column headers to sort data with intelligent type detection
- **🔍 Advanced Filtering**: Filter data with multiple operators and type-aware filtering
- **📄 Pagination**: Built-in pagination for large datasets
- **🔄 Array Merging**: Automatically merges repeated columns into arrays
- **🎯 Type Detection**: Automatically detects and handles different data types
- **🍞 Breadcrumb Navigation**: Navigate back to previous levels using breadcrumbs
- **🎨 Customizable Rendering**: Custom cell renderers for any column
- **📱 Responsive Design**: Horizontal scrolling for large datasets
- **🔧 TypeScript Support**: Fully typed components and utilities
- **🎭 Multiple Themes**: Built-in theme support
- **⚡ Performance Optimized**: Memoized operations and efficient rendering

### 🆕 Editing Features

- **✏️ Inline Editing**: Click any cell to edit it directly in the table
- **🗑️ Row Management**: Add, delete individual rows or perform bulk operations
- **🔧 Field Operations**: Add, update, or delete specific fields
- **✅ Real-time Validation**: Built-in validation system with custom rules
- **📝 Change Tracking**: Complete audit trail of all modifications
- **💾 Save/Discard**: Save changes or discard them with confirmation
- **🎯 Type-specific Editors**: Different editors for text, numbers, booleans, dates, etc.
- **⌨️ Keyboard Navigation**: Full keyboard support for editing workflows
- **🔍 Bulk Operations**: Select and operate on multiple rows simultaneously
- **🎨 Visual Feedback**: Clear indicators for editable fields and validation errors

## 📦 Installation

```bash
npm install @blocktion/json-to-table
```

## 🏗️ Modular Usage

This package is designed with modularity in mind. You can import only what you need:

```tsx
// Main component
import { JsonTable } from "@blocktion/json-to-table";

// Individual components
import {
  TableContainer,
  TableHeader,
  TableBody,
} from "@blocktion/json-to-table/components";

// Hooks
import {
  useTableData,
  useSorting,
  usePagination,
} from "@blocktion/json-to-table/hooks";

// Themes
import {
  defaultTheme,
  darkTheme,
  minimalTheme,
} from "@blocktion/json-to-table/themes";

// Utilities
import { ArrayAnalyzer, ObjectUtils } from "@blocktion/json-to-table/utils";
```

## 🚀 Quick Start

### Basic Table

```tsx
import { JsonTable } from "@blocktion/json-to-table";

const data = [
  { id: 1, name: "John", age: 30, email: "john@example.com" },
  { id: 2, name: "Jane", age: 25, email: "jane@example.com" },
];

function App() {
  return (
    <JsonTable
      data={data}
      title="Users"
      options={{
        maxDepth: 2,
        enableSorting: true,
        enableNavigation: true,
      }}
    />
  );
}
```

### Editable Table with Full Editing Capabilities

```tsx
import React, { useState } from "react";
import { JsonTable } from "@parallaxsolutions/json-to-table";

const data = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    isActive: true,
    salary: 75000,
    department: "Engineering",
    tags: ["developer", "react"],
  },
];

function EditableApp() {
  const [tableData, setTableData] = useState(data);

  const handleDataChange = (newData, changes) => {
    console.log("Data changed:", changes);
    setTableData(newData);
  };

  const validationRules = [
    {
      field: "email",
      validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Invalid email format",
    },
    {
      field: "age",
      validator: (value) => value >= 18 && value <= 100,
      message: "Age must be between 18 and 100",
    },
  ];

  return (
    <JsonTable
      data={tableData}
      title="Editable Users Table"
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
      }}
      onDataChange={handleDataChange}
      onRowAdd={(rowIndex, row) => console.log("Row added:", rowIndex)}
      onRowDelete={(rowIndex, row) => console.log("Row deleted:", rowIndex)}
      onFieldUpdate={(rowIndex, field, newValue, oldValue) =>
        console.log("Field updated:", { rowIndex, field, newValue, oldValue })
      }
      customRenderers={{
        email: (value) => (
          <a href={`mailto:${value}`} className="text-blue-600 underline">
            {value}
          </a>
        ),
        isActive: (value) => (
          <span className={value ? "text-green-600" : "text-red-600"}>
            {value ? "Active" : "Inactive"}
          </span>
        ),
      }}
    />
  );
}
```

### Advanced Table with All Features

```tsx
import { JsonTable } from "@blocktion/json-to-table";

const data = [
  {
    id: 1,
    name: "John Doe",
    profile: {
      email: "john@example.com",
      settings: { theme: "dark", notifications: true },
    },
    hobbies: ["reading", "swimming"],
    isActive: true,
    lastLogin: "2024-01-15T10:30:00Z",
  },
];

function App() {
  return (
    <JsonTable
      data={data}
      title="Advanced Users Table"
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
      onCellClick={(value, column, row) => console.log("Cell clicked:", value)}
      customRenderers={{
        email: (value) => (
          <a href={`mailto:${value}`} className="text-blue-600 underline">
            {value}
          </a>
        ),
        isActive: (value) => (
          <span className={value ? "text-green-600" : "text-red-600"}>
            {value ? "Active" : "Inactive"}
          </span>
        ),
      }}
    />
  );
}
```

## 📚 API Reference

### JsonTable Props

| Prop              | Type                                                                | Default        | Description                              |
| ----------------- | ------------------------------------------------------------------- | -------------- | ---------------------------------------- |
| `data`            | `unknown[]`                                                         | -              | Array of objects to display in the table |
| `title`           | `string`                                                            | `"Data Table"` | Title displayed above the table          |
| `className`       | `string`                                                            | `""`           | Additional CSS classes                   |
| `options`         | `TableOptions`                                                      | `{}`           | Table configuration options              |
| `theme`           | `'default' \| 'minimal' \| 'dark'`                                  | `'default'`    | Theme for the table                      |
| `onRowClick`      | `(row: unknown, index: number) => void`                             | -              | Callback when a row is clicked           |
| `onCellClick`     | `(value: unknown, column: Column, row: unknown) => void`            | -              | Callback when a cell is clicked          |
| `customRenderers` | `Record<string, (value: unknown, row: unknown) => React.ReactNode>` | `{}`           | Custom cell renderers                    |

### TableOptions

| Option                 | Type      | Default | Description                                 |
| ---------------------- | --------- | ------- | ------------------------------------------- |
| `maxDepth`             | `number`  | `2`     | Maximum depth for nested object exploration |
| `enableSorting`        | `boolean` | `true`  | Enable column sorting                       |
| `enableFiltering`      | `boolean` | `false` | Enable data filtering                       |
| `enablePagination`     | `boolean` | `false` | Enable pagination                           |
| `enableNavigation`     | `boolean` | `true`  | Enable sub-table navigation                 |
| `mergeRepeatedColumns` | `boolean` | `false` | Merge repeated columns into arrays          |
| `pageSize`             | `number`  | `50`    | Number of rows per page                     |
| `showRowNumbers`       | `boolean` | `false` | Show row numbers                            |
| `showColumnCount`      | `boolean` | `true`  | Show column count                           |
| `showRowCount`         | `boolean` | `true`  | Show row count                              |

## 🎨 Styling

The component uses Tailwind CSS classes. Make sure Tailwind CSS is available in your project for proper styling.

### Custom Themes

```tsx
<JsonTable
  data={data}
  theme="dark" // or "minimal"
  className="custom-table"
/>
```

### Custom Cell Renderers

```tsx
<JsonTable
  data={data}
  customRenderers={{
    status: (value) => (
      <span
        className={`badge ${value === "active" ? "badge-success" : "badge-error"}`}
      >
        {value}
      </span>
    ),
    avatar: (value) => (
      <img src={value} alt="Avatar" className="w-8 h-8 rounded-full" />
    ),
  }}
/>
```

## 🔧 Advanced Usage

### Array Merging

When `mergeRepeatedColumns` is enabled, the table will automatically merge repeated column values into arrays:

```tsx
const data = [
  { id: 1, name: "John", tags: ["developer"] },
  { id: 2, name: "Jane", tags: ["designer"] },
  { id: 3, name: "Bob", tags: ["manager"] },
  { id: 4, name: "Alice", tags: ["developer", "designer"] },
];

<JsonTable data={data} options={{ mergeRepeatedColumns: true }} />;
```

### Type Detection

The table automatically detects data types and provides appropriate sorting and filtering:

- **Strings**: Text-based sorting and filtering
- **Numbers**: Numeric sorting and comparison
- **Booleans**: Boolean sorting
- **Dates**: Date-based sorting and filtering
- **Objects**: Navigation to sub-tables
- **Arrays**: Navigation to sub-tables

### Filtering

```tsx
<JsonTable
  data={data}
  options={{ enableFiltering: true }}
  // Filtering is handled internally, but you can access filter state
  onFilterChange={(filters) => console.log("Filters changed:", filters)}
/>
```

## 🚀 Performance

The component is optimized for performance with:

- **Memoized Operations**: Expensive operations are memoized to prevent unnecessary recalculations
- **Efficient Rendering**: Only re-renders when necessary
- **Virtual Scrolling**: For very large datasets (coming soon)
- **Lazy Loading**: Nested data is loaded on demand

## 🏢 About Blocktion

This package is part of the **Blocktion platform** - an intelligent workflow automation platform that enables you to create, manage, and execute complex workflows through a powerful combination of visual design and advanced orchestration.

### Blocktion Platform

[Blocktion](https://blocktion.io) is a sophisticated, enterprise-grade workflow automation platform that transforms complex automation challenges into simple, visual workflows. This JSON-to-table component was originally developed for Blocktion's data exploration and visualization features and is now available to the open-source community.

Read the [root folder README](../../README.md) to learn more about Blocktion's full capabilities, including:

- Visual workflow designer with drag-and-drop interface
- Advanced block system with rich integrations (Gmail, Twitter, AI/ML services)
- Intelligent execution engine with path optimization
- Real-time monitoring and enterprise security features

## 🤝 Contributing

We welcome contributions from the community! Please feel free to:

- Submit bug reports and feature requests
- Fork the repository and submit pull requests
- Improve documentation
- Add tests and examples

### Development Setup

```bash
git clone https://github.com/blocktion/json-to-table.git
cd json-to-table
npm install
npm run dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Related

- [Blocktion Platform](https://blocktion.io) - The main workflow automation platform
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, questions, or business inquiries:

- Email: info@blocktion.io
- GitHub Issues: [Create an issue](https://github.com/blocktion/json-to-table/issues)
- Website: [blocktion.io](https://blocktion.io)
