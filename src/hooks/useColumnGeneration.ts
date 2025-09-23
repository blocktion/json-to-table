import { useState, useEffect, useMemo } from "react";
import { Column, ColumnGenerationOptions } from "../types";
import { ColumnGenerator } from "../core/ColumnGenerator";
import { ProcessedData } from "../core/DataProcessor";
import { ArrayAnalyzer } from "../utils/arrayUtils";

export const useColumnGeneration = (
  data: ProcessedData | null,
  options: ColumnGenerationOptions = {}
) => {
  const [columns, setColumns] = useState<Column[]>([]);

  // Stabilize options
  const optionsSignature = useMemo(
    () => JSON.stringify(options ?? {}),
    [options]
  );

  useEffect(() => {
    if (
      !data ||
      !data.validated ||
      (data.validated as unknown[]).length === 0
    ) {
      setColumns([]);
      return;
    }

    try {
      let generatedColumns: Column[];

      const validated = data.validated as unknown[];

      // Check if this is navigation data (already processed array/object data)
      // vs root table data (array of objects)
      if (
        validated.length > 0 &&
        typeof validated[0] === "object" &&
        validated[0] !== null
      ) {
        const firstItem = validated[0] as Record<string, unknown>;

        // Check if this is already processed navigation data
        if ("index" in firstItem && "value" in firstItem) {
          // This is processed array data (primitive or mixed array)
          const analysis = ArrayAnalyzer.analyzeContent(
            validated.map((item) => (item as Record<string, unknown>).value)
          );

          if (analysis.type === "objects") {
            // This shouldn't happen for processed data, but handle it
            generatedColumns = ColumnGenerator.generateForArrayOfObjects(
              validated.map((item) => (item as Record<string, unknown>).value),
              options
            );
          } else if (analysis.type === "primitives") {
            generatedColumns = ColumnGenerator.generateForPrimitiveArray(
              validated,
              options
            );
          } else {
            generatedColumns = ColumnGenerator.generateForMixedArray(
              validated,
              options
            );
          }
        } else {
          // This is root table data (array of objects)
          generatedColumns = ColumnGenerator.generateColumns(
            validated,
            options
          );
        }
      } else {
        // Fallback: treat as array of objects if possible
        generatedColumns = ColumnGenerator.generateColumns(validated, options);
      }

      // Sort columns
      const sortedColumns = ColumnGenerator.sortColumns(
        generatedColumns,
        "alphabetical"
      );
      setColumns(sortedColumns);
    } catch (error) {
      console.error("Error generating columns:", error);
      setColumns([]);
    }
  }, [data, optionsSignature]);

  return columns;
};
