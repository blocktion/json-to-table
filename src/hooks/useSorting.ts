import { useState, useMemo, useCallback } from 'react';
import { Column, SortConfig } from '../types';
import { ObjectUtils } from '../utils/objectUtils';

export const useSorting = (
  data: unknown[],
  columns: Column[],
  enabled: boolean = true
) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc',
  });

  const sortedData = useMemo(() => {
    if (!enabled || !sortConfig.key) return data;

    const column = columns.find(col => col.key === sortConfig.key);
    if (!column || !column.sortable) return data;

    return [...data].sort((a, b) => {
      const aValue = ObjectUtils.getNestedValue(a, column.cleanKey);
      const bValue = ObjectUtils.getNestedValue(b, column.cleanKey);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, columns, sortConfig, enabled]);

  const handleSort = useCallback((columnKey: string) => {
    if (!enabled) return;

    const column = columns.find(col => col.key === columnKey);
    if (!column || !column.sortable) return;

    setSortConfig(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, [columns, enabled]);

  return {
    sortConfig,
    handleSort,
    sortedData,
  };
};
