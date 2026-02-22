// import { Clock, ToolCase } from "lucide-react";
// import styles from "../page.module.css";
// import { calculateDays, calculateItemTotal } from "@/helpers";
// import { OrderDetailsUI } from "@/types";

// type OrderItemsListProps = {
//   items: OrderDetailsUI["order_items"];
// };

// export default function OrderItemsList({ items }: OrderItemsListProps) {
//   return (
//     <div className={`${styles.infoBlock} ${styles.wideBlock}`}>
//       <div className={styles.blockTitle}>
//         <ToolCase size={20} /> <h3>Инструменты и индивидуальные сроки</h3>
//       </div>
//       <div className={styles.blockContent}>
//         {items && items.length > 0 ? (
//           <div className={styles.toolsListDetailed}>
//             {items.map((item, index) => (
//               <div key={item.id || index} className={styles.toolItemEntry}>
//                 <div className={styles.toolHeader}>
//                   <p className={styles.name}>
//                     {item.inventory?.name || "Инструмент"}
//                   </p>
//                   <span className={styles.toolPrice}>
//                     {calculateItemTotal(
//                       item.start_date,
//                       item.end_date,
//                       item.price_at_time,
//                     )}{" "}
//                     ₽
//                     <span className={styles.subText}>
//                       ({calculateDays(item.start_date, item.end_date)} дн.)
//                     </span>
//                   </span>
//                 </div>

//                 <div className={styles.toolMeta}>
//                   <span className={styles.subText}>
//                     S/N: {item.inventory?.serial_number || "—"}
//                   </span>

//                   {/* Добавляем отображение дат для конкретного инструмента */}
//                   <div className={styles.individualDates}>
//                     <Clock size={14} />
//                     <span>
//                       {item.start_date
//                         ? new Date(item.start_date).toLocaleDateString()
//                         : "—"}
//                       {" — "}
//                       {item.end_date
//                         ? new Date(item.end_date).toLocaleDateString()
//                         : "—"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>Инструменты не найдены</p>
//         )}
//       </div>
//     </div>
//   );
// }

import { Clock } from "lucide-react";
import styles from "../page.module.css";
import { calculateDays, calculateItemTotal } from "@/helpers";
import { OrderDetailsUI } from "@/types";
import Image from "next/image";

type OrderItemsListProps = {
  items: OrderDetailsUI["order_items"];
};

export default function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className={styles.rentedToolsSection}>
      <div className={styles.rentedToolsHeader}>
        <h2>Арендованные инструменты</h2>
        <span className={styles.itemCountBadge}>{items?.length || 0} поз.</span>
      </div>

      <div className={styles.toolsListDetailed}>
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <div key={item.id || index} className={styles.toolCard}>
              {/* Левая часть: Изображение */}
              <div className={styles.toolThumbWrapper}>
                <Image
                  src={item.inventory?.image_url || "/placeholder-tool.png"}
                  alt={item.inventory?.name || "Tool"}
                  fill
                  unoptimized
                  priority={index === 0}
                  sizes="100px"
                  className={styles.toolThumb}
                />
              </div>

              {/* Правая часть: Информация */}
              <div className={styles.toolMainInfo}>
                <div className={styles.toolTitleRow}>
                  <p className={styles.toolName}>
                    {item.inventory?.name || "Инструмент"}
                  </p>
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
                        {" "}
                        ({calculateDays(item.start_date, item.end_date)} дн.)
                      </small>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyText}>Инструменты не найдены</p>
        )}
      </div>
    </div>
  );
}
