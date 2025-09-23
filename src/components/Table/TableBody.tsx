import React from "react";
import { Column, EditState, TableOptions } from "../../types";
import { ObjectUtils } from "../../utils/objectUtils";
import { useTheme } from "../../styles/theme-provider";
import {
  TableBody as StyledTableBody,
  TableRow,
  TableCell as StyledTableCell,
} from "../../styles/styled-components";
import { CellRenderer } from "../Cells/CellRenderer";
import { RowActions } from "../Editing/RowActions";
import { EditableCell } from "../Editing/EditableCell";

interface TableBodyProps {
  data: unknown[];
  columns: Column[];
  onRowClick?: (row: unknown, index: number) => void;
  onCellClick?: (value: unknown, column: Column, row: unknown) => void;
  onNavigateToSubTable: (path: string, value: unknown, title: string) => void;
  enableNavigation: boolean;
  showRowNumbers: boolean;
  customRenderers?: Record<
    string,
    (value: unknown, row: unknown) => React.ReactNode
  >;
  // Editing props
  editState?: EditState;
  setEditState?: React.Dispatch<React.SetStateAction<EditState>>;
  onDeleteRow?: (rowIndex: number) => void;
  onUpdateField?: (rowIndex: number, field: string, value: unknown) => void;
  onDeleteField?: (rowIndex: number, field: string) => void;
  onAddField?: (rowIndex: number, field: string, value: unknown) => void;
  validateField?: (
    field: string,
    value: unknown,
    row: unknown
  ) => { isValid: boolean; error: string | null };
  options?: TableOptions;
}

export const TableBody: React.FC<TableBodyProps> = ({
  data,
  columns,
  onRowClick,
  onCellClick,
  onNavigateToSubTable,
  enableNavigation,
  showRowNumbers,
  customRenderers = {},
  // Editing props
  editState,
  setEditState,
  onDeleteRow,
  onUpdateField,
  onDeleteField,
  onAddField,
  validateField,
  options,
}) => {
  const { theme } = useTheme();

  const isEditingEnabled = options?.enableEditing || false;
  const isRowDeletionEnabled = options?.enableRowDeletion || false;
  const isFieldEditingEnabled = options?.enableFieldEditing || false;
  const isInlineEditingEnabled = options?.enableInlineEditing || false;

  const handleRowSelect = (rowIndex: number, selected: boolean) => {
    if (!setEditState) return;

    setEditState((prev) => {
      const newSelectedRows = new Set(prev.selectedRows);
      if (selected) {
        newSelectedRows.add(rowIndex);
      } else {
        newSelectedRows.delete(rowIndex);
      }
      return { ...prev, selectedRows: newSelectedRows };
    });
  };

  const handleStartEdit = (rowIndex: number, field: string) => {
    if (!setEditState) return;

    setEditState((prev) => ({
      ...prev,
      isEditing: true,
      editingRow: rowIndex,
      editingField: field,
    }));
  };

  const handleSaveEdit = (rowIndex: number, field: string, value: unknown) => {
    if (!onUpdateField) return;

    onUpdateField(rowIndex, field, value);

    if (setEditState) {
      setEditState((prev) => ({
        ...prev,
        isEditing: false,
        editingRow: null,
        editingField: null,
      }));
    }
  };

  const handleCancelEdit = () => {
    if (!setEditState) return;

    setEditState((prev) => ({
      ...prev,
      isEditing: false,
      editingRow: null,
      editingField: null,
    }));
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (!onDeleteRow) return;
    onDeleteRow(rowIndex);
  };

  return (
    <StyledTableBody>
      {data.map((row, index) => {
        const isRowSelected = editState?.selectedRows.has(index) || false;
        const isRowEditing =
          editState?.isEditing && editState.editingRow === index;
        const isFieldEditing = isRowEditing && editState?.editingField;

        return (
          <TableRow
            key={index}
            hoverable={!!onRowClick}
            onClick={() => onRowClick?.(row, index)}
            style={{
              backgroundColor: isRowSelected ? "#e3f2fd" : undefined,
            }}
          >
            {/* Row Actions Column */}
            {isEditingEnabled && (
              <StyledTableCell
                style={{
                  width: "120px",
                  minWidth: "120px",
                  textAlign: "center",
                  padding: "8px",
                }}
              >
                <RowActions
                  rowIndex={index}
                  row={row}
                  isSelected={isRowSelected}
                  isEditing={isRowEditing || false}
                  onEdit={() => handleStartEdit(index, "")}
                  onDelete={() => handleDeleteRow(index)}
                  onSelect={(selected) => handleRowSelect(index, selected)}
                  enableEditing={isFieldEditingEnabled || false}
                  enableDeletion={isRowDeletionEnabled || false}
                />
              </StyledTableCell>
            )}

            {showRowNumbers && (
              <StyledTableCell
                style={{
                  width: "50px",
                  minWidth: "50px",
                  maxWidth: "50px",
                  textAlign: "center",
                  color: theme.colors.text.muted,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  boxSizing: "border-box",
                }}
              >
                {index + 1}
              </StyledTableCell>
            )}
            {columns.map((column) => {
              const value = ObjectUtils.getNestedValue(row, column.cleanKey);
              const isFieldBeingEdited =
                isFieldEditing && editState?.editingField === column.cleanKey;
              const validationError = validateField
                ? validateField(column.cleanKey, value, row).error
                : null;

              if (isInlineEditingEnabled && isFieldBeingEdited) {
                return (
                  <EditableCell
                    key={column.key}
                    value={value}
                    column={column as any}
                    rowIndex={index}
                    isEditing={true}
                    onStartEdit={() => handleStartEdit(index, column.cleanKey)}
                    onSaveEdit={(newValue) =>
                      handleSaveEdit(index, column.cleanKey, newValue)
                    }
                    onCancelEdit={handleCancelEdit}
                    validationError={validationError || undefined}
                  />
                );
              }

              return (
                <CellRenderer
                  key={column.key}
                  column={column}
                  row={row}
                  value={value}
                  onNavigateToSubTable={onNavigateToSubTable}
                  onCellClick={onCellClick}
                  enableNavigation={enableNavigation}
                  customRenderers={customRenderers}
                />
              );
            })}
          </TableRow>
        );
      })}
    </StyledTableBody>
  );
};
