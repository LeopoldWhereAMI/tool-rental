export async function payOrderExtensions({
  orderId,
  extensionId,
  amount,
  orderNumber,
}: {
  orderId: string;
  extensionId: string;
  amount: number;
  orderNumber: string | number;
}) {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "income",
      amount,
      description: `Оплата продления по заказу #${orderNumber}`,
      category: "OrderExtension",
      status: "completed",
      order_id: orderId,
      extension_id: extensionId,
    }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result;
}
