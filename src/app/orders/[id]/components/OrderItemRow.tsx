"use client";
import { CheckCircle, Clock, ImageIcon, X } from "lucide-react";
import styles from "../page.module.css";
import { calculateDays, calculateItemTotal } from "@/helpers";
import { OrderItemDetailed, OrderUI } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelItemReturn, returnOrderItem } from "@/services/orderService";
import { toast } from "sonner";
import ReturnItemModal from "@/components/ui/MyModal/ReturnItemModal";

interface OrderItemRowProps {
  item: OrderItemDetailed;
  orderStatus: string;
  orderId: string;
  onItemReturned?: () => void;
}

// Компонент для одной строки инструмента
export function OrderItemRow({
  item,
  orderStatus,
  orderId,
  onItemReturned,
}: OrderItemRowProps) {
  const itemAsOrder = {
    start_date: item.start_date,
    end_date: item.end_date,
    status: orderStatus,
  } as OrderUI;

  const { statusVariant, statusText } = useOrderStatusInfo(itemAsOrder);

  const [isReturning] = useState(false);
  const [isCancelling] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"return" | "cancel">("return");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOpenModal = (type: "return" | "cancel") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    setLoading(true);
    try {
      if (modalType === "return") {
        await returnOrderItem(orderId, item.id);
        toast.success("Инструмент возвращён");
      } else {
        await cancelItemReturn(orderId, item.id);
        toast.success("Возврат отменён");
      }

      onItemReturned?.();
      router.refresh();
      setModalOpen(false);
    } catch (error) {
      console.error("Ошибка:", error);
      toast.error("Произошла ошибка при обработке");
    } finally {
      setLoading(false);
    }
  };

  const isItemReturned = item.item_status === "returned";

  return (
    <>
      <div className={styles.toolCard}>
        <div className={styles.productImagePlaceholder}>
          {item.inventory?.image_url ? (
            <Image
              src={item.inventory.image_url}
              alt={item.inventory.name || "Tool"}
              fill
              unoptimized
              style={{ objectFit: "cover" }}
              className={styles.productImage}
              sizes="72px"
            />
          ) : (
            <ImageIcon size={28} color="#9ca3af" />
          )}
        </div>

        <div className={styles.toolMainInfo}>
          <div className={styles.toolTitleRow}>
            <div className={styles.toolNameContainer}>
              <p className={styles.toolName}>
                {item.inventory?.name || "Инструмент"}
              </p>
              {statusVariant && (
                <span className={`${styles.badge} ${styles[statusVariant]}`}>
                  {statusText}
                </span>
              )}
              {isItemReturned && (
                <div className={styles.returnedStatusGroup}>
                  <span className={styles.returnedBadge}>
                    <CheckCircle size={14} />
                    Возвращён
                  </span>
                  {item.actual_return_date && (
                    <span className={styles.returnDateText}>
                      {new Date(item.actual_return_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
            <p className={styles.toolPriceLabel}>
              {calculateItemTotal(
                item.start_date,
                item.end_date,
                item.price_at_time,
              )}{" "}
              ₽
            </p>
          </div>

          <div className={styles.toolMetaRow}>
            <div className={styles.toolSubInfo}>
              <span className={styles.badgeBlue}>
                S/N: {item.inventory?.serial_number || "—"}
              </span>
              <span className={styles.badgeBlue}>
                Арт: {item?.inventory?.article || "—"}
              </span>
            </div>

            <div className={styles.toolTimeline}>
              <Clock size={14} />
              <span>
                {new Date(item.start_date).toLocaleDateString()} -{" "}
                {new Date(item.end_date).toLocaleDateString()}
                <small className={styles.daysSmall}>
                  ({calculateDays(item.start_date, item.end_date)} дн.)
                </small>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.actionSection}>
          {/* Ссылка "Подробнее" видна ВСЕГДА */}
          <Link
            href={`/inventory/${item.inventory?.id}`}
            className={styles.detailsLink}
          >
            Подробнее →
          </Link>
          {/* ✨ ОБНОВЛЕНО - Кнопка возврата показывается если НЕ вернули */}
          {!isItemReturned && orderStatus !== "cancelled" && (
            <button
              onClick={() => handleOpenModal("return")}
              disabled={isReturning}
              className={`${styles.returnBtn} ${isReturning ? styles.loading : ""}`}
            >
              {isReturning ? "Обработка..." : "Принять "}
            </button>
          )}

          {/* ✨ НОВОЕ - Кнопка отмены возврата показывается если вернули */}
          {isItemReturned && orderStatus !== "cancelled" && (
            <button
              onClick={() => handleOpenModal("cancel")}
              disabled={isCancelling}
              className={`${styles.cancelReturnBtn} ${isCancelling ? styles.loading : ""}`}
            >
              {isCancelling ? (
                "Отмена..."
              ) : (
                <>
                  <X size={16} />
                  Вернуть
                </>
              )}
            </button>
          )}
        </div>
      </div>
      <ReturnItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAction}
        itemName={item.inventory?.name || "Инструмент"}
        type={modalType}
        loading={loading}
      />
    </>
  );
}
