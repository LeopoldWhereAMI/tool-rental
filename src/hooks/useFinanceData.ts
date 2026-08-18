import { useState, useCallback, useEffect } from "react";

import {
  getTransactions,
  updateTransactionStatus,
  FinanceStats,
  Transaction,
  YearlyData,
  getDashboardData,
} from "@/services/financeService";

export function useFinanceData(initialPage = 1, itemsPerPage = 5) {
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getDashboardData(selectedYear);

      setStats(result.stats);
      setYearlyData(result.yearlyData);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  const fetchTransactions = useCallback(async () => {
    setTransactionsLoading(true);

    try {
      const result = await getTransactions(currentPage, itemsPerPage);

      setTransactions(result.transactions);
      setTotalTransactions(result.total);
    } catch (error) {
      console.error("Transactions fetch error:", error);
    } finally {
      setTransactionsLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  // Первоначальная загрузка
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          getDashboardData(selectedYear).then((result) => {
            setStats(result.stats);
            setYearlyData(result.yearlyData);
          }),
          getTransactions(currentPage, itemsPerPage).then((result) => {
            setTransactions(result.transactions);
            setTotalTransactions(result.total);
          }),
        ]);
      } catch (error) {
        console.error("Initial finance data fetch error:", error);
      } finally {
        setLoading(false);
        setIsInitialLoading(false);
        setTransactionsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Пагинация
  useEffect(() => {
    if (isInitialLoading) return;

    fetchTransactions();
  }, [currentPage, fetchTransactions, isInitialLoading]);

  // Смена года
  useEffect(() => {
    if (isInitialLoading) return;

    fetchDashboard();
  }, [selectedYear, fetchDashboard, isInitialLoading]);

  const toggleTransactionStatus = async (tx: Transaction) => {
    const newStatus = tx.status === "cancelled" ? "completed" : "cancelled";

    await updateTransactionStatus(tx.id, newStatus);

    await Promise.all([fetchDashboard(), fetchTransactions()]);
  };

  const refresh = useCallback(async () => {
    await Promise.all([fetchDashboard(), fetchTransactions()]);
  }, [fetchDashboard, fetchTransactions]);

  return {
    state: {
      stats,
      transactions,
      totalTransactions,
      yearlyData,
      currentPage,
      selectedYear,

      loading,
      isInitialLoading,
      transactionsLoading,
    },

    actions: {
      setCurrentPage,
      setSelectedYear,
      toggleTransactionStatus,
      refresh,
    },
  };
}
