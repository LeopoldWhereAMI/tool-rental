import { OrderInput, PassportInput } from "@/lib/validators/orderSchema";
import {
  ContractItem,
  InventoryMap,
  OrderDetailsUI,
  OrderPrintBundle,
} from "@/types";

/**
 * Подготавливает данные заказа к отправке на сервер
 * ✅ ИСПРАВЛЕНО: структура items совпадает с CreateOrderParams
 */
// export function prepareOrderPayload(
//   clientId: string,
//   formData: OrderInput,
//   inventoryMap: InventoryMap,
// ) {
//   const items = formData.items.map((item) => {
//     const inventory = inventoryMap[item.inventory_id];
//     if (!inventory) {
//       throw new Error(`Инвентарь ${item.inventory_id} не найден`);
//     }

//     const startDate = new Date(item.start_date);
//     const endDate = new Date(item.end_date);
//     const daysCount = Math.ceil(
//       (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
//     );
//     const itemPrice = inventory.daily_price * daysCount;

//     return {
//       id: item.inventory_id,
//       daily_price: itemPrice,
//       start_date: item.start_date,
//       end_date: item.end_date,
//     };
//   });

//   const rentalTotal = items.reduce((sum, item) => sum + item.daily_price, 0);
//   const totalPrice = rentalTotal + (formData.security_deposit || 0);

//   return {
//     client_id: clientId,
//     items: items,
//     total_price: totalPrice,
//     rental_total: rentalTotal,
//     security_deposit: formData.security_deposit || null,
//   };
// }

export function prepareOrderPayload(
  clientId: string,
  formData: OrderInput,
  inventoryMap: InventoryMap,
) {
  const items = formData.items.map((item) => {
    const inventory = inventoryMap[item.inventory_id];
    if (!inventory) {
      throw new Error(`Инвентарь ${item.inventory_id} не найден`);
    }

    // Нам больше не нужно считать daysCount здесь для каждого айтема,
    // если мы просто хотим сохранить суточную цену.

    return {
      id: item.inventory_id,
      daily_price: inventory.daily_price, // ✅ ТЕПЕРЬ ПЕРЕДАЕМ ЦЕНУ ЗА 1 СУТКИ
      start_date: item.start_date,
      end_date: item.end_date,
    };
  });

  // Для расчета общего total_price в заголовке заказа (rental_total)
  // нам всё же нужно перемножить цену на дни:
  const rentalTotal = formData.items.reduce((sum, item) => {
    const inv = inventoryMap[item.inventory_id];
    const s = new Date(item.start_date);
    const e = new Date(item.end_date);
    const days =
      Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    return sum + (inv?.daily_price || 0) * days;
  }, 0);

  // const totalPrice = rentalTotal + (formData.security_deposit || 0);
  const totalPrice = rentalTotal;

  return {
    client_id: clientId,
    items: items,
    total_price: totalPrice,
    rental_total: rentalTotal,
    security_deposit: formData.security_deposit || null,
  };
}

/**
 * Преобразует данные заказа в формат для печати (используется при создании нового заказа)
 */
export function mapOrderToPrintBundle(
  formData: OrderInput,
  inventoryMap: InventoryMap,
  savedOrder: { order_number: string | number },
  totalPrice: number,
): OrderPrintBundle {
  const contractItems: ContractItem[] = formData.items
    .filter((item) => item.inventory_id)
    .map((item) => {
      const inventory = inventoryMap[item.inventory_id];

      if (!inventory) {
        throw new Error(
          `Инструмент с ID ${item.inventory_id} не найден в базе`,
        );
      }

      const startDate = new Date(item.start_date);
      const endDate = new Date(item.end_date);
      const daysCount = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const itemPrice = inventory.daily_price * daysCount;

      return {
        id: inventory.id,
        name: inventory.name,
        serial_number: inventory.serial_number,
        article: inventory.article,
        start_date: item.start_date,
        end_date: item.end_date,
        price_at_time: itemPrice,
        purchase_price: inventory.purchase_price,
        daily_price: inventory.daily_price,
      };
    });

  // Инициализируем клиента. Тип Partial помогает избежать ошибок при наполнении.
  const clientData: OrderPrintBundle["client"] = {
    client_type: formData.client_type,
    phone: formData.phone,
  };

  // Type Guarding для Discriminated Union из вашей схемы Zod/Types
  if (formData.client_type === "individual") {
    clientData.first_name = formData.first_name;
    clientData.last_name = formData.last_name;
    clientData.middle_name = formData.middle_name;
    clientData.passport_series = formData.passport_series;
    clientData.passport_number = formData.passport_number;
    clientData.issued_by = formData.issued_by;
    clientData.issue_date = formData.issue_date;
    clientData.registration_address = formData.registration_address;
  } else if (formData.client_type === "legal") {
    clientData.company_name = formData.company_name;
    clientData.inn = formData.inn;
    clientData.kpp = formData.kpp;
    clientData.ogrn = formData.ogrn;
    clientData.legal_address = formData.legal_address;
  }

  return {
    client: clientData,
    items: contractItems,
    order: {
      total_price: totalPrice,
      // Преобразуем order_number в число для соответствия OrderPrintBundle.order.order_number
      order_number: savedOrder.order_number
        ? Number(savedOrder.order_number)
        : undefined,
      start_date: formData.items[0]?.start_date,
      end_date: formData.items[formData.items.length - 1]?.end_date,
      security_deposit: formData.security_deposit,
    },
  };
}

function nullToUndefined<T>(value: T | null | undefined): T | undefined {
  return value === null ? undefined : value;
}

type PassportWatchArray = [string?, string?, string?, string?, string?];

export function mapOrderDetailsToPrint(
  order: OrderDetailsUI,
  passport: PassportInput | PassportWatchArray,
  totalPrice: number,
  adjustment: number = 0,
): OrderPrintBundle {
  const p = Array.isArray(passport)
    ? {
        passport_series: passport[0],
        passport_number: passport[1],
        issued_by: passport[2],
        issue_date: passport[3],
        registration_address: passport[4],
      }
    : passport;

  const client = order.client;

  const clientBundle: OrderPrintBundle["client"] = {
    client_type: client.client_type,
    phone: client.phone || undefined, // Убираем null, если он есть
    ...p,
  };

  if (client.client_type === "individual") {
    clientBundle.first_name = nullToUndefined(client.first_name);
    clientBundle.last_name = nullToUndefined(client.last_name);
    clientBundle.middle_name = nullToUndefined(client.middle_name);
  } else if (client.client_type === "legal") {
    clientBundle.company_name = nullToUndefined(client.company_name);
    clientBundle.inn = nullToUndefined(client.inn);
    clientBundle.kpp = nullToUndefined(client.kpp);
    clientBundle.ogrn = nullToUndefined(client.ogrn);
    clientBundle.legal_address = nullToUndefined(client.legal_address);
  }

  return {
    client: clientBundle,
    items: order.order_items.map((item) => ({
      id: item.inventory.id,
      name: item.inventory.name,
      serial_number: item.inventory.serial_number,
      article: item.inventory.article,
      start_date: item.start_date,
      end_date: item.end_date,
      price_at_time: item.price_at_time,
      purchase_price: item.inventory.purchase_price,
      daily_price: item.inventory.daily_price,
    })),
    order: {
      total_price: totalPrice,
      order_number: order.order_number ? Number(order.order_number) : undefined,
      start_date: order.order_items[0]?.start_date,
      end_date: order.order_items[order.order_items.length - 1]?.end_date,
      security_deposit: order.security_deposit ?? undefined,
      adjustment: adjustment,
    },
  };
}
