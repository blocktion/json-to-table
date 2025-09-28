import {
  NavigationStackItem,
  ArrayContentType,
  NavigationResult,
  NavigationAnalysis,
  NavigationListener,
} from "./types";
import { ArrayAnalyzer } from "../utils/arrayUtils";

export class NavigationManager {
  private stack: NavigationStackItem[] = [];
  private listeners: Set<NavigationListener> = new Set();

  navigateToSubTable(
    path: string,
    value: unknown,
    title: string,
    rootDocumentIndex?: number
  ): NavigationResult {
    try {
      const analysis = this.analyzeNavigationTarget(value);
      const newItem = this.createNavigationItem(
        path,
        value,
        title,
        analysis,
        rootDocumentIndex
      );

      this.stack.push(newItem);
      this.notifyListeners();

      return {
        success: true,
        newData: analysis.processedData,
        newTitle: analysis.displayTitle,
        breadcrumb: this.generateBreadcrumb(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown navigation error",
      };
    }
  }

  navigateBack(targetLevel: number): NavigationResult {
    if (targetLevel < 0 || targetLevel >= this.stack.length) {
      return {
        success: false,
        error: "Invalid navigation target level",
      };
    }

    this.stack = this.stack.slice(0, targetLevel);
    this.notifyListeners();

    const currentItem = this.stack[this.stack.length - 1];
    return {
      success: true,
      newData: currentItem?.data || [],
      newTitle: currentItem?.title || "Root",
      breadcrumb: this.generateBreadcrumb(),
    };
  }

  navigateToRoot(rootData: unknown[]): NavigationResult {
    this.stack = [];
    this.notifyListeners();

    return {
      success: true,
      newData: rootData,
      newTitle: "Root Table",
      breadcrumb: ["Root"],
    };
  }

  getCurrentStack(): NavigationStackItem[] {
    return [...this.stack];
  }

  getBreadcrumb(): string[] {
    return this.generateBreadcrumb();
  }

  canNavigate(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return true;

    // Check if it's a JSON string that can be parsed
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return (
          (typeof parsed === "object" && parsed !== null) ||
          Array.isArray(parsed)
        );
      } catch {
        return false;
      }
    }

    return false;
  }

  addListener(listener: NavigationListener): void {
    this.listeners.add(listener);
  }

  removeListener(listener: NavigationListener): void {
    this.listeners.delete(listener);
  }

  private analyzeNavigationTarget(value: unknown): NavigationAnalysis {
    // Handle JSON strings by parsing them first
    let parsedValue = value;
    if (typeof value === "string") {
      try {
        parsedValue = JSON.parse(value);
      } catch {
        // If it's not valid JSON, treat as primitive
        return {
          type: "primitive",
          processedData: [value],
          displayTitle: "Value",
          analysis: null,
        };
      }
    }

    if (Array.isArray(parsedValue)) {
      const analysis = ArrayAnalyzer.analyzeContent(parsedValue);
      let processedData: unknown[];
      let displayTitle: string;

      switch (analysis.type) {
        case "objects":
          // Arrays of objects - use the array as-is for column detection
          processedData = parsedValue;
          displayTitle = ArrayAnalyzer.getNavigationTitle(
            parsedValue,
            "objects"
          );
          break;
        case "primitives":
          // Arrays of primitives - create array table format
          processedData = ArrayAnalyzer.createArrayTableData(parsedValue);
          displayTitle = ArrayAnalyzer.getNavigationTitle(
            parsedValue,
            "primitives"
          );
          break;
        case "mixed":
          // Mixed arrays - create specialized mixed array format with recursive processing
          processedData = ArrayAnalyzer.createMixedArrayData(parsedValue);
          displayTitle = ArrayAnalyzer.getNavigationTitle(parsedValue, "mixed");
          break;
        case "empty":
          processedData = [];
          displayTitle = ArrayAnalyzer.getNavigationTitle(parsedValue, "empty");
          break;
        case "nulls":
          processedData = ArrayAnalyzer.createArrayTableData(parsedValue);
          displayTitle = ArrayAnalyzer.getNavigationTitle(parsedValue, "nulls");
          break;
        default:
          processedData = parsedValue;
          displayTitle = ArrayAnalyzer.getArrayDisplayText(parsedValue);
      }

      return {
        type: "array",
        processedData,
        displayTitle,
        analysis,
      };
    } else if (typeof parsedValue === "object" && parsedValue !== null) {
      return {
        type: "object",
        processedData: [parsedValue],
        displayTitle: "Object",
        analysis: null,
      };
    } else {
      return {
        type: "primitive",
        processedData: [value], // Use original value for display
        displayTitle: "Value",
        analysis: null,
      };
    }
  }

  private createNavigationItem(
    path: string,
    value: unknown,
    title: string,
    analysis: NavigationAnalysis,
    rootDocumentIndex?: number
  ): NavigationStackItem {
    const parentTitle =
      this.stack.length > 0 ? this.stack[this.stack.length - 1].title : "Root";

    const breadcrumbPath =
      this.stack.length > 0
        ? this.stack[this.stack.length - 1].breadcrumbPath
        : [];

    // Use the original field name (path) instead of the display title for breadcrumb
    // This ensures the update path uses the correct field names
    const breadcrumbItem = path || analysis.displayTitle;

    return {
      path,
      title: analysis.displayTitle,
      data: analysis.processedData,
      parentTitle,
      breadcrumbPath: [...breadcrumbPath, breadcrumbItem],
      rootDocumentIndex,
    };
  }

  private generateBreadcrumb(): string[] {
    if (this.stack.length === 0) return ["Root"];
    return ["Root", ...this.stack[this.stack.length - 1].breadcrumbPath];
  }

  private notifyListeners(): void {
    const result: NavigationResult = {
      success: true,
      newData:
        this.stack.length > 0 ? this.stack[this.stack.length - 1].data : [],
      newTitle:
        this.stack.length > 0
          ? this.stack[this.stack.length - 1].title
          : "Root",
      breadcrumb: this.generateBreadcrumb(),
    };

    this.listeners.forEach((listener) => {
      listener.onNavigationChange(result);
    });
  }
}
