// ============================================================================
// ***1. Базовые сущности***
// ============================================================================

// Основной тип инвентарной единицы (инструмента)
export type Inventory = {
  id: string;
  created_at: string;
  name: string;
  category: string;
  daily_price: number;
  purchase_price: number;
  purchase_date: number;
  status: "available" | "rented" | "maintenance";
  notes: string;
  updated_at: string;
  serial_number: string;
  article: string;
  image_url?: string | null;
  work_days_count: number;
  total_work_days: number;
  maintenance_interval_days: number;
  last_maintenance_date: string | null;
};

export type InventoryMap = Record<string, Inventory>;

// ============================================================================
// ✅ ИСПРАВЛЕННАЯ СТРУКТУРА КЛИЕНТОВ
// ============================================================================

// 1️⃣ Базовый интерфейс — ОБЩИЕ ПОЛЯ для всех клиентов
export interface ClientBase {
  id: string;
  created_at: string;
  is_blacklisted: boolean;
  blacklist_reason: string;
  phone?: string | null;
  client_type: "individual" | "legal"; // ✅ НЕ optional!
}

// 2️⃣ Физическое лицо — расширяет базовый тип
export interface IndividualClient extends ClientBase {
  client_type: "individual"; // ✅ Скрепляет тип
  first_name: string | null;
  last_name: string | null;
  middle_name?: string | null;
  passport_series?: string | null;
  passport_number?: string | null;
  issued_by?: string | null;
  issue_date?: string | null;
  registration_address?: string | null;
}

// 3️⃣ Юридическое лицо — расширяет базовый тип
export interface LegalClient extends ClientBase {
  client_type: "legal"; // ✅ Скрепляет тип
  company_name: string | null;
  inn: string | null; // 12 символов
  kpp?: string | null; // 9 символов
  ogrn?: string | null; // 15 символов
  legal_address: string | null;
}

// 4️⃣ Union-тип: ВСЕГДА либо Physical, либо Legal
export type Client = IndividualClient | LegalClient;

// ============================================================================
// ***2. Интерфейсы для страниц и компонентов (UI Layer)***
// ============================================================================

// Тот же Inventory, но с датой в виде строки для удобного отображения в input/тексте
export type InventoryUI = Omit<Inventory, "purchase_date"> & {
  purchase_date: string | null;
};

// ✅ Обновлён ClientPreview для совместимости с Client
export type ClientPreview = {
  id: string;
  phone?: string | null;
  client_type: "individual" | "legal";
  display_name: string; // "Фамилия Имя" для физ.лиц или "Компания" для юр.лиц
};

// Краткая информация о заказе для списков и таблиц
export interface OrderUI {
  id: string;
  order_number: string;
  status: string;
  total_price: number;
  start_date: string;
  end_date: string;
  actual_end_date?: string | null;
  inventory_id?: string;
  client_id?: string;
  security_deposit?: number | null;
  client: ClientPreview; // ✅ Теперь совместимо
  tools?: Array<{
    id: string;
    name: string;
    image_url?: string | null;
    serial_number?: string;
    price_at_time?: number;
    start_date: string;
    end_date: string;
  }>;
  inventory: {
    name: string;
    image_url?: string | null;
    daily_price?: number;
    serial_number?: string;
    article?: string;
  };
}

// Расширенная информация для страницы "Детали заказа"
export interface OrderDetailsUI extends Omit<OrderUI, "client"> {
  created_at: string;
  notes?: string;
  order_items: OrderItemDetailed[];
  tools: OrderTool[];
  client: Client; // ✅ Полный тип клиента (Individual | Legal)
}

// Вспомогательный тип: Инструмент внутри заказа со всеми данными + условиями аренды
export interface OrderTool extends Inventory {
  price_at_time: number;
  start_date: string;
  end_date: string;
}

// Финальный результат функции getOrderById (самый полный тип заказа)
export interface DetailedOrderResponse extends Omit<
  OrderDetailsUI,
  "inventory" | "tools"
> {
  inventory: Inventory | null;
  tools: OrderTool[];
}

// Тип клиента, включающий список его заказов (для профиля клиента)
export type ClientWithOrders = Client & {
  orders?: OrderUI[];
};

// История заказов для инструмента
export interface RentalHistoryItem {
  id: string;
  order_id: string | undefined;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string | undefined;
  client_name: string;
}

// Интерфейс для OrderDetailsPage
export interface OrderItemDetailed {
  id: string;
  start_date: string;
  end_date: string;
  price_at_time: number;
  inventory: Inventory;
  item_status: "active" | "returned";
  actual_return_date: string | null;
}

export type OrderStatusSource = {
  start_date: string;
  end_date: string;
  status: string;
  actual_end_date?: string | null;
};

// ============================================================================
// ***3. Типы для API и операций (DTO - Data Transfer Objects)***
// ============================================================================

// ✅ НОВАЯ СТРУКТУРА: Отдельные типы для СОЗДАНИЯ клиентов
// (без id и служебных полей)

export type CreateIndividualInput = {
  client_type: "individual";
  phone?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  passport_series?: string;
  passport_number?: string;
  issued_by?: string;
  issue_date?: string;
  registration_address?: string;
};

export type CreateLegalInput = {
  client_type: "legal";
  phone?: string;
  company_name: string;
  inn: string; // 12 символов
  kpp?: string; // 9 символов
  ogrn?: string; // 15 символов
  legal_address: string;
};

// Объединенный тип для создания любого типа клиента
export type CreateClientInput = CreateIndividualInput | CreateLegalInput;

// ============================================================================
// ***4. Типы для заказов***
// ============================================================================

export interface CreateOrderParams {
  client_id: string;
  total_price: number;
  security_deposit: number | null;
  items: {
    id: string;
    daily_price: number;
    start_date: string;
    end_date: string;
  }[];
}

export interface SupabaseOrderRow {
  id: string;
  order_number: string;
  status: string;
  total_price: number;
  start_date: string;
  end_date: string;
  created_at: string;
  client: Client; // ✅ Теперь правильный тип
  order_items: {
    id: string;
    price_at_time: number;
    start_date: string;
    end_date: string;
    item_status: "active" | "returned";
    actual_return_date: string | null;
    inventory: Inventory;
  }[];
}

export interface SupabaseAllOrdersRow {
  id: string;
  total_price: number;
  start_date: string;
  end_date: string;
  order_number: string;
  status: string;
  client: {
    id: string;
    last_name?: string;
    first_name?: string;
    middle_name?: string;
    company_name?: string | null;
    phone?: string;
    client_type?: "individual" | "legal";
  } | null;
  order_items: {
    id: string;
    price_at_time: number;
    start_date: string;
    end_date: string;
    inventory: {
      id: string;
      name: string;
      serial_number: string;
      image_url: string | null;
    } | null;
  }[];
}

export interface OrderItemResponse {
  id: string;
  price_at_time: number;
  start_date: string;
  end_date: string;
  orders: {
    id: string;
    status: string;
    clients: Client | null; // ✅ Используем правильный Client тип
  } | null;
}

// ============================================================================
// ***5. Типы для печати документов***
// ============================================================================

// Полный пакет данных для печати договора
export type OrderPrintBundle = {
  client: {
    client_type: "individual" | "legal";
    phone?: string;
    // Для физического лица
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    passport_series?: string;
    passport_number?: string;
    issued_by?: string;
    issue_date?: string;
    registration_address?: string;
    // Для юридического лица
    company_name?: string;
    inn?: string;
    kpp?: string;
    ogrn?: string;
    legal_address?: string;
  };
  items: ContractItem[];
  order: {
    total_price: number;
    order_number?: number;
    start_date?: string;
    end_date?: string;
    adjustment?: number;
    security_deposit?: number;
  };
};

// Позиция в печатном договоре
export type ContractItem = {
  id: string;
  name: string;
  serial_number?: string;
  article?: string;
  start_date: string;
  end_date: string;
  price_at_time: number;
  purchase_price?: number;
  daily_price?: number;
};

// Данные клиента и заказа для шаблона контракта
export type ContractOrderData = {
  total_price: number;
  order_number?: number;
  adjustment?: number;
  security_deposit?: number;
} & CreateClientInput;

// ============================================================================
// ***6. Типы для аутентификации и профилей***
// ============================================================================

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

export type ViewMode = "table" | "cards";

// Базовая структура подсказки
interface DaDataSuggestion<T> {
  value: string;
  unrestricted_value: string;
  data: T;
}

// Тип для адреса (можно расширить при необходимости)
interface AddressData {
  postal_code?: string;
  country?: string;
  city?: string;
  // ... другие поля от DaData
}

// Тип для подразделения ФМС
interface FmsUnitData {
  code?: string;
  name?: string;
  region?: string;
}

export type AddressSuggestion = DaDataSuggestion<AddressData>;
export type FmsSuggestion = DaDataSuggestion<FmsUnitData>;
