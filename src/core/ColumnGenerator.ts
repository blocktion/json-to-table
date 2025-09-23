import {
  Column,
  ColumnType,
  ArrayContentType,
  ColumnGenerationOptions,
} from "./types";
import { ArrayAnalyzer } from "../utils/arrayUtils";
import { ObjectUtils } from "../utils/objectUtils";
import { TypeAnalyzer } from "./TypeAnalyzer";
import { tryParseJSON } from "../utils/parseUtils";

export class ColumnGenerator {
  static generateForArrayOfObjects(
    array: unknown[],
    options: ColumnGenerationOptions = {}
  ): Column[] {
    const analysis = ArrayAnalyzer.analyzeContent(array);

    if (analysis.type !== "objects") {
      throw new Error("Array is not an array of objects");
    }

    const sampleObjects = analysis.sampleObjects || [];
    const allKeys = ArrayAnalyzer.extractAllKeys(sampleObjects);

    return allKeys.map((key) => this.createColumn(key, array, options));
  }

  static generateForMixedArray(
    array: unknown[],
    options: ColumnGenerationOptions = {}
  ): Column[] {
    // Check if this is already processed mixed array data
    if (array.length > 0 && typeof array[0] === "object" && array[0] !== null) {
      const firstItem = array[0] as Record<string, unknown>;
      if ("index" in firstItem && "value" in firstItem) {
        // This is already processed mixed array data - use same format as primitive arrays
        return [
          this.createColumn("index", array, options),
          this.createColumn("value", array, options),
        ];
      }
    }

    // Create mixed array format - same as primitive arrays but with navigation metadata
    const mixedArrayData = ArrayAnalyzer.createMixedArrayData(array);
    return [
      this.createColumn("index", mixedArrayData, options),
      this.createColumn("value", mixedArrayData, options),
    ];
  }

  static generateForPrimitiveArray(
    array: unknown[],
    options: ColumnGenerationOptions = {}
  ): Column[] {
    // Check if this is already processed array table data
    if (array.length > 0 && typeof array[0] === "object" && array[0] !== null) {
      const firstItem = array[0] as Record<string, unknown>;
      if ("index" in firstItem && "value" in firstItem) {
        // This is already processed array table data
        return [
          this.createColumn("index", array, options),
          this.createColumn("value", array, options),
        ];
      }
    }

    // Create array table format
    const arrayTableData = ArrayAnalyzer.createArrayTableData(array);
    return [
      this.createColumn("index", arrayTableData, options),
      this.createColumn("value", arrayTableData, options),
    ];
  }

  static generateColumns(
    data: unknown[],
    options: ColumnGenerationOptions = {}
  ): Column[] {
    const { maxDepth = 2, mergeRepeatedColumns = false } = options;

    if (!data || data.length === 0) return [];

    const keys = ObjectUtils.getAllKeys(data, "", maxDepth);
    const columns: Column[] = [];

    keys.forEach((key) => {
      const isArray = key.includes("##ARRAY##");
      const isObject = key.includes("##OBJECT##");
      const cleanKey = key.replace("##ARRAY##", "").replace("##OBJECT##", "");
      const displayName = ObjectUtils.formatDisplayName(cleanKey);

      const values = data.map((row) =>
        ObjectUtils.getNestedValue(row, cleanKey)
      );
      const columnType = TypeAnalyzer.analyze(values);

      const column: Column = {
        key,
        cleanKey,
        displayName,
        columnType,
        sortable: !isArray && !isObject && columnType.type !== "null",
        filterable: !isArray && !isObject,
        width: ObjectUtils.calculateWidth(values, options),
        renderer: options.customRenderers?.[cleanKey],
      };

      columns.push(column);
    });

    return mergeRepeatedColumns ? this.mergeRepeatedColumns(columns) : columns;
  }

  private static createColumn(
    key: string,
    data: unknown[],
    options: ColumnGenerationOptions
  ): Column {
    const values = data.map((item) => {
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        const raw = (item as Record<string, unknown>)[key];
        // Ensure we analyze parsed arrays/objects even if they arrive as strings
        return tryParseJSON(raw);
      }
      return null;
    });

    const typeAnalysis = TypeAnalyzer.analyze(values);

    return {
      key,
      cleanKey: key,
      displayName: ObjectUtils.formatDisplayName(key),
      columnType: typeAnalysis,
      sortable: this.isSortable(typeAnalysis),
      filterable: this.isFilterable(typeAnalysis),
      width: ObjectUtils.calculateWidth(values, options),
      renderer: options.customRenderers?.[key],
    };
  }

  private static createSingleValueColumn(
    array: unknown[],
    options: ColumnGenerationOptions
  ): Column {
    const analysis = ArrayAnalyzer.analyzeContent(array);
    const isNavigable = analysis.type === "objects";

    const columnType: ColumnType = {
      type: analysis.type === "objects" ? "array" : "string",
      isNullable: array.some((v) => v === null || v === undefined),
      isRequired: !array.some((v) => v === null || v === undefined),
      sampleValues: array.slice(0, 5),
      isArray: analysis.type === "objects",
      isObject: false,
      isNavigable,
      arrayContentType: analysis.type as ArrayContentType,
    };

    return {
      key: "value",
      cleanKey: "value",
      displayName: "Value",
      columnType,
      sortable: !isNavigable,
      filterable: !isNavigable,
      width: ObjectUtils.calculateWidth(array, options),
    };
  }

  private static isSortable(columnType: ColumnType): boolean {
    return (
      !columnType.isArray && !columnType.isObject && columnType.type !== "null"
    );
  }

  private static isFilterable(columnType: ColumnType): boolean {
    return !columnType.isArray && !columnType.isObject;
  }

  private static mergeRepeatedColumns(columns: Column[]): Column[] {
    const columnMap = new Map<string, Column>();

    columns.forEach((column) => {
      const existingColumn = columnMap.get(column.cleanKey);

      if (existingColumn) {
        const mergedType: ColumnType = {
          ...existingColumn.columnType,
          isNullable:
            existingColumn.columnType.isNullable ||
            column.columnType.isNullable,
          isRequired:
            existingColumn.columnType.isRequired &&
            column.columnType.isRequired,
          sampleValues: [
            ...existingColumn.columnType.sampleValues,
            ...column.columnType.sampleValues,
          ].slice(0, 10),
          isArray:
            existingColumn.columnType.isArray || column.columnType.isArray,
          isObject:
            existingColumn.columnType.isObject || column.columnType.isObject,
          isNavigable:
            existingColumn.columnType.isNavigable ||
            column.columnType.isNavigable,
        };

        existingColumn.columnType = mergedType;
        existingColumn.sortable = existingColumn.sortable && column.sortable;
        existingColumn.filterable =
          existingColumn.filterable && column.filterable;
      } else {
        columnMap.set(column.cleanKey, { ...column });
      }
    });

    return Array.from(columnMap.values());
  }

  static sortColumns(
    columns: Column[],
    order: "alphabetical" | "original" | string[] = "alphabetical"
  ): Column[] {
    if (order === "original") return columns;

    if (Array.isArray(order)) {
      const orderedColumns: Column[] = [];
      const remainingColumns = [...columns];

      order.forEach((key) => {
        const index = remainingColumns.findIndex((col) => col.cleanKey === key);
        if (index !== -1) {
          orderedColumns.push(remainingColumns.splice(index, 1)[0]);
        }
      });

      orderedColumns.push(...remainingColumns);
      return orderedColumns;
    }

    return [...columns].sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
  }
}
