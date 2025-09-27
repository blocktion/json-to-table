import React from "react";
import { Column, TableOptions, ProcessedData, EditState } from "../../types";
import { useSorting } from "../../hooks/useSorting";
import { useFiltering } from "../../hooks/useFiltering";
import { usePagination } from "../../hooks/usePagination";
import { useTheme } from "../../styles/theme-provider";
import {
  TableContainer as StyledTableContainer,
  TableWrapper,
  Table as StyledTable,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../../styles/styled-components";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { QuickAddRowButton } from "../Editing/AddRowButton";

interface TableContainerProps {
  data: ProcessedData;
  columns: Column[];
  options: TableOptions;
  onRowClick?: (row: unknown, index: number) => void;
  onCellClick?: (value: unknown, column: Column, row: unknown) => void;
  onNavigateToSubTable: (path: string, value: unknown, title: string) => void;
  customRenderers?: Record<
    string,
    (value: unknown, row: unknown) => React.ReactNode
  >;
  // Editing props
  editState?: EditState;
  setEditState?: React.Dispatch<React.SetStateAction<EditState>>;
  onDeleteRow?: (rowIndex: number) => void;
  onAddRow?: (rowData: unknown, insertIndex?: number) => void;
  onUpdateField?: (rowIndex: number, field: string, value: unknown) => void;
  onDeleteField?: (rowIndex: number, field: string) => void;
  onAddField?: (rowIndex: number, field: string, value: unknown) => void;
  validateField?: (
    field: string,
    value: unknown,
    row: unknown
  ) => { isValid: boolean; error: string | null };
}

export const TableContainer: React.FC<TableContainerProps> = ({
  data,
  columns,
  options,
  onRowClick,
  onCellClick,
  onNavigateToSubTable,
  customRenderers = {},
  // Editing props
  editState,
  setEditState,
  onDeleteRow,
  onAddRow,
  onUpdateField,
  onDeleteField,
  onAddField,
  validateField,
}) => {
  const { theme } = useTheme();

  const {
    enableSorting = true,
    enableFiltering = false,
    enablePagination = false,
    enableNavigation = true,
    pageSize = 50,
    showRowNumbers = false,
  } = options;

  const tableData = data.validated as unknown[];

  const { sortConfig, handleSort, sortedData } = useSorting(
    tableData,
    columns,
    enableSorting
  );

  const {
    filters,
    handleAddFilter,
    handleRemoveFilter,
    handleUpdateFilter,
    filteredData,
  } = useFiltering(sortedData, columns, enableFiltering);

  const { currentPage, totalPages, handlePageChange, paginatedData } =
    usePagination(filteredData, pageSize, enablePagination);

  const displayData = enablePagination ? paginatedData : filteredData;

  const PaginationControls = () => {
    if (!enablePagination || totalPages <= 1) return null;

    return (
      <div
        className="mt-4 flex justify-center items-center space-x-2"
        style={{
          marginTop: theme.spacing.lg,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: theme.spacing.sm,
        }}
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            fontSize: theme.typography.fontSize.sm,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            backgroundColor: "transparent",
            color: theme.colors.text.primary,
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor =
                theme.colors.interactive.hover;
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          Previous
        </button>

        <span
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.muted,
          }}
        >
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            fontSize: theme.typography.fontSize.sm,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            backgroundColor: "transparent",
            color: theme.colors.text.primary,
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor =
                theme.colors.interactive.hover;
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <StyledTableContainer>
      {/* Add Row Button */}
      {options.enableEditing && onAddRow && (
        <div className="mb-4 flex justify-end">
          <QuickAddRowButton onAddRow={onAddRow} className="" />
        </div>
      )}

      {/* Table */}
      <TableWrapper>
        <StyledTable
          style={{
            tableLayout: showRowNumbers ? "fixed" : "auto",
            width: showRowNumbers ? "100%" : "auto",
          }}
        >
          <TableHeader
            columns={columns}
            sortConfig={sortConfig}
            onSort={handleSort}
            enableSorting={enableSorting}
            showRowNumbers={showRowNumbers}
          />
          <TableBody
            data={displayData}
            columns={columns}
            onRowClick={onRowClick}
            onCellClick={onCellClick}
            onNavigateToSubTable={onNavigateToSubTable}
            enableNavigation={enableNavigation}
            showRowNumbers={showRowNumbers}
            customRenderers={customRenderers}
            // Editing props
            editState={editState}
            setEditState={setEditState}
            onDeleteRow={onDeleteRow}
            onAddRow={onAddRow}
            onUpdateField={onUpdateField}
            onDeleteField={onDeleteField}
            onAddField={onAddField}
            validateField={validateField}
            options={options}
          />
        </StyledTable>
      </TableWrapper>

      <PaginationControls />
    </StyledTableContainer>
  );
};
