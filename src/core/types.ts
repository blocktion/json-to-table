export type DataType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "object"
  | "array"
  | "null"
  | "undefined";

export type ArrayContentType =
  | "objects" // Array of objects - extract columns from object properties
  | "mixed" // Mixed array - single column table with mixed content
  | "primitives" // Array of primitives - single column table
  | "empty" // Empty array
  | "nulls"; // Array of null/undefined values

export interface ColumnType {
  type: DataType;
  isNullable: boolean;
  isRequired: boolean;
  sampleValues: unknown[];
  isArray: boolean;
  isObject: boolean;
  isNavigable: boolean;
  arrayContentType?: ArrayContentType; // For arrays, indicates the content type
}

export interface Column {
  key: string;
  cleanKey: string;
  displayName: string;
  columnType: ColumnType;
  sortable: boolean;
  filterable: boolean;
  width?: string;
  renderer?: (value: unknown, row: unknown) => React.ReactNode;
}

export interface SortConfig {
  key: string | null;
  direction: "asc" | "desc";
}

export interface FilterConfig {
  key: string;
  value: string;
  operator:
    | "contains"
    | "equals"
    | "startsWith"
    | "endsWith"
    | "gt"
    | "lt"
    | "gte"
    | "lte";
}

export interface NavigationStackItem {
  path: string;
  title: string;
  data: unknown[];
  parentTitle: string;
  breadcrumbPath: string[];
}

export interface TableOptions {
  maxDepth?: number;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableNavigation?: boolean;
  mergeRepeatedColumns?: boolean;
  pageSize?: number;
  showRowNumbers?: boolean;
  showColumnCount?: boolean;
  showRowCount?: boolean;
  // Editing options
  enableEditing?: boolean;
  enableRowDeletion?: boolean;
  enableFieldEditing?: boolean;
  enableFieldDeletion?: boolean;
  enableInlineEditing?: boolean;
  enableBulkOperations?: boolean;
  editMode?: "inline" | "modal" | "sidebar";
  validationRules?: Array<{
    field: string;
    validator: (value: unknown, row: unknown) => boolean | string;
    message?: string;
    required?: boolean;
  }>;
}

export interface JsonTableProps {
  data: unknown[];
  title?: string;
  className?: string;
  options?: TableOptions;
  theme?: "default" | "minimal" | "dark";
  onRowClick?: (row: unknown, index: number) => void;
  onCellClick?: (value: unknown, column: Column, row: unknown) => void;
  customRenderers?: Record<
    string,
    (value: unknown, row: unknown) => React.ReactNode
  >;
}

// Core module types
export interface ProcessedData {
  raw: unknown[];
  parsed: unknown[];
  validated: unknown[];
  analyzed: StructureAnalysis;
  metadata: DataMetadata;
}

export interface StructureAnalysis {
  isArray: boolean;
  isObject: boolean;
  arrayContentType?: "objects" | "mixed" | "primitives" | "empty" | "nulls";
  objectKeys?: string[];
  depth: number;
  sampleData: unknown[];
}

export interface DataMetadata {
  totalRows: number;
  totalColumns: number;
  hasNestedData: boolean;
  maxDepth: number;
  warnings: string[];
  errors: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface NavigationResult {
  success: boolean;
  newData?: unknown[];
  newTitle?: string;
  breadcrumb?: string[];
  error?: string;
}

export interface NavigationAnalysis {
  type: "array" | "object" | "primitive";
  processedData: unknown[];
  displayTitle: string;
  analysis?: any;
}

export interface NavigationListener {
  onNavigationChange: (result: NavigationResult) => void;
}

export interface ColumnGenerationOptions {
  maxDepth?: number;
  mergeRepeatedColumns?: boolean;
  customRenderers?: Record<
    string,
    (value: unknown, row: unknown) => React.ReactNode
  >;
  minWidth?: number;
  maxWidth?: number;
}

export interface ArrayContentAnalysis {
  type: "objects" | "mixed" | "primitives" | "empty" | "nulls";
  objectCount?: number;
  primitiveCount?: number;
  sampleObjects?: Record<string, unknown>[];
}
