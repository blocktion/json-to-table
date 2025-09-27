import { Column } from "../core/types";
import { EditableColumn } from "../types/editing";

export const enhanceColumnsForEditing = (
  columns: Column[],
  enableEditing: boolean = false
): EditableColumn[] => {
  if (!enableEditing) {
    return columns.map((col) => ({ ...col, editable: false }));
  }

  return columns.map((column): EditableColumn => {
    // Determine editor type based on column type
    let editorType: EditableColumn["editorType"] = "text";

    switch (column.columnType.type) {
      case "number":
        editorType = "number";
        break;
      case "boolean":
        editorType = "boolean";
        break;
      case "date":
        editorType = "date";
        break;
      case "string":
        editorType = "text";
        break;
      default:
        editorType = "text";
    }

    return {
      ...column,
      editable: true,
      deletable: true,
      editorType,
      validationRules: [],
    };
  });
};
