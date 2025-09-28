import React from "react";
import { Column } from "../../types";
import { NavigableCell } from "./NavigableCell";
import { useTheme } from "../../styles/theme-provider";
import { TableCell } from "../../styles/styled-components";

interface CellRendererProps {
  column: Column;
  row: unknown;
  value: unknown;
  onNavigateToSubTable: (
    path: string,
    value: unknown,
    title: string,
    rowIndex?: number
  ) => void;
  onCellClick?: (value: unknown, column: Column, row: unknown) => void;
  onCellDoubleClick?: (value: unknown, column: Column, row: unknown) => void;
  enableNavigation: boolean;
  customRenderers?: Record<
    string,
    (value: unknown, row: unknown) => React.ReactNode
  >;
  rowIndex?: number;
}

export const CellRenderer: React.FC<CellRendererProps> = ({
  column,
  row,
  value,
  onNavigateToSubTable,
  onCellClick,
  onCellDoubleClick,
  enableNavigation,
  customRenderers = {},
  rowIndex,
}) => {
  const { theme } = useTheme();

  const handleCellClick = () => {
    onCellClick?.(value, column, row);
  };

  const handleCellDoubleClick = () => {
    onCellDoubleClick?.(value, column, row);
  };

  const handleNavigate = () => {
    const valueIsArray = Array.isArray(value);
    const valueIsObject =
      !!value && typeof value === "object" && !Array.isArray(value);

    let isNavigable = valueIsArray || valueIsObject;

    if (!isNavigable && column.columnType.isNavigable) {
      isNavigable = valueIsArray || valueIsObject;
    }

    if (!enableNavigation || !isNavigable) return;

    let title: string;
    if (valueIsArray || column.columnType.isArray) {
      title = `${column.displayName} (Array)`;
    } else if (valueIsObject || column.columnType.isObject) {
      title = `${column.displayName} (Object)`;
    } else {
      title = `${column.displayName} (Value)`;
    }

    onNavigateToSubTable(column.cleanKey, value, title, rowIndex);
  };

  const formatValue = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === "string") {
      return val.length > 30 ? val.substring(0, 27) + "..." : val;
    }
    if (typeof val === "object" && val !== null) {
      const jsonStr = JSON.stringify(val);
      return jsonStr.length > 30 ? jsonStr.substring(0, 27) + "..." : jsonStr;
    }
    return String(val);
  };

  // Custom renderer from column definition
  if (column.renderer) {
    return (
      <TableCell
        onClick={handleCellClick}
        onDoubleClick={handleCellDoubleClick}
      >
        {column.renderer(value, row)}
      </TableCell>
    );
  }

  // Custom renderer from props
  if (customRenderers[column.cleanKey]) {
    return (
      <TableCell
        onClick={handleCellClick}
        onDoubleClick={handleCellDoubleClick}
      >
        {customRenderers[column.cleanKey](value, row)}
      </TableCell>
    );
  }

  // Navigable cell
  const valueIsArray = Array.isArray(value);
  const valueIsObject =
    !!value && typeof value === "object" && !Array.isArray(value);
  let isNavigableNow = enableNavigation && (valueIsArray || valueIsObject);

  if (!isNavigableNow && column.columnType.isNavigable) {
    isNavigableNow = enableNavigation && (valueIsArray || valueIsObject);
  }

  if (isNavigableNow && value) {
    let displayText: string;
    let type: "array" | "object";

    if (valueIsArray || column.columnType.isArray) {
      displayText = `${(value as unknown[]).length} items`;
      type = "array";
    } else if (valueIsObject || column.columnType.isObject) {
      // Show object key count for better context
      const obj = value as Record<string, unknown>;
      const keyCount = Object.keys(obj).length;
      displayText = keyCount === 1 ? "1 property" : `${keyCount} properties`;
      type = "object";
    } else {
      displayText = formatValue(value);
      type = "object";
    }

    return (
      <TableCell
        onClick={handleCellClick}
        onDoubleClick={handleCellDoubleClick}
      >
        <NavigableCell
          value={value}
          displayText={displayText}
          onNavigate={handleNavigate}
          type={type}
        />
      </TableCell>
    );
  }

  // Regular cell
  return (
    <TableCell onClick={handleCellClick} onDoubleClick={handleCellDoubleClick}>
      <span
        style={{
          color:
            value === null || value === undefined
              ? theme.colors.text.muted
              : theme.colors.text.primary,
        }}
      >
        {formatValue(value)}
      </span>
    </TableCell>
  );
};
