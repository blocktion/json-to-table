# @parallaxsolutions/json-to-table

A powerful, modular React component for converting JSON data to navigable tables with advanced features like automatic column detection, theming, array merging, type detection, and sub-table navigation. This component is part of the **Blocktion SaaS project** ecosystem developed by [Parallax Solutions](https://parallaxsolutions.org).

> **Note**: This component is used in the Blocktion SaaS project (not yet released) and is now available as an open-source package for the React community.

## ✨ Features

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

## 📦 Installation

```bash
npm install @parallaxsolutions/json-to-table
```

## 🏗️ Modular Usage

This package is designed with modularity in mind. You can import only what you need:

```tsx
// Main component
import { JsonTable } from "@parallaxsolutions/json-to-table";

// Individual components
import {
  TableContainer,
  TableHeader,
  TableBody,
} from "@parallaxsolutions/json-to-table/components";

// Hooks
import {
  useTableData,
  useSorting,
  usePagination,
} from "@parallaxsolutions/json-to-table/hooks";

// Themes
import {
  defaultTheme,
  darkTheme,
  minimalTheme,
} from "@parallaxsolutions/json-to-table/themes";

// Utilities
import {
  ArrayAnalyzer,
  ObjectUtils,
} from "@parallaxsolutions/json-to-table/utils";
```

## 🚀 Quick Start

### Basic Table

```tsx
import { JsonTable } from "@parallaxsolutions/json-to-table";

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

### Advanced Table with All Features

```tsx
import { JsonTable } from "@parallaxsolutions/json-to-table";

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

## 🏢 About Parallax Solutions

This package is developed by [Parallax Solutions](https://parallaxsolutions.org), a company specializing in innovative SaaS solutions and developer tools. This component is part of our **Blocktion** project ecosystem - a comprehensive SaaS platform currently in development.

### Blocktion Project

Blocktion is our flagship SaaS platform that provides powerful data visualization and management tools. This JSON-to-table component was originally developed for Blocktion's data exploration features and is now available to the open-source community.

## 🤝 Contributing

We welcome contributions from the community! Please feel free to:

- Submit bug reports and feature requests
- Fork the repository and submit pull requests
- Improve documentation
- Add tests and examples

### Development Setup

```bash
git clone https://github.com/parallaxsolutions/json-to-table.git
cd json-to-table
npm install
npm run dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Related

- [Parallax Solutions](https://parallaxsolutions.org) - Our company website
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, questions, or business inquiries:

- Email: info@parallaxsolutions.org
- GitHub Issues: [Create an issue](https://github.com/parallaxsolutions/json-to-table/issues)
- Website: [parallaxsolutions.org](https://parallaxsolutions.org)
