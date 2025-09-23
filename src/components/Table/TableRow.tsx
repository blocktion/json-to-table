import React from "react";
import { Column } from "../../types";
import { TableCell } from "./TableCell";

interface TableRowProps {
  row: unknown;
  rowIndex: number;
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

export const TableRow: React.FC<TableRowProps> = ({
  row,
  rowIndex,
  columns,
  onRowClick,
  onCellClick,
  onNavigateToSubTable,
  enableNavigation,
  showRowNumbers,
  customRenderers = {},
}) => {
  const handleRowClick = () => {
    onRowClick?.(row, rowIndex);
  };

  return (
    <tr
      className="border-b border-lace-cap hover:bg-ma-white transition-colors duration-150"
      onClick={handleRowClick}
      style={{ cursor: onRowClick ? "pointer" : "default" }}
    >
      {showRowNumbers && (
        <td
          className="px-2 py-4 whitespace-nowrap text-body-sm text-jet-grey align-top text-center row-number-column"
          style={{
            width: "50px",
            minWidth: "50px",
            maxWidth: "50px",
            boxSizing: "border-box",
          }}
        >
          {rowIndex + 1}
        </td>
      )}
      {columns.map((column) => (
        <TableCell
          key={column.key}
          column={column}
          row={row}
          onNavigateToSubTable={onNavigateToSubTable}
          onCellClick={onCellClick}
          enableNavigation={enableNavigation}
          showRowNumbers={showRowNumbers}
          customRenderers={customRenderers}
        />
      ))}
    </tr>
  );
};
