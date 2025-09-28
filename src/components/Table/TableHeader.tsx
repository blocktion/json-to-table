import React from "react";
import {
  FiChevronUp,
  FiChevronDown,
  FiChevronsDown,
  FiExternalLink,
} from "react-icons/fi";
import { Column, SortConfig } from "../../types";
import { useTheme } from "../../styles/theme-provider";
import {
  TableHeader as StyledTableHeader,
  TableHeaderCell as StyledTableHeaderCell,
} from "../../styles/styled-components";

interface TableHeaderProps {
  columns: Column[];
  sortConfig: SortConfig;
  onSort: (columnKey: string) => void;
  enableSorting: boolean;
  showRowNumbers: boolean;
  enableEditing?: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  sortConfig,
  onSort,
  enableSorting,
  showRowNumbers,
  enableEditing = false,
}) => {
  const { theme } = useTheme();

  const handleSort = (column: Column) => {
    if (!enableSorting || !column.sortable) return;
    onSort(column.key);
  };

  const getSortIcon = (column: Column) => {
    if (!enableSorting || !column.sortable) return null;

    const iconStyle = {
      width: "16px",
      height: "16px",
    };

    if (sortConfig.key === column.key) {
      return sortConfig.direction === "asc" ? (
        <FiChevronUp style={{ ...iconStyle, color: theme.colors.primary }} />
      ) : (
        <FiChevronDown style={{ ...iconStyle, color: theme.colors.primary }} />
      );
    }

    return (
      <FiChevronsDown
        style={{ ...iconStyle, color: theme.colors.text.muted }}
      />
    );
  };

  return (
    <StyledTableHeader>
      <tr>
        {/* Row Actions Column Header */}
        {enableEditing && (
          <StyledTableHeaderCell
            style={{
              width: "120px",
              minWidth: "120px",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            Actions
          </StyledTableHeaderCell>
        )}
        {showRowNumbers && (
          <StyledTableHeaderCell
            style={{
              width: "50px",
              minWidth: "50px",
              maxWidth: "50px",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            #
          </StyledTableHeaderCell>
        )}
        {columns.map((column) => (
          <StyledTableHeaderCell
            key={column.key}
            sortable={column.sortable && enableSorting}
            onClick={() => handleSort(column)}
            title={
              column.sortable && enableSorting
                ? "Click to sort"
                : column.columnType.isNavigable
                  ? "Click cells to navigate to sub-table"
                  : "Cannot sort this column"
            }
            style={{
              width: showRowNumbers ? "auto" : column.width || "auto",
            }}
          >
            <div
              className="flex items-center justify-between"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                className="flex items-center"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {column.displayName}
                {column.columnType.isNavigable && (
                  <FiExternalLink
                    style={{
                      width: "12px",
                      height: "12px",
                      marginLeft: theme.spacing.sm,
                      color: theme.colors.secondary,
                    }}
                  />
                )}
              </span>
              {column.sortable && enableSorting && (
                <div style={{ marginLeft: theme.spacing.sm }}>
                  {getSortIcon(column)}
                </div>
              )}
            </div>
          </StyledTableHeaderCell>
        ))}
      </tr>
    </StyledTableHeader>
  );
};
