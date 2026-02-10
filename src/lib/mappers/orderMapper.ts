import { OrderInput } from "@/lib/validators/orderSchema";
import { calculateOrderTotal } from "@/services/orderService";
import { Inventory } from "@/types";
import { ContractItem, OrderPrintBundle, OrderDetailsUI } from "@/types";

//mapper for AddOrderForm
export function prepareOrderPayload(
  clientId: string,
  data: OrderInput,
  inventoryMap: Map<string, Inventory>,
) {
  const itemsForDb = data.items.map((item) => {
    const tool = inventoryMap.get(item.inventory_id);
    return {
      id: item.inventory_id,
      daily_price: tool?.daily_price || 0,
      start_date: item.start_date,
      end_date: item.end_date,
    };
  });

  const totalPrice = data.items.reduce((acc, item) => {
    const tool = inventoryMap.get(item.inventory_id);
    if (!tool) return acc;
    return (
      acc +
      calculateOrderTotal(item.start_date, item.end_date, tool.daily_price)
    );
  }, 0);

  return {
    client_id: clientId,
    total_price: totalPrice,
    items: itemsForDb,
  };
}

export function mapOrderToPrintBundle(
  data: OrderInput,
  inventoryMap: Map<string, Inventory>,
  savedOrder: { order_number?: string | number },
  recalculatedTotal: number,
): OrderPrintBundle {
  return {
    client: {
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name,
      phone: data.phone,
      passport_series: data.passport_series,
      passport_number: data.passport_number,
      issued_by: data.issued_by,
      issue_date: data.issue_date,
      registration_address: data.registration_address,
    },

    items: data.items
      .map((item) => {
        const tool = inventoryMap.get(item.inventory_id);
        if (!tool) return null;

        const contractItem: ContractItem = {
          id: tool.id,
          name: tool.name,
          serial_number: tool.serial_number,
          article: tool.article,
          start_date: item.start_date,
          end_date: item.end_date,
          price_at_time: tool.daily_price,
          daily_price: tool.daily_price,
          purchase_price: tool.purchase_price,
        };

        return contractItem;
      })
      .filter((item): item is ContractItem => item !== null),

    order: {
      total_price: recalculatedTotal,
      adjustment: 0,
      order_number: savedOrder.order_number
        ? Number(savedOrder.order_number)
        : undefined,
    },
  };
}

//mapper for OrderDetailsPage
export function mapOrderDetailsToPrint(
  order: OrderDetailsUI,
  passport: string[], // Данные из useWatch
  actualTotal: number, // Передаем итоговую сумму с учетом скидки
): OrderPrintBundle {
  const [series, number, issuedBy, issueDate, address] = passport;

  const adjustment = actualTotal - order.total_price;

  return {
    client: {
      first_name: order.client.first_name,
      last_name: order.client.last_name,
      middle_name: order.client.middle_name,
      phone: order.client.phone || "",
      passport_series: series,
      passport_number: number,
      issued_by: issuedBy,
      issue_date: issueDate,
      registration_address: address,
    },
    items: order.order_items.map((item) => ({
      id: item.inventory.id,
      name: item.inventory.name,
      serial_number: item.inventory.serial_number,
      article: item.inventory.article,
      start_date: item.start_date,
      end_date: item.end_date,
      price_at_time: item.price_at_time,
      daily_price: item.inventory.daily_price,
      purchase_price: item.inventory.purchase_price,
    })),
    order: {
      // total_price: order.total_price,
      total_price: actualTotal,
      order_number: order.order_number ? Number(order.order_number) : undefined,
      adjustment: adjustment,
    },
  };
}
