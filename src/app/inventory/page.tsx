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
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Управление инвентарем</h1>
          <span className={styles.subtitle}>
            Управляйте оборудованием и отслеживайте его состояние.
          </span>
        </div>

        <div className={styles.btnWrapper}>
          <Link href="/inventory/add" className={styles.btnAdd}>
            <PlusCircle size={16} />
            <span className={styles.btnText}>Инструмент</span>
          </Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          label="Всего инструментов"
          labelColor="var(--primary)"
          value={stats?.total}
          icon={Package}
          iconColor="var(--primary)"
          iconBg="rgba(59, 130, 246, 0.1)"
          loading={loading}
        />

        <StatCard
          label="Доступно"
          labelColor="#10b981"
          value={stats?.available}
          icon={CheckCircle}
          iconColor="#10b981"
          iconBg="rgba(16, 185, 129, 0.1)"
          loading={loading}
        />

        <StatCard
          label="В аренде"
          labelColor="var(--secondary)"
          value={stats?.rented}
          icon={ShoppingCart}
          iconColor="var(--secondary)"
          iconBg="rgba(59, 130, 246, 0.1)"
          loading={loading}
        />

        <StatCard
          label="В ремонте"
          labelColor="#f59e0b"
          value={stats?.maintenance}
          icon={Wrench}
          iconColor="#f59e0b"
          iconBg="rgba(245, 158, 11, 0.1)"
          loading={loading}
        />
      </div>

      <>
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
      </>
    </div>
  );
}
