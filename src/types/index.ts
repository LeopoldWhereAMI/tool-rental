// ***1. Базовые сущности***

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
  maintenance_interval_days: number;
  last_maintenance_date: string | null;
};

// Базовый тип клиента
export interface Client extends CreateClientInput {
  id: string;
  created_at: string;
  issued_by?: string;
  issue_date?: string;
  is_blacklisted: boolean;
  blacklist_reason: string;
}

// ***2. Интерфейсы для страниц и компонентов (UI Layer)***

// // Тот же Inventory, но с датой в виде строки для удобного отображения в input/тексте
export type InventoryUI = Omit<Inventory, "purchase_date"> & {
  purchase_date: string | null;
};

export type ClientPreview = Pick<
  Client,
  "id" | "last_name" | "first_name" | "middle_name" | "phone"
>;

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
  // client: Client;
  client: ClientPreview;
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
  order_items: OrderItemDetailed[];
  tools: OrderTool[];
  client: Client; // ← вот тут возвращаем полный тип
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
export interface ClientWithOrders extends Client {
  orders?: OrderUI[];
}

// история заказаов для инструмента
export interface RentalHistoryItem {
  id: string;
  order_id: string | undefined;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string | undefined;
  client_name: string;
}

// интерфейс для OrderDetailsPage
interface OrderItemDetailed {
  id: string;
  start_date: string;
  end_date: string;
  price_at_time: number;
  inventory: Inventory;
}

// ***3. Типы для API и операций (DTO - Data Transfer Objects)***

// Данные для регистрации нового клиента
export type CreateClientInput = {
  last_name: string;
  first_name: string;
  middle_name?: string;
  phone?: string;
};

// ***4. Типы для печати документов***

// Полный пакет данных для печати договора
export type OrderPrintBundle = {
  client: {
    first_name: string;
    last_name: string;
    middle_name?: string;
    phone?: string;

    passport_series?: string;
    passport_number?: string;
    issued_by?: string;
    issue_date?: string;
    registration_address?: string;
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
//

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
  last_name: string;
  first_name: string;
  middle_name?: string;

  phone?: string;

  passport_series?: string;
  passport_number?: string;
  issued_by?: string;
  issue_date?: string;
  registration_address?: string;
};

// user

export interface AuthUser {
  id: string;
  email: string | undefined;
  user_metadata: Record<string, unknown>;
  aud: string;
  created_at: string;
  updated_at?: string;
  last_sign_in_at?: string;
  is_super_admin?: boolean;
  role?: string;
  factors?: unknown[];
  identities?: unknown[];
  phone?: string;
  confirmed_at?: string;
  email_confirmed_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
  role: "admin" | "user";
  status: "active" | "inactive";
}

export type ViewMode = "table" | "cards";
