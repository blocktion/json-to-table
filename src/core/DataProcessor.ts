import { ArrayAnalyzer } from "../utils/arrayUtils";
import { ObjectUtils } from "../utils/objectUtils";
import { TypeAnalyzer } from "./TypeAnalyzer";

export interface ProcessedData {
  raw: unknown[];
  parsed: unknown[];
  validated: unknown[];
  analyzed: StructureAnalysis;
  metadata: DataMetadata;
}

export interface StructureAnalysis {
  isArray: boolean;
  isObject: boolean;
  arrayContentType?: "objects" | "mixed" | "primitives" | "empty" | "nulls";
  objectKeys?: string[];
  depth: number;
  sampleData: unknown[];
}

export interface DataMetadata {
  totalRows: number;
  totalColumns: number;
  hasNestedData: boolean;
  maxDepth: number;
  warnings: string[];
  errors: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class DataProcessor {
  private static instance: DataProcessor;

  static getInstance(): DataProcessor {
    if (!DataProcessor.instance) {
      DataProcessor.instance = new DataProcessor();
    }
    return DataProcessor.instance;
  }

  processData(data: unknown[]): ProcessedData {
    const parsed = this.parseJsonStrings(data);
    const processedForRepeatedAttributes =
      ObjectUtils.processArrayForRepeatedAttributes(parsed);
    const validation = this.validateData(processedForRepeatedAttributes);
    const analyzed = this.analyzeStructure(processedForRepeatedAttributes);
    const metadata = this.generateMetadata(analyzed, validation);

    return {
      raw: data,
      parsed,
      validated: validation.isValid ? processedForRepeatedAttributes : [],
      analyzed,
      metadata,
    };
  }

  private parseJsonStrings(data: unknown[]): unknown[] {
    return data.map((item) => this.tryParseJSON(item));
  }

  private tryParseJSON(value: unknown): unknown {
    if (typeof value !== "string") return value;

    const trimmed = value.trim();

    if (
      trimmed.length > 2 &&
      ((trimmed.startsWith("[") && trimmed.endsWith("]")) ||
        (trimmed.startsWith("{") && trimmed.endsWith("}")))
    ) {
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    }

    return value;
  }

  private validateData(data: unknown[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!Array.isArray(data)) {
      errors.push("Data must be an array");
      return { isValid: false, errors, warnings };
    }

    if (data.length === 0) {
      warnings.push("Data array is empty");
    }

    data.forEach((item, index) => {
      if (item === null || item === undefined) {
        warnings.push(`Row ${index} is null or undefined`);
      } else if (typeof item !== "object") {
        warnings.push(`Row ${index} is not an object (type: ${typeof item})`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private analyzeStructure(data: unknown[]): StructureAnalysis {
    if (data.length === 0) {
      return {
        isArray: false,
        isObject: false,
        arrayContentType: "empty",
        depth: 0,
        sampleData: [],
      };
    }

    const sampleData = data.slice(0, 5);
    const firstItem = sampleData[0];

    // Check if the data itself is an array of arrays
    if (Array.isArray(firstItem)) {
      const arrayAnalysis = ArrayAnalyzer.analyzeContent(
        firstItem as unknown[]
      );
      return {
        isArray: true,
        isObject: false,
        arrayContentType: arrayAnalysis.type as any,
        depth: 1,
        sampleData: firstItem as unknown[],
      };
    }

    // Check if the data is an array of objects (most common case)
    if (typeof firstItem === "object" && firstItem !== null) {
      const objectKeys = Object.keys(firstItem as Record<string, unknown>);

      // Check if any property contains arrays
      let hasNestedArrays = false;
      let maxDepth = 1;

      for (const item of sampleData) {
        if (typeof item === "object" && item !== null) {
          const obj = item as Record<string, unknown>;
          for (const [key, value] of Object.entries(obj)) {
            if (Array.isArray(value)) {
              hasNestedArrays = true;
              const arrayAnalysis = ArrayAnalyzer.analyzeContent(
                value as unknown[]
              );
              if (arrayAnalysis.type === "objects") {
                maxDepth = Math.max(maxDepth, 2);
              }
            }
          }
        }
      }

      return {
        isArray: false,
        isObject: true,
        objectKeys,
        depth: hasNestedArrays ? maxDepth : 1,
        sampleData: [firstItem],
      };
    }

    return {
      isArray: false,
      isObject: false,
      depth: 0,
      sampleData: [firstItem],
    };
  }

  private generateMetadata(
    analysis: StructureAnalysis,
    validation: ValidationResult
  ): DataMetadata {
    return {
      totalRows: analysis.sampleData.length,
      totalColumns: analysis.objectKeys?.length || 0,
      hasNestedData: analysis.depth > 1,
      maxDepth: analysis.depth,
      warnings: validation.warnings,
      errors: validation.errors,
    };
  }
}
