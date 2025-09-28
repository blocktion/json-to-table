import { TableOptions, Column } from "../core/types";

export interface EditableTableOptions extends TableOptions {
  // Editing capabilities
  enableEditing?: boolean;
  enableRowDeletion?: boolean;
  enableFieldEditing?: boolean;
  enableFieldDeletion?: boolean;
  enableInlineEditing?: boolean;
  enableBulkOperations?: boolean;

  // Edit mode configuration
  editMode?: "inline" | "modal" | "sidebar";

  // Validation
  validationRules?: ValidationRule[];

  // Event handlers
  onDataChange?: (newData: unknown[], changes: DataChange[]) => void;
  onRowAdd?: (rowIndex: number, row: unknown) => void;
  onRowDelete?: (rowIndex: number, row: unknown) => void;
  onFieldUpdate?: (
    rowIndex: number,
    field: string,
    newValue: unknown,
    oldValue: unknown,
    navigationPath?: string[],
    rootDocumentIndex?: number
  ) => void;
  onFieldDelete?: (rowIndex: number, field: string, value: unknown) => void;
  onBulkDelete?: (rowIndices: number[]) => void;
}

export interface DataChange {
  id: string;
  type:
    | "row_delete"
    | "row_add"
    | "field_update"
    | "field_delete"
    | "field_add";
  rowIndex: number;
  field?: string;
  oldValue?: unknown;
  newValue?: unknown;
  timestamp: Date;
  isValid: boolean;
  validationErrors?: string[];
}

export interface ValidationRule {
  field: string;
  validator: (value: unknown, row: unknown) => boolean | string;
  message?: string;
  required?: boolean;
}

export interface EditState {
  isEditing: boolean;
  editingRow: number | null;
  editingField: string | null;
  pendingChanges: DataChange[];
  validationErrors: Record<string, string>;
  selectedRows: Set<number>;
  isBulkMode: boolean;
}

export interface EditableColumn extends Column {
  editable?: boolean;
  deletable?: boolean;
  validationRules?: ValidationRule[];
  editorType?: "text" | "number" | "boolean" | "date" | "select" | "custom";
  editorProps?: Record<string, unknown>;
}

export interface TableState {
  data: unknown[];
  originalData: unknown[];
  changes: DataChange[];
  editState: EditState;
  selectedRows: Set<number>;
  validationErrors: Record<string, string>;
}
