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

// Editing components
export { EditableCell } from "./components/Editing/EditableCell";
export { RowActions } from "./components/Editing/RowActions";
export { BulkActions } from "./components/Editing/BulkActions";

// Validation components
export {
  ValidationProvider,
  useValidationContext,
} from "./components/Validation/ValidationProvider";
export { ValidationMessage } from "./components/Validation/ValidationMessage";

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

// Editing hooks
export { useDataMutation } from "./hooks/useDataMutation";
export { useValidation } from "./hooks/useValidation";

// Core modules
export { DataProcessor } from "./core/DataProcessor";
export { ColumnGenerator } from "./core/ColumnGenerator";
export { NavigationManager } from "./core/NavigationManager";
export { TypeAnalyzer } from "./core/TypeAnalyzer";

// Utilities
export { ArrayAnalyzer } from "./utils/arrayUtils";
export { ObjectUtils } from "./utils/objectUtils";

// Field editors
export {
  TextEditor,
  NumberEditor,
  BooleanEditor,
  DateEditor,
  SelectEditor,
  createFieldEditor,
} from "./utils/fieldEditors";

// Types
export * from "./types";
