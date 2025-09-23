# Modular Usage Examples

This document demonstrates how to use the modular features of `@parallaxsolutions/json-to-table`.

## Basic Import

```tsx
import { JsonTable } from "@parallaxsolutions/json-to-table";
```

## Modular Imports

### Individual Components

```tsx
import {
  TableContainer,
  TableHeader,
  TableBody,
  NavigableCell,
} from "@parallaxsolutions/json-to-table/components";
```

### Hooks

```tsx
import {
  useTableData,
  useSorting,
  usePagination,
  useNavigation,
} from "@parallaxsolutions/json-to-table/hooks";
```

### Themes

```tsx
import {
  defaultTheme,
  darkTheme,
  minimalTheme,
  ThemeProvider,
} from "@parallaxsolutions/json-to-table/themes";
```

### Utilities

```tsx
import {
  ArrayAnalyzer,
  ObjectUtils,
} from "@parallaxsolutions/json-to-table/utils";
```

## Custom Theme Example

```tsx
import {
  ThemeProvider,
  defaultTheme,
} from "@parallaxsolutions/json-to-table/themes";
import { JsonTable } from "@parallaxsolutions/json-to-table";

const customTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: "#6366f1",
    secondary: "#8b5cf6",
  },
};

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <JsonTable data={data} title="Custom Themed Table" />
    </ThemeProvider>
  );
}
```

## Custom Component Example

```tsx
import {
  TableContainer,
  TableHeader,
  TableBody,
} from "@parallaxsolutions/json-to-table/components";
import {
  useTableData,
  useSorting,
} from "@parallaxsolutions/json-to-table/hooks";

function CustomTable({ data }) {
  const { processedData } = useTableData(data);
  const { sortedData, handleSort } = useSorting(processedData.validated);

  return (
    <TableContainer>
      <TableHeader onSort={handleSort} />
      <TableBody data={sortedData} />
    </TableContainer>
  );
}
```
