"use client";

import { useState } from "react";
import { toast } from "sonner";
import { OrderDetailsUI } from "@/types";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import usePagination from "@/hooks/usePagination";
import styles from "./OrderExtension.module.css";
import { formatExtensionDate } from "./helper";
import { ChevronDown } from "lucide-react";

type Extension = OrderDetailsUI["extensions"][number];

type OrderExtensionsListProps = {
  extensions: Extension[];
  orderId: string;
  orderNumber: OrderDetailsUI["order_number"];
  onExtensionPaid: (extensionId: string, amount: number) => void;
};

export default function OrderExtensionsList({
  extensions,
  orderId,
  orderNumber,
  onExtensionPaid,
}: OrderExtensionsListProps) {
  const [isPaying, setIsPaying] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

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

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "income",
          amount: remaining,
          description: `Оплата продления по заказу #${orderNumber}`,
          category: "OrderExtension",
          status: "completed",
          order_id: orderId,
          extension_id: extension.id,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

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
      <button
        type="button"
        className={styles.extensionsHeader}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span>{isExpanded ? "Скрыть продления" : "Показать продления"}</span>

        <ChevronDown
          size={16}
          className={`${styles.extensionsArrow} ${
            isExpanded ? styles.extensionsArrowOpen : ""
          }`}
        />
      </button>

      <div
        className={`${styles.extensionsContent} ${
          isExpanded ? styles.extensionsContentOpen : ""
        }`}
      >
        <div className={styles.extensionsContentInner}>
          <div
            className={`${styles.extensionsList} ${
              pageLoading || isPaying ? styles.paginationLoading : ""
            }`}
          >
            {currentExtensions.map((extension) => {
              const remaining = extension.amount - extension.paid_amount;
              const paying = isPaying === extension.id;

              return (
                <div key={extension.id} className={styles.extensionItem}>
                  <div className={styles.extensionInfo}>
                    <strong className={styles.extensionAmount}>
                      {extension.amount} ₽
                    </strong>

                    <div className={styles.extensionDetails}>
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
    </div>
  );
}
