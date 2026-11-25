"use client";

import { useMemo, useState } from "react";
import { Search, X, Check, RotateCcw } from "lucide-react";
import { useWatch } from "react-hook-form";
import { OrderInput } from "@/lib/validators/orderSchema";
import { Inventory } from "@/types";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormClearErrors,
  Control,
} from "react-hook-form";
import { useInventoryBookings } from "@/hooks/useInventoryBookings";
import { useRentedInventory } from "@/hooks/useRentedInventory";
import Image from "next/image";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import usePagination from "@/hooks/usePagination";
import formStyles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import styles from "./OrderInventorySelectModal.module.css";

type Props = {
  index: number;
  control: Control<OrderInput>;
  register: UseFormRegister<OrderInput>;
  setValue: UseFormSetValue<OrderInput>;
  clearErrors: UseFormClearErrors<OrderInput>;
  inventory: Inventory[];
};

export default function OrderInventorySelectModal({
  index,
  control,
  register,
  setValue,
  clearErrors,
  inventory,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const ITEMS_PER_PAGE = 6;

  const watchedItems = useWatch({ control, name: "items" });
  const selectedId = watchedItems?.[index]?.inventory_id;
  const selectedItem = inventory.find((item) => item.id === selectedId);

  const allInventoryIds = inventory.map((item) => item.id);
  const bookingStatuses = useInventoryBookings(allInventoryIds);
  const { rentedIds } = useRentedInventory();

  const stats = useMemo(() => {
    const rented = rentedIds.length;
    const total = inventory.length + rented;
    const booked = allInventoryIds.filter(
      (id) => bookingStatuses[id]?.has_booking,
    ).length;
    const free = Math.max(inventory.length - booked, 0);

    return { total, free, booked, rented };
  }, [inventory.length, allInventoryIds, bookingStatuses, rentedIds]);

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();

    const selectedInventoryIds =
      watchedItems?.map((item) => item.inventory_id).filter(Boolean) || [];

    return inventory.filter((item) => {
      const isAlreadySelected = selectedInventoryIds.includes(item.id);
      const isSelectedHere = selectedId === item.id;

      if (isAlreadySelected && !isSelectedHere) return false;
      if (rentedIds.includes(item.id) && !isSelectedHere) return false;
      if (!query) return true;

      return (
        item.name.toLowerCase().includes(query) ||
        item.article?.toLowerCase().includes(query)
      );
    });
  }, [inventory, search, watchedItems, selectedId, rentedIds]);

  const {
    currentPage,
    currentItems: paginatedInventory,
    totalPages,
    handlePageChange,
    pageLoading,
  } = usePagination({
    items: filteredInventory,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const handleSelect = (item: Inventory) => {
    clearErrors(`items.${index}.inventory_id`);

    setValue(`items.${index}.inventory_id`, item.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const startDate = watchedItems?.[index]?.start_date;

    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start);

      end.setDate(start.getDate() + 1);

      setValue(`items.${index}.end_date`, end.toISOString().split("T")[0], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    setSearch("");
    handleClose();
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(`items.${index}.inventory_id`, "", { shouldDirty: true });
    clearErrors(`items.${index}.inventory_id`);
  };

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  return (
    <>
      <input
        type="hidden"
        {...register(`items.${index}.inventory_id` as const)}
      />

      {selectedItem ? (
        <div
          className={styles.toolChip}
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setIsOpen(true)}
        >
          <div className={styles.toolChipImage}>
            {selectedItem.image_url ? (
              <Image
                src={selectedItem.image_url.trimEnd()}
                alt={selectedItem.name}
                width={44}
                height={44}
              />
            ) : (
              <span>Нет фото</span>
            )}
          </div>

          <div className={styles.toolChipInfo}>
            <div className={styles.toolChipName}>
              {selectedItem.article} — {selectedItem.name}
            </div>
            <div className={styles.toolChipMeta}>
              {selectedItem.daily_price} ₽ / день
            </div>
          </div>

          <div className={styles.toolChipCheck}>
            <Check size={13} />
          </div>

          <button
            type="button"
            className={styles.resetBtn}
            onClick={handleClearSelection}
            aria-label="Снять выбор инструмента"
            title="Снять выбор"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={styles.toolSearchTrigger}
          onClick={() => setIsOpen(true)}
        >
          <Search size={16} />
          Выбрать инструмент со склада
        </button>
      )}

      {isOpen && (
        <div
          className={`${formStyles.inventoryModalOverlay} ${
            isClosing ? formStyles.closing : ""
          }`}
        >
          <div
            className={`${formStyles.inventoryModal} ${
              isClosing ? formStyles.closing : ""
            }`}
          >
            <div className={formStyles.inventoryModalHeader}>
              <h3>Выбор инструмента</h3>

              <button
                type="button"
                onClick={handleClose}
                className={formStyles.inventoryModalClose}
              >
                <X size={20} />
              </button>
            </div>

            <div className={formStyles.inventorySearch}>
              <Search size={18} />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию или артикулу..."
                autoFocus
              />
            </div>

            <div className={styles.inventoryStats}>
              <span className={styles.statItem}>
                <strong>{stats.total}</strong> всего
              </span>
              <span className={styles.statDivider} />
              <span className={`${styles.statItem} ${styles.statFree}`}>
                <strong>{stats.free}</strong> свободно
              </span>
              <span className={styles.statDivider} />
              <span className={`${styles.statItem} ${styles.statRented}`}>
                <strong>{stats.rented}</strong> в аренде
              </span>
              <span className={styles.statDivider} />
              <span className={`${styles.statItem} ${styles.statBooked}`}>
                <strong>{stats.booked}</strong> забронировано
              </span>
            </div>

            <div
              className={`${formStyles.inventoryModalList} ${
                pageLoading ? formStyles.paginationLoading : ""
              }`}
            >
              {filteredInventory.length === 0 ? (
                <div className={formStyles.inventoryEmpty}>
                  Инструменты не найдены
                </div>
              ) : (
                paginatedInventory.map((item) => {
                  const bookingStatus = bookingStatuses[item.id];
                  const isBooked = bookingStatus?.has_booking;
                  const isCurrentSelection = item.id === selectedId;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`${formStyles.inventoryModalItem} ${
                        isCurrentSelection
                          ? styles.inventoryModalItemActive
                          : ""
                      }`}
                      onClick={() => handleSelect(item)}
                    >
                      <div className={formStyles.inventoryModalImage}>
                        {item.image_url ? (
                          <Image
                            src={item.image_url.trimEnd()}
                            alt={item.name}
                            width={64}
                            height={64}
                            className={formStyles.inventoryModalImageImg}
                          />
                        ) : (
                          <span>Нет фото</span>
                        )}
                      </div>

                      <div className={formStyles.inventoryModalInfo}>
                        <strong>
                          {item.article} — {item.name}
                        </strong>

                        <span>{item.daily_price} ₽ / день</span>

                        {isBooked && bookingStatus?.formattedRange && (
                          <small>
                            ⚠️ Забронирован на: {bookingStatus.formattedRange}
                          </small>
                        )}
                      </div>

                      {isCurrentSelection && (
                        <span className={styles.toolChipCheck}>
                          <Check size={13} />
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
              clickHandler={handlePageChange}
            />
          </div>
        </div>
      )}
    </>
  );
}
