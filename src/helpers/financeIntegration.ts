import { createTransaction } from "@/services/financeService";

/**
 * Вызывать эту функцию когда заказ завершается
 * @param orderId - ID заказа
 * @param totalPrice - Полная стоимость заказа
 * @param itemDescription - Описание заказа (например "Drill Rental - 3 дня")
 */
export async function onOrderCompleted(
  orderId: string,
  totalPrice: number,
  itemDescription: string,
) {
  try {
    console.log(`📊 Добавляем транзакцию для заказа ${orderId}`);

    const transaction = await createTransaction({
      type: "income",
      amount: totalPrice,
      description: itemDescription,
      category: "Rental",
      status: "completed",
      order_id: orderId,
    });

    console.log("✅ Транзакция добавлена успешно:", transaction);
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
    console.log(
      `💰 Добавляем возврат для заказа ${orderId} на сумму $${refundAmount}`,
    );

    const transaction = await createTransaction({
      type: "expense",
      amount: refundAmount,
      description: `Возврат за заказ #${orderId}`,
      category: "Refund",
      status: "completed",
      order_id: orderId,
    });

    console.log("✅ Возврат зафиксирован:", transaction);
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
    console.log(
      `💵 Добавляем предоплату для заказа ${orderId} на сумму $${advanceAmount}`,
    );

    const transaction = await createTransaction({
      type: "income",
      amount: advanceAmount,
      description: `Предоплата за заказ #${orderId}`,
      category: "Advance Payment",
      status: "completed",
      order_id: orderId,
    });

    console.log("✅ Предоплата зафиксирована:", transaction);
    return transaction;
  } catch (error) {
    console.error("❌ Ошибка при добавлении предоплаты:", error);
    throw error;
  }
}
