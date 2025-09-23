import { DataType, ColumnType, ArrayContentType } from "./types";
import { ArrayAnalyzer } from "../utils/arrayUtils";

export class TypeAnalyzer {
  static analyze(values: unknown[]): ColumnType {
    const nonNullValues = values.filter((v) => v !== null && v !== undefined);
    const sampleValues = nonNullValues.slice(0, 5);

    if (nonNullValues.length === 0) {
      return {
        type: "null",
        isNullable: true,
        isRequired: false,
        sampleValues: [],
        isArray: false,
        isObject: false,
        isNavigable: false,
      };
    }

    // Only classify as array if all non-null values are arrays
    const allArrays =
      nonNullValues.length > 0 && nonNullValues.every(Array.isArray);
    const primaryType = allArrays
      ? "array"
      : this.detectPrimaryType(nonNullValues);
    const isArray = primaryType === "array";
    const isObject = primaryType === "object";
    const isNavigable = isArray || isObject;

    let arrayContentType: ArrayContentType | undefined;
    if (isArray) {
      const arrayValues = sampleValues.filter(Array.isArray);
      if (arrayValues.length > 0) {
        const analysis = ArrayAnalyzer.analyzeContent(
          arrayValues[0] as unknown[]
        );
        arrayContentType = analysis.type as ArrayContentType;
      } else {
        arrayContentType = "primitives";
      }
    }

    // Enhanced type detection for better navigation
    const enhancedType = this.enhanceTypeDetection(
      primaryType,
      values,
      arrayContentType
    );

    return {
      type: primaryType,
      isNullable: values.some((v) => v === null || v === undefined),
      isRequired: !values.some((v) => v === null || v === undefined),
      sampleValues,
      isArray,
      isObject,
      isNavigable,
      arrayContentType,
    };
  }

  private static detectPrimaryType(values: unknown[]): DataType {
    const types = values.map(this.detectDataType);
    const typeCounts = types.reduce(
      (acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<DataType, number>
    );

    return Object.entries(typeCounts).reduce((a, b) =>
      typeCounts[a[0] as DataType] > typeCounts[b[0] as DataType] ? a : b
    )[0] as DataType;
  }

  private static detectDataType(value: unknown): DataType {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (Array.isArray(value)) return "array";
    if (typeof value === "object") return "object";
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    if (typeof value === "string") {
      const date = new Date(value);
      if (!isNaN(date.getTime()) && date.toISOString() === value) {
        return "date";
      }
      return "string";
    }
    return "string";
  }

  /**
   * Enhanced type detection for better navigation and display
   */
  private static enhanceTypeDetection(
    primaryType: DataType,
    values: unknown[],
    arrayContentType?: ArrayContentType
  ): DataType {
    // For arrays, provide more specific type information
    if (primaryType === "array" && arrayContentType) {
      // The type remains "array" but we have enhanced content type information
      return primaryType;
    }

    // For objects, check if they contain navigable content
    if (primaryType === "object") {
      const hasNavigableContent = values.some((value) => {
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          const obj = value as Record<string, unknown>;
          return Object.values(obj).some(
            (prop) =>
              Array.isArray(prop) || (typeof prop === "object" && prop !== null)
          );
        }
        return false;
      });

      // Keep as object type but this information can be used for navigation decisions
      return primaryType;
    }

    return primaryType;
  }

  /**
   * Determines if a value should be navigable based on enhanced type analysis
   */
  static shouldBeNavigable(value: unknown, columnType: ColumnType): boolean {
    if (value === null || value === undefined) return false;

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "object") {
      return true;
    }

    // For mixed arrays, check if the value is part of a navigable structure
    if (columnType.arrayContentType === "mixed") {
      return ArrayAnalyzer.isItemNavigable(value);
    }

    return false;
  }
}
