"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
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
import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import Image from "next/image";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import usePagination from "@/hooks/usePagination";

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

  const watchedItems = useWatch({
    control,
    name: "items",
  });

  const selectedId = watchedItems?.[index]?.inventory_id;

  const selectedItem = inventory.find((item) => item.id === selectedId);

  const allInventoryIds = inventory.map((item) => item.id);

  const bookingStatuses = useInventoryBookings(allInventoryIds);
  const { rentedIds } = useRentedInventory();

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();

    const selectedInventoryIds =
      watchedItems?.map((item) => item.inventory_id).filter(Boolean) || [];

    return inventory.filter((item) => {
      const isAlreadySelected = selectedInventoryIds.includes(item.id);
      const isSelectedHere = selectedId === item.id;

      if (isAlreadySelected && !isSelectedHere) {
        return false;
      }

      if (rentedIds.includes(item.id) && !isSelectedHere) {
        return false;
      }

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

      <button
        type="button"
        className={styles.select}
        onClick={() => setIsOpen(true)}
      >
        {selectedItem
          ? `${selectedItem.article} — ${selectedItem.name}`
          : "Выбрать инструмент"}
      </button>

      {isOpen && (
        <div
          className={`${styles.inventoryModalOverlay} ${
            isClosing ? styles.closing : ""
          }`}
        >
          <div
            className={`${styles.inventoryModal} ${
              isClosing ? styles.closing : ""
            }`}
          >
            <div className={styles.inventoryModalHeader}>
              <h3>Выбор инструмента</h3>

              <button
                type="button"
                onClick={handleClose}
                className={styles.inventoryModalClose}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.inventorySearch}>
              <Search size={18} />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Поиск по названию или артикулу..."
                autoFocus
              />
            </div>

            <div
              className={`${styles.inventoryModalList} ${
                pageLoading ? styles.paginationLoading : ""
              }`}
            >
              {filteredInventory.length === 0 ? (
                <div className={styles.inventoryEmpty}>
                  Инструменты не найдены
                </div>
              ) : (
                paginatedInventory.map((item) => {
                  const bookingStatus = bookingStatuses[item.id];
                  const isBooked = bookingStatus?.has_booking;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={styles.inventoryModalItem}
                      onClick={() => handleSelect(item)}
                    >
                      <div className={styles.inventoryModalImage}>
                        {item.image_url ? (
                          <Image
                            src={item.image_url.trimEnd()}
                            alt={item.name}
                            width={64}
                            height={64}
                            className={styles.inventoryModalImageImg}
                          />
                        ) : (
                          <span>Нет фото</span>
                        )}
                      </div>

                      <div className={styles.inventoryModalInfo}>
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
