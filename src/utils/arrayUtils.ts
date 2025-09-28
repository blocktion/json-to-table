export interface ArrayContentAnalysis {
  type: "objects" | "mixed" | "primitives" | "empty" | "nulls";
  objectCount?: number;
  primitiveCount?: number;
  sampleObjects?: Record<string, unknown>[];
}

export class ArrayAnalyzer {
  static analyzeContent(array: unknown[]): ArrayContentAnalysis {
    if (!Array.isArray(array) || array.length === 0) {
      return { type: "empty" };
    }

    const nonNullItems = array.filter(
      (item) => item !== null && item !== undefined
    );
    if (nonNullItems.length === 0) {
      return { type: "nulls" };
    }

    const objectCount = nonNullItems.filter(
      (item) =>
        typeof item === "object" && !Array.isArray(item) && item !== null
    ).length;

    const primitiveCount = nonNullItems.filter(
      (item) => typeof item !== "object" || Array.isArray(item)
    ).length;

    // 100% confidence - precise categorization
    if (objectCount === nonNullItems.length) {
      // All items are objects
      return {
        type: "objects",
        objectCount,
        primitiveCount,
        sampleObjects: this.extractSampleObjects(nonNullItems),
      };
    } else if (objectCount === 0) {
      // All items are primitives
      return {
        type: "primitives",
        objectCount,
        primitiveCount,
      };
    } else {
      // Mixed array - contains both objects and primitives
      return {
        type: "mixed",
        objectCount,
        primitiveCount,
        sampleObjects: this.extractSampleObjects(nonNullItems),
      };
    }
  }

  private static extractSampleObjects(
    items: unknown[]
  ): Record<string, unknown>[] {
    return items
      .filter((item) => typeof item === "object" && !Array.isArray(item))
      .slice(0, 5) as Record<string, unknown>[];
  }

  static extractAllKeys(objects: Record<string, unknown>[]): string[] {
    const keySet = new Set<string>();

    objects.forEach((obj) => {
      if (obj && typeof obj === "object") {
        Object.keys(obj).forEach((key) => keySet.add(key));
      }
    });

    return Array.from(keySet);
  }

  static isArrayOfObjects(array: unknown[]): boolean {
    const analysis = this.analyzeContent(array);
    return analysis.type === "objects";
  }

  static getArrayDisplayText(array: unknown[]): string {
    const analysis = this.analyzeContent(array);

    switch (analysis.type) {
      case "objects":
        return `${array.length} objects`;
      case "mixed":
        return `${array.length} items`;
      case "primitives":
        return `${array.length} items`;
      case "empty":
        return "empty";
      case "nulls":
        return `${array.length} nulls`;
      default:
        return `${array.length} items`;
    }
  }

  /**
   * Creates specialized data for array table view (arrays of primitives)
   */
  static createArrayTableData(array: unknown[]): unknown[] {
    return array.map((item, index) => ({
      index: index + 1,
      value: item,
    }));
  }

  /**
   * Creates specialized data for mixed array view
   */
  static createMixedArrayData(array: unknown[]): unknown[] {
    return array.map((item, index) => {
      const itemType = this.getItemType(item);
      const isNavigable = this.isItemNavigable(item);

      // For objects, preserve the original object structure instead of wrapping in array
      if (
        itemType === "object" &&
        item &&
        typeof item === "object" &&
        !Array.isArray(item)
      ) {
        return {
          index: index + 1,
          ...(item as Record<string, unknown>),
          // Store navigation info as metadata (not displayed columns)
          _navigationInfo: {
            type: itemType,
            isNavigable,
            nestedAnalysis: null,
          },
        };
      }

      return {
        index: index + 1,
        value: item,
        // Store navigation info as metadata (not displayed columns)
        _navigationInfo: {
          type: itemType,
          isNavigable,
          nestedAnalysis:
            itemType === "array"
              ? this.analyzeContent(item as unknown[])
              : null,
        },
      };
    });
  }

  /**
   * Determines the type of an individual array item
   */
  private static getItemType(item: unknown): string {
    if (item === null || item === undefined) return "null";
    if (Array.isArray(item)) return "array";
    if (typeof item === "object") return "object";
    return typeof item;
  }

  /**
   * Checks if an array item should be navigable
   */
  static isItemNavigable(item: unknown): boolean {
    if (item === null || item === undefined) return false;
    if (Array.isArray(item)) return item.length > 0;
    if (typeof item === "object") return true;
    return false;
  }

  /**
   * Gets navigation title for different array types
   */
  static getNavigationTitle(array: unknown[], arrayType: string): string {
    switch (arrayType) {
      case "objects":
        return `Objects (${array.length} items)`;
      case "primitives":
        return `Array (${array.length} items)`;
      case "mixed":
        return `Mixed Array (${array.length} items)`;
      case "empty":
        return "Empty Array";
      case "nulls":
        return `Null Array (${array.length} items)`;
      default:
        return `Array (${array.length} items)`;
    }
  }

  /**
   * Handles recursive navigation for nested mixed arrays
   * This method processes nested arrays and objects within mixed arrays
   */
  static processNestedMixedArray(item: unknown): unknown {
    if (!item || typeof item !== "object") {
      return item;
    }

    if (Array.isArray(item)) {
      const analysis = this.analyzeContent(item);
      switch (analysis.type) {
        case "objects":
          return item; // Keep as-is for object table generation
        case "primitives":
          return this.createArrayTableData(item);
        case "mixed":
          return this.createMixedArrayData(item);
        default:
          return item;
      }
    }

    // For objects, convert to array format for table display
    return [item];
  }

  /**
   * Recursively processes mixed array items to handle nested structures
   */
  static processRecursiveMixedArray(array: unknown[]): unknown[] {
    return array.map((item) => {
      if (Array.isArray(item)) {
        return this.processNestedMixedArray(item);
      } else if (typeof item === "object" && item !== null) {
        return [item]; // Convert single object to array for table display
      }
      return item;
    });
  }
}
