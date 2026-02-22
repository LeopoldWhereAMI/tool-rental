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
  client: Client;
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
export interface OrderDetailsUI extends OrderUI {
  created_at: string;
  order_items: OrderItemDetailed[];
  tools: OrderTool[]; // 🔥 переопределяем более полным типом
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
  // inventory: {
  //   id: string;
  //   name: string;
  //   serial_number?: string;
  //   article?: string;
  //   daily_price?: number;
  //   category?: string;
  //   status?: string;
  //   purchase_price?: number;
  // };
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
