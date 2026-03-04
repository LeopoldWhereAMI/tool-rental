import { useMemo, useState } from "react";

type UsePaginationProps<T> = {
  items: T[];
  itemsPerPage: number;
};

export default function usePagination<T>({
  items,
  itemsPerPage,
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage) || 1;
  }, [items.length, itemsPerPage]);

  const activePage = Math.min(Math.max(1, currentPage), totalPages);

  const currentItems = useMemo(() => {
    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  }, [items, activePage, itemsPerPage]);

  return {
    currentPage: activePage,
    setCurrentPage,
    totalPages,
    currentItems,
  };
}
