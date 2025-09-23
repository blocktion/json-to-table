import { useState, useMemo, useCallback } from 'react';

export const usePagination = (
  data: unknown[],
  pageSize: number = 50,
  enabled: boolean = false
) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    if (!enabled) return 1;
    return Math.ceil(data.length / pageSize);
  }, [data.length, pageSize, enabled]);

  const paginatedData = useMemo(() => {
    if (!enabled) return data;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize, enabled]);

  const handlePageChange = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  // Reset to first page when data changes
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    handlePageChange,
    paginatedData,
    resetPage,
  };
};
