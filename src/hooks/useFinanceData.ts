import { useState, useCallback, useEffect } from "react";
import {
  getFinanceStats,
  getTransactions,
  getYearlyReport,
  updateTransactionStatus,
  FinanceStats,
  Transaction,
  YearlyData,
} from "@/services/financeService";

export function useFinanceData(initialPage = 1, itemsPerPage = 5) {
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, transRes, yearlyRes] = await Promise.all([
        getFinanceStats(),
        getTransactions(currentPage, itemsPerPage),
        getYearlyReport(selectedYear),
      ]);
      setStats(statsRes);
      setTransactions(transRes.transactions);
      setTotalTransactions(transRes.total);
      setYearlyData(yearlyRes);
    } catch (error) {
      console.error("Data fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedYear, itemsPerPage]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const toggleTransactionStatus = async (tx: Transaction) => {
    const newStatus = tx.status === "cancelled" ? "completed" : "cancelled";
    await updateTransactionStatus(tx.id, newStatus);
    await fetchAll();
  };

  return {
    state: {
      stats,
      transactions,
      totalTransactions,
      yearlyData,
      currentPage,
      selectedYear,
      loading,
    },
    actions: {
      setCurrentPage,
      setSelectedYear,
      toggleTransactionStatus,
      refresh: fetchAll,
    },
  };
}
