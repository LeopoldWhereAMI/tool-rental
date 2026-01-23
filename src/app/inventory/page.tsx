"use client";

import styles from "./page.module.css";
// import InventoryList from "@/components/Inventory/InventoryList";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import SearchInput from "@/components/SearchInput/SearchInput";
import { useMemo, useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import { useDebounce } from "@/hooks/useDebounce";
import InventoryList from "@/components/Inventory/InventoryList/InventoryList";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const { items, loading, error, refresh } = useInventory();
  const [category, setCategory] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const filteredItems = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();

    return items.filter((item) => {
      const categoryValue = !category || item.category === category;
      const searchValue = !query || item.name.toLowerCase().includes(query);

      return categoryValue && searchValue;
    });
  }, [items, category, debouncedSearch]);

  return (
    <div className={styles.inventoryPage}>
      <PageWrapper>
        <Link href={"/inventory/add"} className={styles.addInventoryBtn}>
          Добавить инструмент
        </Link>
        <SearchInput value={search} setSearch={setSearch} />
        <InventoryList
          items={filteredItems}
          selectedCategory={category}
          onCategoryChange={setCategory}
          loading={loading}
          error={error}
          refresh={refresh}
        />
      </PageWrapper>
    </div>
  );
}
