import { DATE_LOCALE, DATE_OPTIONS } from "@/constants";

export const inventoryListTitles = [
  { id: "Артикул", text: "Артикул" },
  { id: "Название", text: "Название" },
  { id: "Все категории", text: "Все категории", filter: "select" },
  { id: "Серийный номер", text: "Серийный номер" },
  { id: "Количество", text: "Количество" },
  { id: "Статус", text: "Статус" },
  { id: "Стоимость аренды", text: "Стоимость аренды" },
  // { id: "Дата покупки", text: "Дата покупки" },
  { id: "", text: "" },
];

export const validateCategory = (value: string) => {
  let category = "";

  switch (value) {
    case "gas_tools":
      category = "Бензоинструмент";
      break;
    case "electric_tools":
      category = "Электроинструмент";
      break;
    default:
      category = "Неизвестная категория";
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
  if (!value) return "-";

  const date = typeof value === "number" ? new Date(value) : new Date(value);

  return isNaN(date.getTime())
    ? "-"
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
