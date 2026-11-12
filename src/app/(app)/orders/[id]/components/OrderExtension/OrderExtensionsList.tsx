"use client";

import { useState } from "react";
import { toast } from "sonner";
import { OrderDetailsUI } from "@/types";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import usePagination from "@/hooks/usePagination";
import styles from "./OrderExtension.module.css";
import { formatExtensionDate } from "./helper";
import { payOrderExtensions } from "@/services/orderExtensionService";

type Extension = OrderDetailsUI["extensions"][number];

type OrderExtensionsListProps = {
  extensions: Extension[];
  items: OrderDetailsUI["order_items"];
  orderId: string;
  orderNumber: OrderDetailsUI["order_number"];
  onExtensionPaid: (extensionId: string, amount: number) => void;
};

export default function OrderExtensionsList({
  extensions,
  items,
  orderId,
  orderNumber,
  onExtensionPaid,
}: OrderExtensionsListProps) {
  const [isPaying, setIsPaying] = useState<string | null>(null);

  const {
    currentPage,
    totalPages,
    currentItems: currentExtensions,
    handlePageChange,
    pageLoading,
  } = usePagination({
    items: extensions,
    itemsPerPage: 5,
  });

  const handlePayExtension = async (extension: Extension) => {
    if (isPaying) return;

    const remaining = extension.amount - extension.paid_amount;

    if (remaining <= 0) {
      return;
    }

    try {
      setIsPaying(extension.id);

      await payOrderExtensions({
        orderId,
        extensionId: extension.id,
        amount: remaining,
        orderNumber,
      });

      toast.success(`Продление оплачено: ${remaining} ₽`);

      onExtensionPaid(extension.id, remaining);
    } catch (error) {
      console.error("Ошибка оплаты продления:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Не удалось оплатить продление",
      );
    } finally {
      setIsPaying(null);
    }
  };

  if (extensions.length === 0) {
    return null;
  }

  return (
    <div className={styles.extensionsBlock}>
      <div
        className={`${styles.extensionsList} ${
          pageLoading || isPaying ? styles.paginationLoading : ""
        }`}
      >
        {currentExtensions.map((extension) => {
          const remaining = extension.amount - extension.paid_amount;
          const paying = isPaying === extension.id;
          const orderItem = items.find(
            (item) => item.id === extension.order_item_id,
          );

          const inventory = orderItem?.inventory;

          return (
            <div key={extension.id} className={styles.extensionItem}>
              <div className={styles.extensionInfo}>
                <strong className={styles.extensionAmount}>
                  {extension.amount} ₽
                </strong>

                <div className={styles.extensionDetails}>
                  <span>{inventory?.name || "Инструмент"}</span>

                  {inventory?.article && <span>Арт. {inventory.article}</span>}

                  <span>Продление на {extension.days} дн.</span>

                  <span className={styles.extensionDate}>
                    {formatExtensionDate(extension.created_at)}
                  </span>
                </div>
              </div>

              <div className={styles.extensionRight}>
                {remaining > 0 ? (
                  <>
                    <span className={styles.extensionDebt}>
                      Осталось: {remaining} ₽
                    </span>

                    <button
                      type="button"
                      className={styles.extensionPayButton}
                      onClick={() => handlePayExtension(extension)}
                      disabled={paying}
                    >
                      {paying ? "Оплата..." : "Оплатить"}
                    </button>
                  </>
                ) : (
                  <span className={styles.extensionPaid}>Оплачено</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          totalPages={totalPages}
          currentPage={currentPage}
          clickHandler={handlePageChange}
          compact
        />
      )}
    </div>
  );
}
