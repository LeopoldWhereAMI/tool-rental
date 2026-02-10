// import { useEffect, useMemo, useState } from "react";

// type usePaginationProps<T> = {
//   items: T[];
//   itemsPerPage: number;
// };

// export default function usePagination<T>({
//   items,
//   itemsPerPage,
// }: usePaginationProps<T>) {
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = useMemo(() => {
//     return Math.ceil(items.length / itemsPerPage);
//   }, [items.length, itemsPerPage]);

//   useEffect(() => {
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(totalPages);
//     } else if (totalPages === 0) {
//       setCurrentPage(1);
//     }
//   }, [items.length, totalPages, currentPage]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [items.length]);

//   const currentItems = useMemo(() => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return items.slice(indexOfFirstItem, indexOfLastItem);
//   }, [items, currentPage, itemsPerPage]);

//   return {
//     currentPage,
//     setCurrentPage,
//     totalPages,
//     currentItems,
//   };
// }

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

  // 1. Вычисляем общее количество страниц
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage) || 1;
  }, [items.length, itemsPerPage]);

  // 2. Важный трюк: вычисляем "реальную" страницу.
  // Если после фильтрации данных стало меньше и currentPage вылетела за границы,
  // мы не делаем setState, а просто используем в расчетах максимально возможную страницу.
  const activePage = Math.min(Math.max(1, currentPage), totalPages);

  // 3. Вырезаем нужные элементы, основываясь на "безопасной" странице
  const currentItems = useMemo(() => {
    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  }, [items, activePage, itemsPerPage]);

  // Если нужно, чтобы при изменении списка (поиске) визуально сбрасывалось на 1
  // Мы можем обернуть setCurrentPage в логику выше или просто оставить как есть,
  // так как activePage подстроится автоматически.

  return {
    currentPage: activePage, // возвращаем безопасное значение
    setCurrentPage,
    totalPages,
    currentItems,
  };
}
