"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Transaction } from "@/services/financeService";
import { Banknote, Landmark, TrendingUp } from "lucide-react";
import FinanceCard from "./components/FinanceCard";
import TransactionTable from "./components/TransactionTable";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import FinanceActionForm from "./components/FinanceActionForm";
import CancelTransactionModal from "@/components/ui/MyModal/CancelTransactionModal";
import YearlyStatCard from "./components/YearlyStatCard";
import { useFinanceData } from "@/hooks/useFinanceData";
import PageContainer from "@/components/PageContainer/PageContainer";

const ITEMS_PER_PAGE = 4;

export default function FinancePage() {
  const { state, actions } = useFinanceData(1, ITEMS_PER_PAGE);
  const {
    stats,
    transactions,
    totalTransactions,
    yearlyData,
    currentPage,
    selectedYear,
    loading,
  } = state;
  const [modal, setModal] = useState<{
    open: boolean;
    tx: Transaction | null;
    processing: boolean;
  }>({
    open: false,
    tx: null,
    processing: false,
  });

  const handleConfirmCancel = async () => {
    if (!modal.tx) return;
    setModal((prev) => ({ ...prev, processing: true }));
    try {
      await actions.toggleTransactionStatus(modal.tx);
      setModal({ open: false, tx: null, processing: false });
    } catch (error) {
      console.error("Ошибка при отмене транзакции:", error);
      setModal((prev) => ({ ...prev, processing: false }));
    }
  };

  const totalPages = Math.ceil(totalTransactions / ITEMS_PER_PAGE);

  return (
    <PageContainer>
      {/* Шапка страницы */}
      <div className={styles.header}>
        <h1 className={styles.title}>Управление финансами</h1>
      </div>

      <>
        {/* Верхние карточки с показателями */}
        <div className={styles.cardsGrid}>
          <FinanceCard
            title="Текущий баланс"
            value={`${stats?.currentBalance.toLocaleString("ru-RU") || 0} ₽`}
            subtext="На счету сейчас"
            icon={<Landmark size={28} />}
            iconColor="#3b82f6"
            variant="blue"
            loading={loading}
          />

          <FinanceCard
            title="Дневной доход"
            value={`${stats?.dailyRevenue.toLocaleString("ru-RU") || 0} ₽`}
            subtext="Пришло сегодня"
            icon={<Banknote size={28} />}
            iconColor="#10b981"
            variant="green"
            loading={loading}
          />

          <FinanceCard
            title="Прибыль"
            value={`${stats?.monthlyProfit.toLocaleString("ru-RU") || 0} ₽`}
            subtext="За месяц"
            trend={
              stats?.trendPercent !== undefined
                ? `${stats.trendPercent > 0 ? "+" : ""}${stats.trendPercent}%`
                : undefined
            }
            icon={<TrendingUp size={28} />}
            iconColor="#d97706"
            variant="orange"
            loading={loading}
          />

          <YearlyStatCard
            data={yearlyData}
            selectedYear={selectedYear}
            onYearChange={actions.setSelectedYear}
            loading={loading}
          />
        </div>

        <div className={styles.mainContent}>
          {/* Форма вывода средств (передаем функцию обновления) */}
          <FinanceActionForm
            currentBalance={stats?.currentBalance || 0}
            onActionComplete={actions.refresh}
            loading={loading}
          />

          {/* Секция истории транзакций */}
          <div className={styles.transactionCard}>
            <div className={styles.transactionHeader}>
              <h2 className={styles.transactionTitle}>История транзакций</h2>
            </div>

            {transactions.length === 0 && !loading ? (
              <div className={styles.emptyState}>Транзакций не найдено</div>
            ) : (
              <>
                <TransactionTable
                  transactions={transactions}
                  loading={loading}
                  onCancel={(id) =>
                    setModal({
                      open: true,
                      tx: transactions.find((t) => t.id === id) || null,
                      processing: false,
                    })
                  }
                />

                <PaginationControls
                  totalPages={totalPages}
                  currentPage={currentPage}
                  clickHandler={actions.setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
        <CancelTransactionModal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, tx: null, processing: false })}
          onConfirm={handleConfirmCancel}
          transaction={modal.tx}
          loading={modal.processing}
        />
      </>
    </PageContainer>
  );
}
