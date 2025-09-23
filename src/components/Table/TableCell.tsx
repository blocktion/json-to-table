import React from "react";
import { Column } from "../../types";
import { ObjectUtils } from "../../utils/objectUtils";
import { ArrayAnalyzer } from "../../utils/arrayUtils";
import { NavigableCell } from "../NavigableCell";

interface TableCellProps {
  column: Column;
  row: unknown;
  onNavigateToSubTable: (path: string, value: unknown, title: string) => void;
  onCellClick?: (value: unknown, column: Column, row: unknown) => void;
  enableNavigation: boolean;
  showRowNumbers: boolean;
  customRenderers?: Record<
    string,
    (value: unknown, row: unknown) => React.ReactNode
  >;
}

export const TableCell: React.FC<TableCellProps> = ({
  column,
  row,
  onNavigateToSubTable,
  onCellClick,
  enableNavigation,
  showRowNumbers,
  customRenderers = {},
}) => {
  const value = ObjectUtils.getNestedValue(row, column.cleanKey);

  const handleCellClick = () => {
    onCellClick?.(value, column, row);
  };

  const handleNavigate = () => {
    const valueIsArray = Array.isArray(value);
    const valueIsObject =
      !!value && typeof value === "object" && !Array.isArray(value);

    // Check if this is navigable based on type or navigation metadata
    let isNavigable = valueIsArray || valueIsObject;

    // For root table columns, don't rely on column.isNavigable since it's based on primary type
    // Instead, analyze each individual value
    if (!isNavigable && column.columnType.isNavigable) {
      // This is a root table column that was marked as navigable due to mixed types
      // Check if THIS specific value is navigable
      isNavigable = valueIsArray || valueIsObject;
    }

    // Special check for mixed array items
    if (
      !isNavigable &&
      column.cleanKey === "value" &&
      row &&
      typeof row === "object"
    ) {
      const rowObj = row as Record<string, unknown>;
      if ("_navigationInfo" in rowObj) {
        const navInfo = rowObj._navigationInfo as { isNavigable: boolean };
        isNavigable = navInfo.isNavigable;
      }
    }

    if (!enableNavigation || !isNavigable) return;

    let title: string;

    if (valueIsArray || column.columnType.isArray) {
      const arrayContentType =
        column.columnType.arrayContentType ||
        (Array.isArray(value)
          ? ArrayAnalyzer.analyzeContent(value).type
          : "primitives");

      title = ArrayAnalyzer.getNavigationTitle(
        value as unknown[],
        arrayContentType
      );
    } else if (valueIsObject || column.columnType.isObject) {
      title = `${column.displayName} (Object)`;
    } else {
      title = `${column.displayName} (Value)`;
    }

    onNavigateToSubTable(column.cleanKey, value, title);
  };

  const formatValue = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === "string") {
      return val.length > 50 ? val.substring(0, 47) + "..." : val;
    }
    if (typeof val === "object" && val !== null) {
      return JSON.stringify(val);
    }
    return String(val);
  };

  // Custom renderer
  if (column.renderer) {
    return (
      <td
        className="px-6 py-4 whitespace-nowrap text-body-sm text-obsidian align-top"
        style={{
          width: showRowNumbers ? "auto" : column.width || "auto",
        }}
        onClick={handleCellClick}
      >
        {column.renderer(value, row)}
      </td>
    );
  }

  // Custom renderer from props
  if (customRenderers[column.cleanKey]) {
    return (
      <td
        className="px-6 py-4 whitespace-nowrap text-body-sm text-obsidian align-top"
        style={{
          width: showRowNumbers ? "auto" : column.width || "auto",
        }}
        onClick={handleCellClick}
      >
        {customRenderers[column.cleanKey](value, row)}
      </td>
    );
  }

  // Navigable cell (runtime check as well, so arrays/objects parsed at runtime are navigable)
  const valueIsArray = Array.isArray(value);
  const valueIsObject =
    !!value && typeof value === "object" && !Array.isArray(value);
  // Check if this is navigable based on type or navigation metadata
  let isNavigableNow = enableNavigation && (valueIsArray || valueIsObject);

  // For root table columns, don't rely on column.isNavigable since it's based on primary type
  // Instead, analyze each individual value
  if (!isNavigableNow && column.columnType.isNavigable) {
    // This is a root table column that was marked as navigable due to mixed types
    // Check if THIS specific value is navigable
    isNavigableNow = enableNavigation && (valueIsArray || valueIsObject);
  }

  // Special check for mixed array items
  if (
    !isNavigableNow &&
    column.cleanKey === "value" &&
    row &&
    typeof row === "object"
  ) {
    const rowObj = row as Record<string, unknown>;
    if ("_navigationInfo" in rowObj) {
      const navInfo = rowObj._navigationInfo as { isNavigable: boolean };
      isNavigableNow = enableNavigation && navInfo.isNavigable;
    }
  }

  if (isNavigableNow && value) {
    let displayText: string;
    let type: "array" | "object";

    if (valueIsArray || column.columnType.isArray) {
      const arrayContentType =
        column.columnType.arrayContentType ||
        (Array.isArray(value)
          ? ArrayAnalyzer.analyzeContent(value).type
          : "primitives");

      // Show count-based text for all arrays
      displayText = ArrayAnalyzer.getArrayDisplayText(value as unknown[]);
      type = "array";
    } else if (valueIsObject || column.columnType.isObject) {
      displayText = "Object";
      type = "object";
    } else {
      // Special handling for mixed array items
      if (column.cleanKey === "value" && row && typeof row === "object") {
        const rowObj = row as Record<string, unknown>;
        if ("_navigationInfo" in rowObj) {
          // This is a mixed array item with navigation metadata
          const navInfo = rowObj._navigationInfo as {
            type: string;
            isNavigable: boolean;
            nestedAnalysis?: any;
          };

          if (navInfo.isNavigable) {
            if (navInfo.type === "array") {
              // Show count-based text for all arrays
              displayText = ArrayAnalyzer.getArrayDisplayText(
                value as unknown[]
              );
              type = "array";
            } else if (navInfo.type === "object") {
              displayText = "Object";
              type = "object";
            } else {
              displayText = formatValue(value);
              type = "object";
            }
          } else {
            // Not navigable - show the value directly
            displayText = formatValue(value);
            type = "object";
          }
        } else {
          displayText = formatValue(value);
          type = "object";
        }
      } else {
        displayText = formatValue(value);
        type = "object";
      }
    }

    return (
      <td
        className="px-6 py-4 whitespace-nowrap text-body-sm text-obsidian align-top"
        style={{
          width: showRowNumbers ? "auto" : column.width || "auto",
        }}
        onClick={handleCellClick}
      >
        <NavigableCell
          value={value}
          displayText={displayText}
          onNavigate={handleNavigate}
          type={type}
        />
      </td>
    );
  }

  // Regular cell
  return (
    <td
      className="px-6 py-4 whitespace-nowrap text-body-sm text-obsidian align-top"
      style={{ width: column.width }}
      onClick={handleCellClick}
    >
      <span
        className={
          value === null || value === undefined
            ? "text-jet-grey"
            : "text-obsidian"
        }
      >
        {formatValue(value)}
      </span>
    </td>
  );
};
