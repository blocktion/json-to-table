// Re-export utilities from the new modular structure
export { ArrayAnalyzer } from "./utils/arrayUtils";
export { ObjectUtils } from "./utils/objectUtils";
export { TypeAnalyzer } from "./core/TypeAnalyzer";
export { DataProcessor } from "./core/DataProcessor";
export { ColumnGenerator } from "./core/ColumnGenerator";
export { NavigationManager } from "./core/NavigationManager";

// Re-export specific functions for backward compatibility
import { ObjectUtils } from "./utils/objectUtils";
import { ArrayAnalyzer } from "./utils/arrayUtils";

export const {
  getNestedValue,
  setNestedValue,
  getAllKeys,
  formatDisplayName,
  calculateWidth,
} = ObjectUtils;

export const {
  analyzeContent: analyzeArrayContent,
  extractAllKeys,
  isArrayOfObjects,
  getArrayDisplayText,
} = ArrayAnalyzer;
