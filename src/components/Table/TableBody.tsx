import React from "react";
import { Column } from "../../types";
import { ObjectUtils } from "../../utils/objectUtils";
import { useTheme } from "../../styles/theme-provider";
import {
  TableBody as StyledTableBody,
  TableRow,
  TableCell as StyledTableCell,
} from "../../styles/styled-components";
import { CellRenderer } from "../Cells/CellRenderer";

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
}) => {
  const { theme } = useTheme();

  return (
    <StyledTableBody>
      {data.map((row, index) => (
        <TableRow
          key={index}
          hoverable={!!onRowClick}
          onClick={() => onRowClick?.(row, index)}
        >
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
      ))}
    </StyledTableBody>
  );
};
