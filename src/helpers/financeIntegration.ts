import { createTransaction } from "@/services/financeService";

/**
 * Вызывать эту функцию когда заказ завершается
 * @param orderId - ID заказа
 * @param totalPrice - Полная стоимость заказа
 * @param itemDescription - Описание заказа (например "Drill Rental - 3 дня")
 */
// export async function onOrderCompleted(
//   orderId: string,
//   totalPrice: number,
//   itemDescription: string,
// ) {
//   try {
//     const transaction = await createTransaction({
//       type: "income",
//       amount: totalPrice,
//       description: itemDescription,
//       category: "Rental",
//       status: "completed",
//       order_id: orderId,
//     });

//     return transaction;
//   } catch (error) {
//     console.error("❌ Ошибка при добавлении транзакции:", error);
//     throw error;
//   }
// }

export async function onOrderCompleted(
  orderId: string,
  totalPrice: number,
  itemDescription: string,
) {
  try {
    // 1. Проверяем, является ли сумма отрицательной (скидка/возврат разницы)
    const isNegative = totalPrice < 0;

    const transaction = await createTransaction({
      // 2. Если число отрицательное — ставим 'expense', если положительное — 'income'
      type: isNegative ? "expense" : "income",

      // 3. В базу для типа 'expense' лучше записывать положительное число (модуль)
      // так как логика отображения минуса обычно привязана к самому типу расхода
      amount: Math.abs(totalPrice),

      description: itemDescription,

      // 4. Меняем категорию для чистоты аналитики
      category: isNegative ? "Discount/Refund" : "Rental",

      status: "completed",
      order_id: orderId,
    });

    return transaction;
  } catch (error) {
    console.error("❌ Ошибка при добавлении транзакции:", error);
    throw error;
  }
}

/**
 * Вызывать эту функцию когда заказ отменяется и нужно вернуть деньги
 * @param orderId - ID заказа
 * @param refundAmount - Сумма возврата
 */
export async function onOrderRefunded(orderId: string, refundAmount: number) {
  try {
    const transaction = await createTransaction({
      type: "expense",
      amount: refundAmount,
      description: `Возврат за заказ #${orderId}`,
      category: "Refund",
      status: "completed",
      order_id: orderId,
    });

    return transaction;
  } catch (error) {
    console.error("❌ Ошибка при добавлении возврата:", error);
    throw error;
  }
}

/**
 * Вызывать эту функцию когда платеж получен (авансовый платеж)
 * @param orderId - ID заказа
 * @param advanceAmount - Размер предоплаты
 */
export async function onAdvancePaymentReceived(
  orderId: string,
  advanceAmount: number,
) {
  try {
    const transaction = await createTransaction({
      type: "income",
      amount: advanceAmount,
      description: `Предоплата за заказ #${orderId}`,
      category: "Advance Payment",
      status: "completed",
      order_id: orderId,
    });

    return transaction;
  } catch (error) {
    console.error("❌ Ошибка при добавлении предоплаты:", error);
    throw error;
  }
}
