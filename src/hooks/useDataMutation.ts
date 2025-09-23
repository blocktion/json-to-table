import { useState, useCallback, useMemo } from "react";
import { DataChange, EditState, EditableTableOptions } from "../types/editing";

export const useDataMutation = (
  initialData: unknown[],
  options: EditableTableOptions
) => {
  const [data, setData] = useState(initialData);
  const [originalData] = useState(initialData);
  const [changes, setChanges] = useState<DataChange[]>([]);
  const [editState, setEditState] = useState<EditState>({
    isEditing: false,
    editingRow: null,
    editingField: null,
    pendingChanges: [],
    validationErrors: {},
    selectedRows: new Set(),
    isBulkMode: false,
  });

  const deleteRow = useCallback(
    (rowIndex: number) => {
      const row = data[rowIndex];
      const change: DataChange = {
        id: `delete_${rowIndex}_${Date.now()}`,
        type: "row_delete",
        rowIndex,
        oldValue: row,
        timestamp: new Date(),
        isValid: true,
      };

      setData((prev) => prev.filter((_, index) => index !== rowIndex));
      setChanges((prev) => [...prev, change]);

      options.onRowDelete?.(rowIndex, row);
      options.onDataChange?.(
        data.filter((_, index) => index !== rowIndex),
        [change]
      );
    },
    [data, options]
  );

  const updateField = useCallback(
    (rowIndex: number, field: string, newValue: unknown) => {
      const row = data[rowIndex] as Record<string, unknown>;
      const oldValue = row?.[field];
      const change: DataChange = {
        id: `update_${rowIndex}_${field}_${Date.now()}`,
        type: "field_update",
        rowIndex,
        field,
        oldValue,
        newValue,
        timestamp: new Date(),
        isValid: true,
      };

      setData((prev) =>
        prev.map((row, index) =>
          index === rowIndex
            ? { ...(row as Record<string, unknown>), [field]: newValue }
            : row
        )
      );
      setChanges((prev) => [...prev, change]);

      options.onFieldUpdate?.(rowIndex, field, newValue, oldValue);
    },
    [data, options]
  );

  const deleteField = useCallback(
    (rowIndex: number, field: string) => {
      const row = data[rowIndex] as Record<string, unknown>;
      const value = row?.[field];
      const change: DataChange = {
        id: `delete_field_${rowIndex}_${field}_${Date.now()}`,
        type: "field_delete",
        rowIndex,
        field,
        oldValue: value,
        timestamp: new Date(),
        isValid: true,
      };

      setData((prev) =>
        prev.map((row, index) => {
          if (index === rowIndex) {
            const { [field]: deleted, ...rest } = row as Record<
              string,
              unknown
            >;
            return rest;
          }
          return row;
        })
      );
      setChanges((prev) => [...prev, change]);

      options.onFieldDelete?.(rowIndex, field, value);
    },
    [data, options]
  );

  const addField = useCallback(
    (rowIndex: number, field: string, value: unknown) => {
      const change: DataChange = {
        id: `add_field_${rowIndex}_${field}_${Date.now()}`,
        type: "field_add",
        rowIndex,
        field,
        newValue: value,
        timestamp: new Date(),
        isValid: true,
      };

      setData((prev) =>
        prev.map((row, index) =>
          index === rowIndex
            ? { ...(row as Record<string, unknown>), [field]: value }
            : row
        )
      );
      setChanges((prev) => [...prev, change]);
    },
    [data]
  );

  const bulkDelete = useCallback(
    (rowIndices: number[]) => {
      const changes: DataChange[] = rowIndices.map((rowIndex) => ({
        id: `bulk_delete_${rowIndex}_${Date.now()}`,
        type: "row_delete",
        rowIndex,
        oldValue: data[rowIndex],
        timestamp: new Date(),
        isValid: true,
      }));

      setData((prev) => prev.filter((_, index) => !rowIndices.includes(index)));
      setChanges((prev) => [...prev, ...changes]);

      options.onBulkDelete?.(rowIndices);
    },
    [data, options]
  );

  const saveChanges = useCallback(() => {
    options.onDataChange?.(data, changes);
    setChanges([]);
  }, [data, changes, options]);

  const discardChanges = useCallback(() => {
    setData(originalData);
    setChanges([]);
    setEditState((prev) => ({
      ...prev,
      isEditing: false,
      editingRow: null,
      editingField: null,
      selectedRows: new Set(),
    }));
  }, [originalData]);

  const hasChanges = useMemo(() => changes.length > 0, [changes.length]);

  return {
    data,
    changes,
    editState,
    setEditState,
    deleteRow,
    updateField,
    deleteField,
    addField,
    bulkDelete,
    saveChanges,
    discardChanges,
    hasChanges,
  };
};
