import { OrderInput, PassportInput } from "@/lib/validators/orderSchema";
import {
  ContractItem,
  InventoryMap,
  OrderDetailsUI,
  OrderPrintBundle,
  CreateOrderParams,
} from "@/types";

// ============================================
// mapOrderToPrintBundle — для новых заказов
// ============================================
export function mapOrderToPrintBundle(
  formData: OrderInput,
  inventoryMap: InventoryMap,
  savedOrder: { order_number: string | number },
  totalPrice: number,
): OrderPrintBundle {
  const contractItems: ContractItem[] = formData.items.map((item, index) => {
    const startDate = new Date(item.start_date);
    const endDate = new Date(item.end_date);
    const daysCount = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // КАСТОМНАЯ ПОЗИЦИЯ
    if (item.custom_name && item.custom_price !== undefined) {
      const itemPrice = item.custom_price * daysCount;

      return {
        id: `custom-${index}`,
        name: item.custom_name,
        start_date: item.start_date,
        end_date: item.end_date,
        price_at_time: itemPrice,
        daily_price: item.custom_price,
        is_custom: true,
        custom_description: item.custom_description,
      };
    }

    // ПОЗИЦИЯ ИЗ СКЛАДА
    const inventory = inventoryMap[item.inventory_id!];
    if (!inventory) {
      throw new Error(`Инструмент с ID ${item.inventory_id} не найден в базе`);
    }

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
      is_custom: false,
    };
  });

  const clientData: OrderPrintBundle["client"] = {
    client_type: formData.client_type,
    phone: formData.phone,
  };

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
      order_number: savedOrder.order_number
        ? Number(savedOrder.order_number)
        : undefined,
      start_date: formData.items[0]?.start_date,
      end_date: formData.items[formData.items.length - 1]?.end_date,
      security_deposit: formData.security_deposit,
    },
  };
}

// ============================================
// prepareOrderPayload — для создания заказа
// ============================================
export function prepareOrderPayload(
  clientId: string,
  formData: OrderInput,
  inventoryMap: InventoryMap,
): CreateOrderParams {
  const items: CreateOrderParams["items"] = formData.items.map(
    (item, index) => {
      // Кастомная позиция
      if (item.custom_name && item.custom_price !== undefined) {
        return {
          id: `custom-${index}`,
          daily_price: item.custom_price,
          start_date: item.start_date,
          end_date: item.end_date,
          is_custom: true,
          custom_name: item.custom_name,
        };
      }

      // Позиция из склада
      const inventory = inventoryMap[item.inventory_id!];
      if (!inventory) {
        throw new Error(`Инвентарь ${item.inventory_id} не найден`);
      }

      return {
        id: item.inventory_id!,
        daily_price: inventory.daily_price,
        start_date: item.start_date,
        end_date: item.end_date,
      };
    },
  );

  // Расчёт total_price
  const rentalTotal = formData.items.reduce((sum, item) => {
    const s = new Date(item.start_date);
    const e = new Date(item.end_date);
    const days =
      Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) || 1;

    if (item.custom_name && item.custom_price !== undefined) {
      return sum + item.custom_price * days;
    }

    const inv = inventoryMap[item.inventory_id!];
    return sum + (inv?.daily_price || 0) * days;
  }, 0);

  return {
    client_id: clientId,
    items,
    total_price: rentalTotal,
    security_deposit: formData.security_deposit || null,
  };
}

// ============================================
// mapOrderDetailsToPrint — для существующих заказов
// ============================================
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
    phone: client.phone || undefined,
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

  // ✅ Поддержка кастомных позиций из БД
  const contractItems: ContractItem[] = order.order_items.map((item) => {
    if (item.is_custom) {
      return {
        id: item.id,
        name: item.custom_name || "Дополнительная услуга",
        start_date: item.start_date,
        end_date: item.end_date,
        price_at_time: item.price_at_time,
        daily_price: item.price_at_time,
        is_custom: true,
      };
    }

    if (!item.inventory) {
      throw new Error(`Инструмент для позиции ${item.id} не найден`);
    }

    return {
      id: item.inventory.id,
      name: item.inventory.name,
      serial_number: item.inventory.serial_number,
      article: item.inventory.article,
      start_date: item.start_date,
      end_date: item.end_date,
      price_at_time: item.price_at_time,
      purchase_price: item.inventory.purchase_price,
      daily_price: item.inventory.daily_price,
      is_custom: false,
    };
  });

  return {
    client: clientBundle,
    items: contractItems,
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
