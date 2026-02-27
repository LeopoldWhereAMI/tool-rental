"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import {
  Package,
  CheckCircle,
  ShoppingCart,
  Wrench,
  PlusCircle,
} from "lucide-react";
import { useSearchStore } from "../store/store";
import Link from "next/link";
import InventoryFilters from "@/components/Inventory/InventoryFilters/InventoryFilters";
import SearchInput from "@/components/SearchInput/SearchInput";
import { useInventoryFilters } from "@/hooks/useInventoryFilters";

import StatCard from "./components/StatCard";
import InventoryTable from "./components/InventoryTable";
import ViewToggle from "@/components/ui/ViewToggle/ViewToggle";
import { useAdaptiveView } from "@/hooks/useAdaptiveView";
import MainSceleton from "@/components/ui/Skeleton/MainSceleton";

export default function InventoryPage() {
  const { query, setQuery } = useSearchStore();

  const { items, stats, loading, error, refresh } = useInventory();
  const { viewMode, setViewMode } = useAdaptiveView("inventory");

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { filteredItems, categories } = useInventoryFilters({
    items,
    query,
    categoryFilter,
    statusFilter,
  });

  return (
    <div className={styles.container}>
      {/* --- Header --- */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Управление инвентарем</h1>
          <span className={styles.subtitle}>
            Управляйте оборудованием и отслеживайте его состояние.
          </span>
        </div>

        <div>
          <Link href="/inventory/add" className={styles.btnAdd}>
            <PlusCircle size={16} />
            <span className={styles.btnText}>Инструмент</span>
          </Link>
        </div>
      </div>

      {/* --- Stats Cards --- */}
      <div className={styles.statsGrid}>
        {/* Total Card */}
        <StatCard
          label="Всего инструментов"
          value={stats?.total}
          icon={Package}
          iconColor="#9ca3af"
          iconBg="#2e333d"
          loading={loading}
          trend={stats?.totalTrend}
        />

        {/* Available Card */}
        <StatCard
          label="Доступно"
          value={stats?.available}
          icon={CheckCircle}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.1)"
          loading={loading}
          suffix={`${stats?.availablePct}% от общего`}
        />

        {/* In Rent Card */}
        <StatCard
          label="В аренде"
          value={stats?.rented}
          icon={ShoppingCart}
          iconColor="#3b82f6"
          iconBg="rgba(59, 130, 246, 0.1)"
          loading={loading}
          trend={stats?.rentedTrend}
        />

        {/* Maintenance Card */}
        <StatCard
          label="В ремонте"
          value={stats?.maintenance}
          icon={Wrench}
          iconColor="#f59e0b"
          iconBg="rgba(245, 158, 11, 0.1)"
          loading={loading}
          trend={stats?.maintenanceTrend}
          invertTrend={true}
        />
      </div>

      {/* --- Filter Bar & List --- */}
      <div className={styles.inventoryListWrapper}>
        <div className={styles.filterBar}>
          <div className={styles.left}>
            <SearchInput value={query} setSearch={setQuery} />
          </div>
          <div className={styles.right}>
            <InventoryFilters
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categories={categories}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
            <div className={styles.viewToggleWrapper}>
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
        </div>

        {loading && items.length === 0 ? (
          <MainSceleton />
        ) : (
          <InventoryTable
            items={filteredItems}
            viewMode={viewMode}
            error={error}
            refresh={refresh}
          />
        )}
      </div>
    </div>
  );
}
