import { useState, useMemo, useCallback } from 'react';
import { Column, FilterConfig } from '../types';
import { ObjectUtils } from '../utils/objectUtils';

export const useFiltering = (
  data: unknown[],
  columns: Column[],
  enabled: boolean = false
) => {
  const [filters, setFilters] = useState<FilterConfig[]>([]);

  const filteredData = useMemo(() => {
    if (!enabled || filters.length === 0) return data;

    return data.filter(row => {
      return filters.every(filter => {
        const column = columns.find(col => col.key === filter.key);
        if (!column || !column.filterable) return true;

        const value = ObjectUtils.getNestedValue(row, column.cleanKey);
        const filterValue = filter.value.toLowerCase();
        const cellValue = String(value || '').toLowerCase();

        switch (filter.operator) {
          case 'contains':
            return cellValue.includes(filterValue);
          case 'equals':
            return cellValue === filterValue;
          case 'startsWith':
            return cellValue.startsWith(filterValue);
          case 'endsWith':
            return cellValue.endsWith(filterValue);
          case 'gt':
            return Number(cellValue) > Number(filterValue);
          case 'lt':
            return Number(cellValue) < Number(filterValue);
          case 'gte':
            return Number(cellValue) >= Number(filterValue);
          case 'lte':
            return Number(cellValue) <= Number(filterValue);
          default:
            return true;
        }
      });
    });
  }, [data, columns, filters, enabled]);

  const handleAddFilter = useCallback((
    key: string,
    value: string,
    operator: FilterConfig['operator'] = 'contains'
  ) => {
    if (!enabled) return;

    const newFilter: FilterConfig = { key, value, operator };
    setFilters(prev => [...prev.filter(f => f.key !== key), newFilter]);
  }, [enabled]);

  const handleRemoveFilter = useCallback((key: string) => {
    if (!enabled) return;

    setFilters(prev => prev.filter(f => f.key !== key));
  }, [enabled]);

  const handleUpdateFilter = useCallback((
    key: string,
    value: string,
    operator?: FilterConfig['operator']
  ) => {
    if (!enabled) return;

    setFilters(prev => prev.map(f => 
      f.key === key 
        ? { ...f, value, ...(operator && { operator }) }
        : f
    ));
  }, [enabled]);

  return {
    filters,
    handleAddFilter,
    handleRemoveFilter,
    handleUpdateFilter,
    filteredData,
  };
};
