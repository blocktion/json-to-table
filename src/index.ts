// Main component
export { JsonTable } from "./components/JsonTable";

// Theme system
export { ThemeProvider, useTheme } from "./styles/theme-provider";
export { themes, defaultTheme, darkTheme, minimalTheme } from "./styles/theme";
export type { ThemeConfig, Theme } from "./styles/theme";

// Sub-components
export { NavigableCell } from "./components/Cells/NavigableCell";
export { CellRenderer } from "./components/Cells/CellRenderer";
export { NavigationControls } from "./components/Navigation/NavigationControls";
export { TableContainer } from "./components/Table/TableContainer";
export { TableHeader } from "./components/Table/TableHeader";
export { TableBody } from "./components/Table/TableBody";

// Styled components
export {
  TableContainer as StyledTableContainer,
  TableWrapper,
  Table,
  TableHeader as StyledTableHeader,
  TableHeaderCell,
  TableBody as StyledTableBody,
  TableRow,
  TableCell,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "./styles/styled-components";

// Hooks
export { useTableData } from "./hooks/useTableData";
export { useColumnGeneration } from "./hooks/useColumnGeneration";
export { useNavigation } from "./hooks/useNavigation";
export { useSorting } from "./hooks/useSorting";
export { useFiltering } from "./hooks/useFiltering";
export { usePagination } from "./hooks/usePagination";

// Core modules
export { DataProcessor } from "./core/DataProcessor";
export { ColumnGenerator } from "./core/ColumnGenerator";
export { NavigationManager } from "./core/NavigationManager";
export { TypeAnalyzer } from "./core/TypeAnalyzer";

// Utilities
export { ArrayAnalyzer } from "./utils/arrayUtils";
export { ObjectUtils } from "./utils/objectUtils";

// Types
export * from "./types";
