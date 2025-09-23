import JSON5 from "json5";

export const looksLikeJSON = (value: unknown): boolean => {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return (
    trimmed.length > 1 &&
    ((trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}")))
  );
};

export const tryParseJSON = (value: unknown): unknown => {
  if (!looksLikeJSON(value)) return value;
  try {
    return JSON.parse(value as string);
  } catch {
    try {
      return JSON5.parse(value as string);
    } catch {
      return value;
    }
  }
};
