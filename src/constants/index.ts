export const DATE_LOCALE = "ru-RU";

export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

export const ITEMS_PER_PAGE = 10;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  all: "Все",
  active: "Активные",
  completed: "Завершенные",
  cancelled: "Отмененные",
};

export const ORDER_PAGE_TITLES: Record<string, string> = {
  all: "Все заказы",
  active: "Активные заказы",
  completed: "Завершенные заказы",
  cancelled: "Отмененные заказы",
};

// Мапа для отображения статусов инструмента
export const INVENTORY_STATUS_LABELS = {
  all: "Все",
  available: "Свободен",
  rented: "В аренде",
  maintenance: "На ремонте",
  reserved: "Забронирован",
};

export const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
