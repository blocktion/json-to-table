import { tryParseJSON } from "./parseUtils";

export class ObjectUtils {
  static getNestedValue(obj: unknown, path: string): unknown {
    if (!path) return obj;

    const result = path.split(".").reduce((current: unknown, key: string) => {
      if (
        current &&
        typeof current === "object" &&
        current !== null &&
        key in current
      ) {
        return (current as Record<string, unknown>)[key];
      }
      return null;
    }, obj);

    // Parse JSON-like strings so arrays/objects serialized as strings become navigable
    return tryParseJSON(result);
  }

  static setNestedValue(obj: unknown, path: string, value: unknown): void {
    if (!path) return;

    const keys = path.split(".");
    const lastKey = keys.pop()!;

    let current = obj as Record<string, unknown>;

    for (const key of keys) {
      if (
        !(key in current) ||
        typeof current[key] !== "object" ||
        current[key] === null
      ) {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }

    current[lastKey] = value;
  }

  static getAllKeys(
    data: unknown[],
    prefix = "",
    maxDepth = 2,
    currentDepth = 0
  ): Set<string> {
    const keys = new Set<string>();

    if (currentDepth >= maxDepth || !Array.isArray(data)) return keys;

    data.forEach((item) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        Object.keys(item).forEach((key) => {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          const value = (item as Record<string, unknown>)[key];

          if (value && typeof value === "object" && !Array.isArray(value)) {
            keys.add(`${fullKey}##OBJECT##`);
            const nestedKeys = this.getAllKeys(
              [value],
              fullKey,
              maxDepth,
              currentDepth + 1
            );
            nestedKeys.forEach((nestedKey) => keys.add(nestedKey));
          } else if (Array.isArray(value)) {
            keys.add(`${fullKey}##ARRAY##`);
          } else {
            keys.add(fullKey);
          }
        });
      }
    });

    return keys;
  }

  static formatDisplayName(key: string): string {
    return key.split(".").pop() || key;
  }

  static calculateWidth(
    values: unknown[],
    options: { minWidth?: number; maxWidth?: number } = {}
  ): string {
    const { minWidth = 10, maxWidth = 25 } = options;

    const avgLength =
      values.reduce((sum: number, value) => {
        const str = String(value || "");
        return sum + str.length;
      }, 0) / values.length;

    let width: number;
    if (avgLength < 10) {
      width = 10;
    } else if (avgLength < 20) {
      width = 15;
    } else if (avgLength < 50) {
      width = 20;
    } else {
      width = 25;
    }

    return `${Math.max(minWidth, Math.min(maxWidth, width))}%`;
  }

  /**
   * Merges repeated attributes within objects into arrays
   * If an object has the same attribute repeated, those values are merged into an array
   */
  static mergeRepeatedAttributes(obj: unknown): unknown {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
      return obj;
    }

    const result: Record<string, unknown> = {};
    const attributeCounts: Record<string, number> = {};

    // First pass: count occurrences of each attribute
    Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
      attributeCounts[key] = (attributeCounts[key] || 0) + 1;
    });

    // Second pass: merge repeated attributes
    Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
      if (attributeCounts[key] > 1) {
        if (!result[key]) {
          result[key] = [];
        }
        if (Array.isArray(result[key])) {
          (result[key] as unknown[]).push(value);
        }
      } else {
        result[key] = value;
      }
    });

    return result;
  }

  /**
   * Processes an array of objects to merge repeated attributes
   */
  static processArrayForRepeatedAttributes(data: unknown[]): unknown[] {
    return data.map((item) => this.mergeRepeatedAttributes(item));
  }
}
