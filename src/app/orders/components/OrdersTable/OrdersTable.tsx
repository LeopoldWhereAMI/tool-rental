// "use client";

// import styles from "./OrdersTable.module.css";
// import { OrderUI, ViewMode } from "@/types";
// import OrderRow from "./OrderRow";
// import OrderCard from "../OrderCard/OrderCard";

// interface OrdersTableProps {
//   orders: OrderUI[];
//   openMenuId: string | null;
//   anchor: { top: number; left: number } | null;
//   onToggleMenu: (event: React.MouseEvent<HTMLElement>, id: string) => void;
//   onClose: () => void;
//   onStatusUpdate: (id: string, status: string) => Promise<void>;
//   onDeleteClick: (id: string) => void;
//   viewMode: ViewMode;
// }

// export default function OrdersTable({
//   orders,
//   openMenuId,
//   anchor,
//   onToggleMenu,
//   onClose,
//   onStatusUpdate,
//   onDeleteClick,
//   viewMode,
// }: OrdersTableProps) {
//   return (
//     <>
//       <div
//         className={`${styles.tableContainer} ${viewMode === "table" ? styles.show : styles.hide}`}
//       >
//         <div className={styles.wrapper}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>№ </th>
//                 <th>Инструменты</th>
//                 <th>Клиент</th>
//                 <th>Период</th>
//                 <th>Сумма</th>
//                 <th>Статус</th>
//                 <th>Действия</th>
//               </tr>
//             </thead>

//             <tbody>
//               {orders.map((order) => (
//                 <OrderRow
//                   key={order.id}
//                   order={order}
//                   openMenuId={openMenuId}
//                   anchor={anchor}
//                   onToggleMenu={onToggleMenu}
//                   onClose={onClose}
//                   onStatusUpdate={onStatusUpdate}
//                   onDeleteClick={onDeleteClick}
//                 />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div
//         className={`${styles.cardsContainer} ${viewMode === "cards" ? styles.show : styles.hide}`}
//       >
//         {orders.map((order) => (
//           <OrderCard
//             key={order.id}
//             order={order}
//             openMenuId={openMenuId}
//             anchor={anchor}
//             onToggleMenu={onToggleMenu}
//             onClose={onClose}
//             onStatusUpdate={onStatusUpdate}
//             onDeleteClick={onDeleteClick}
//           />
//         ))}
//       </div>
//     </>
//   );
// }

"use client";

import styles from "./OrdersTable.module.css";
import { OrderUI, ViewMode } from "@/types";
import OrderRow from "./OrderRow";
import OrderCard from "../OrderCard/OrderCard";
import EmptyBlock from "@/components/ui/EmptyBlock/EmptyBlock";

interface OrdersTableProps {
  orders: OrderUI[];
  openMenuId: string | null;
  anchor: { top: number; left: number } | null;
  onToggleMenu: (event: React.MouseEvent<HTMLElement>, id: string) => void;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
  viewMode: ViewMode;
}

export default function OrdersTable({
  orders,
  viewMode,
  ...menuProps // Собираем все пропсы меню (anchor, onToggleMenu и т.д.)
}: OrdersTableProps) {
  // 1. Обработка пустого состояния
  if (orders.length === 0) {
    return <EmptyBlock isSearch={true} message="Заказы не найдены" />;
  }

  // 2. Функция для рендеринга нужного вида
  const renderContent = () => {
    if (viewMode === "table") {
      return (
        <div className={styles.tableContainer}>
          <div className={styles.wrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Инструменты</th>
                  <th>Клиент</th>
                  <th>Период</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} {...menuProps} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Режим карточек
    return (
      <div className={styles.cardsContainer}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} {...menuProps} />
        ))}
      </div>
    );
  };

  return <div className={styles.mainWrapper}>{renderContent()}</div>;
}
