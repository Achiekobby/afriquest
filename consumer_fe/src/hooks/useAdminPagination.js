import { useEffect, useMemo, useState } from "react";

export const ADMIN_TABLE_PAGE_SIZE = 10;

export function useAdminPagination(items, { pageSize = ADMIN_TABLE_PAGE_SIZE, resetKey } = {}) {
  const [page, setPage] = useState(1);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return {
    page,
    setPage,
    pageSize,
    totalItems,
    totalPages,
    paginatedItems,
    rangeStart,
    rangeEnd,
    hasPagination: totalItems > pageSize,
  };
}

function buildVisiblePages(current, total) {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
}

export function getAdminPaginationPages(current, total) {
  const visible = buildVisiblePages(current, total);
  const items = [];

  visible.forEach((page, index) => {
    if (index > 0 && page - visible[index - 1] > 1) {
      items.push("ellipsis");
    }
    items.push(page);
  });

  return items;
}
