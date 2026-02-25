import { DATE_LOCALE, DATE_OPTIONS } from "@/constants";
import { calculateOrderTotal } from "@/services/orderService";
import { ClientWithOrders, OrderDetailsUI, OrderUI } from "@/types";
import { Fuel, PackageSearch, Package, Zap } from "lucide-react";
// export const inventoryListTitles = [
//   { id: "Артикул", text: "Артикул" },
//   { id: "Название", text: "инструмент" },
//   { id: "Все категории", text: "Все категории", filter: "select" },
//   { id: "Серийный номер", text: "Серийный номер" },
//   { id: "Статус", text: "Статус" },
//   { id: "Стоимость аренды", text: "Стоимость аренды" },
// ];

export const validateCategory = (value: string) => {
  let category = "";

  switch (value) {
    case "gas_tools":
      category = "Бензо";
      break;
    case "electric_tools":
      category = "Электро";
      break;
    // default:
    //   category = "Неизвестная категория";
    default:
      return "Инструмент";
  }
  return category;
};

// Функция для валидации статуса инструмента
export const validateStatus = (value: string) => {
  let status = "";

  switch (value) {
    case "available":
      status = "Свободен";
      break;
    case "rented":
      status = "В аренде";
      break;
    case "maintenance":
      status = "На ремонте";
      break;
    case "reserved":
      status = "Забронирован";
      break;
    default:
      status = "Свободен";
  }
  return status;
};

// Функция для валидации статуса заказа
export const validateOrderStatus = (status: string) => {
  switch (status) {
    case "active":
      return { text: "Активен", className: "statusActive" };
    case "completed":
      return { text: "Завершен", className: "statusCompleted" };
    case "cancelled":
      return { text: "Отменен", className: "statusCancelled" };
    default:
      return { text: status, className: "" };
  }
};

// Форматирование даты в читаемый вид
export const validateDate = (
  value: number | string | null | undefined,
): string => {
  if (!value) return "—";

  const date = typeof value === "number" ? new Date(value) : new Date(value);

  return isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString(DATE_LOCALE, DATE_OPTIONS);
};

// Форматирование цены инструмента в слова
export function priceToWords(n: number): string {
  if (!n) return "";
  if (n === 0) return "Ноль";

  const units = [
    "",
    "один",
    "два",
    "три",
    "четыре",
    "пять",
    "шесть",
    "семь",
    "восемь",
    "девять",
  ];
  const teens = [
    "десять",
    "одиннадцать",
    "двенадцать",
    "тринадцать",
    "четырнадцать",
    "пятнадцать",
    "шестнадцать",
    "семнадцать",
    "восемнадцать",
    "девятнадцать",
  ];
  const tens = [
    "",
    "",
    "двадцать",
    "тридцать",
    "сорок",
    "пятьдесят",
    "шестьдесят",
    "семьдесят",
    "восемьдесят",
    "девяносто",
  ];
  const hundreds = [
    "",
    "сто",
    "двести",
    "триста",
    "четыреста",
    "пятьсот",
    "шестьсот",
    "семьсот",
    "восемьсот",
    "девятьсот",
  ];

  const parts: string[] = [];

  // Логика для тысяч
  const thr = Math.floor(n / 1000);
  if (thr > 0) {
    if (thr >= 10 && thr <= 19) {
      parts.push(teens[thr - 10], "тысяч");
    } else {
      const t_tens = Math.floor(thr / 10);
      const t_units = thr % 10;
      if (t_tens > 0) parts.push(tens[t_tens]);

      if (t_units === 1) parts.push("одна тысяча");
      else if (t_units === 2) parts.push("две тысячи");
      else if (t_units >= 3 && t_units <= 4)
        parts.push(units[t_units], "тысячи");
      else if (t_units >= 5) parts.push(units[t_units], "тысяч");
      else if (t_units === 0 && t_tens > 0) parts.push("тысяч");
    }
  }

  // Логика для сотен, десятков и единиц
  const rest = n % 1000;
  if (rest > 0) {
    const h = Math.floor(rest / 100);
    const t = Math.floor((rest % 100) / 10);
    const u = rest % 10;

    if (h > 0) parts.push(hundreds[h]);

    if (t === 1) {
      parts.push(teens[u]);
    } else {
      if (t > 0) parts.push(tens[t]);
      if (u > 0) parts.push(units[u]);
    }
  }

  const result = parts.join(" ").replace(/\s+/g, " ").trim();
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Считает, сколько дней инструмент находится в базе (в эксплуатации)
 */
export const calculateDaysInWork = (
  createdAt: string | number | Date,
): number => {
  const start = new Date(createdAt);
  const now = new Date();

  // Разница в миллисекундах
  const diffTime = Math.abs(now.getTime() - start.getTime());

  // Перевод в дни
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

//
export const calculateDays = (start: string, end: string) => {
  const diff = new Date(end).getTime() - new Date(start).getTime();

  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const calculateItemTotal = (
  startDate: string,
  endDate: string,
  pricePerDay: number,
) => calculateDays(startDate, endDate) * pricePerDay;

// ордерформхелпер
type WatchedItem = {
  inventory_id: string;
  start_date?: string;
  end_date?: string;
};

type InventoryLike = {
  daily_price: number;
};

export function calcOrderTotalFromItems(
  items: WatchedItem[] | undefined,
  inventoryMap: Map<string, InventoryLike>,
): number {
  if (!items || items.length === 0) return 0;

  return items.reduce((acc, item) => {
    const tool = inventoryMap.get(item.inventory_id);

    if (!tool || !item.start_date || !item.end_date) {
      return acc;
    }

    const itemTotal = calculateOrderTotal(
      item.start_date,
      item.end_date,
      tool.daily_price,
    );

    const validItemTotal = isNaN(itemTotal) ? 0 : Math.max(0, itemTotal);

    return acc + validItemTotal;
  }, 0);
}

export const getActualEndDate = (order: OrderUI): string => {
  const itemDates = order.tools
    ? order.tools.map((t) => t.end_date).filter(Boolean)
    : [];

  if (itemDates.length > 0) {
    return itemDates.reduce((latest: string, current: string) =>
      new Date(current) > new Date(latest) ? current : latest,
    );
  }

  return order.end_date || "";
};

export const calculateReturnStatus = (endDate: string, status: string) => {
  // 1. Сначала проверяем, не завершен ли заказ
  if (status === "completed") {
    return { text: "Заказ завершён", type: "completed" };
  }

  // 2. Если данных о дате нет или статус не активен (и не завершен)
  if (status !== "active" || !endDate) {
    return { text: "—", type: "" };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `Просрочено: ${Math.abs(diffDays)} дн.`,
      type: "overdue",
    };
  } else if (diffDays === 0) {
    return { text: "Сегодня возврат", type: "today" };
  } else {
    return { text: `Осталось: ${diffDays} дн.`, type: "onTime" };
  }
};

//
interface DateRangeItem {
  start_date: string | Date;
  end_date: string | Date;
}

export const getOrderDateRange = (items: DateRangeItem[]) => {
  if (!items?.length) return { start: null, end: null };

  const starts = items.map((i) => i.start_date).filter(Boolean);
  const ends = items.map((i) => i.end_date).filter(Boolean);

  return {
    start: starts.length ? new Date(starts.sort()[0]) : null,
    end: ends.length ? new Date(ends.sort().reverse()[0]) : null,
  };
};

export function calculateFinalAmount(order: OrderDetailsUI) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Логика получения даты из твоих хелперов
  const endDate = new Date(order.actual_end_date || order.end_date);
  endDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - endDate.getTime();
  const overdueDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  if (overdueDays > 0) {
    const dailyRate =
      order.order_items?.reduce(
        (sum: number, item) => sum + (item.inventory?.daily_price || 0),
        0,
      ) || 0;

    return order.total_price + overdueDays * dailyRate;
  }

  return order.total_price;
}

// Функция для склонения (можно вынести в utils)
export const getOrderPlural = (count: number) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "заказов";
  if (lastDigit === 1) return "заказ";
  if (lastDigit >= 2 && lastDigit <= 4) return "заказа";
  return "заказов";
};

// лояльность клиентов

export type LoyaltyStatus = "VIP" | "REGULAR" | "NEW";

export const LOYALTY_THRESHOLDS = {
  VIP: 10,
  REGULAR: 3,
};

export const getLoyaltyInfo = (orderCount: number) => {
  if (orderCount >= LOYALTY_THRESHOLDS.VIP) {
    return {
      text: "VIP",
      className: "statusVip",
      variant: "VIP" as LoyaltyStatus,
    };
  }
  if (orderCount >= LOYALTY_THRESHOLDS.REGULAR) {
    return {
      text: "Постоянный",
      className: "statusRegular",
      variant: "REGULAR" as LoyaltyStatus,
    };
  }
  return {
    text: "Новый",
    className: "statusNew",
    variant: "NEW" as LoyaltyStatus,
  };
};

export const calculateClientStats = (clients: ClientWithOrders[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Начало периодов для сравнения
  const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
  const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);

  // 1. Фильтруем клиентов по дате регистрации
  const currentMonthClients = clients.filter(
    (c) => new Date(c.created_at) >= startOfCurrentMonth,
  );
  const lastMonthClients = clients.filter((c) => {
    const date = new Date(c.created_at);
    return date >= startOfLastMonth && date < startOfCurrentMonth;
  });

  // 2. Вспомогательная функция для расчета тренда (%)
  const getTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(1));
  };

  // --- ИТОГОВЫЕ РАСЧЕТЫ ---

  // Всего клиентов
  const total = clients.length;
  const totalAtStartOfCurrentMonth = total - currentMonthClients.length;
  const totalTrend = getTrend(total, totalAtStartOfCurrentMonth);

  // Активные (те, у кого есть активные заказы прямо сейчас)
  const active = clients.filter((c) =>
    c.orders?.some((order) => order.status === "active"),
  ).length;

  // Active Rate: Процент активных от общего числа клиентов (утилизация базы)
  const activeRate = total > 0 ? Math.round((active / total) * 100) : 0;

  // Новые клиенты (сравнение: текущий месяц vs прошлый)
  const newThisMonth = currentMonthClients.length;
  const newLastMonth = lastMonthClients.length;
  const newTrend = getTrend(newThisMonth, newLastMonth);

  return {
    total, // Всего
    totalTrend, // Рост базы за месяц в %
    active, // Активные сейчас (чел)
    activeRate, // % активных от всей базы
    newThisMonth, // Новые в этом месяце (чел)
    newTrend, // Динамика привлечения в %
  };
};
