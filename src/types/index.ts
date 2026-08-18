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

export interface ClientBase {
  id: string;
  created_at: string;
  is_blacklisted: boolean;
  blacklist_reason: string;
  phone?: string | null;
  client_type: "individual" | "legal";
}

export interface IndividualClient extends ClientBase {
  client_type: "individual"; //
  first_name: string | null;
  last_name: string | null;
  middle_name?: string | null;
  passport_series?: string | null;
  passport_number?: string | null;
  issued_by?: string | null;
  issue_date?: string | null;
  registration_address?: string | null;
}

export interface LegalClient extends ClientBase {
  client_type: "legal";
  company_name: string | null;
  inn: string | null;
  kpp?: string | null;
  ogrn?: string | null;
  legal_address: string | null;
}

export type Client = IndividualClient | LegalClient;

export type InventoryUI = Omit<Inventory, "purchase_date"> & {
  purchase_date: string | null;
};

export type ClientPreview = {
  id: string;
  phone?: string | null;
  client_type: "individual" | "legal";
  display_name: string;
};

export interface OrderUI {
  id: string;
  order_number: string;
  status: string;
  total_price: number;
  start_date: string;
  end_date: string;
  actual_end_date?: string | null;

  client?: ClientPreview;

  items?: {
    startDate: string;
    endDate: string;
  }[];

  tools?: Array<{
    id: string;
    name: string;
    image_url?: string | null;
    serial_number?: string;
    price_at_time?: number;
    start_date: string;
    end_date: string;
  }>;

  inventory?: {
    name: string;
    image_url?: string | null;
    daily_price?: number;
    serial_number?: string;
    article?: string;
  };
}

export interface OrderExtensionUI {
  id: string;
  order_item_id: string;
  days: number;
  amount: number;
  paid_amount: number;
  created_at: string;
}

export interface OrderDetailsUI extends Omit<OrderUI, "client"> {
  created_at: string;
  notes?: string;
  security_deposit?: number | null;
  order_items: OrderItemDetailed[];
  tools: OrderTool[];
  client: Client;

  extensions: OrderExtensionUI[];
}

export interface OrderTool extends Inventory {
  price_at_time: number;
  start_date: string;
  end_date: string;
}

export interface DetailedOrderResponse extends Omit<
  OrderDetailsUI,
  "inventory" | "tools"
> {
  inventory: Inventory | null;
  tools: OrderTool[];
}

export type ClientWithOrders = Client & {
  orders?: OrderUI[];
};

export interface RentalHistoryItem {
  id: string;
  order_id: string | undefined;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string | undefined;
  client_name: string;
}

export interface OrderItemDetailed {
  id: string;
  start_date: string;
  end_date: string;
  price_at_time: number;
  inventory: Inventory | null;
  item_status: "active" | "returned";
  actual_return_date: string | null;
  is_custom?: boolean;
  custom_name?: string | null;
}

export type OrderStatusSource = {
  start_date: string;
  end_date: string;
  status: string;
  actual_end_date?: string | null;
};

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
  inn: string;
  kpp?: string;
  ogrn?: string;
  legal_address: string;
};

export type CreateClientInput = CreateIndividualInput | CreateLegalInput;

export interface CreateOrderParams {
  client_id: string;
  total_price: number;
  security_deposit: number | null;
  items: {
    id: string;
    daily_price: number;
    start_date: string;
    end_date: string;
    is_custom?: boolean;
    custom_name?: string;
    total_price?: number;
  }[];
}

export type WatchedItem = {
  inventory_id?: string;
  custom_name?: string;
  custom_price?: number;
  custom_description?: string;
  start_date: string;
  end_date: string;
};

export interface OrderItemResponse {
  id: string;
  price_at_time: number;
  total_price?: number | null;
  start_date: string;
  end_date: string;
  orders: {
    id: string;
    status: string;
    clients: Client | null;
  } | null;
}

export type OrderPrintBundle = {
  client: {
    client_type: "individual" | "legal";
    phone?: string;

    first_name?: string;
    last_name?: string;
    middle_name?: string;
    passport_series?: string;
    passport_number?: string;
    issued_by?: string;
    issue_date?: string;
    registration_address?: string;

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

export type ContractItem = {
  id: string;

  name: string;

  serial_number?: string | null;
  article?: string | null;

  start_date: string;
  end_date: string;

  price_at_time: number;

  purchase_price?: number;
  daily_price?: number;

  is_custom?: boolean;

  custom_name?: string | null;
  custom_description?: string | null;
};

export type ContractOrderData = {
  total_price: number;
  order_number?: number;
  adjustment?: number;
  security_deposit?: number;

  client_type: "individual" | "legal";

  first_name?: string;
  last_name?: string;
  middle_name?: string;

  passport_series?: string;
  passport_number?: string;
  issued_by?: string;
  issue_date?: string;
  registration_address?: string;

  company_name?: string;
  inn?: string;
  kpp?: string;
  ogrn?: string;
  legal_address?: string;

  phone?: string;
};

export type UserProfile = {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  updatedAt: Date;
};

export type ViewMode = "table" | "cards";

interface DaDataSuggestion<T> {
  value: string;
  unrestricted_value: string;
  data: T;
}

interface AddressData {
  postal_code?: string;
  country?: string;
  city?: string;
}

interface FmsUnitData {
  code?: string;
  name?: string;
  region?: string;
}

export type AddressSuggestion = DaDataSuggestion<AddressData>;
export type FmsSuggestion = DaDataSuggestion<FmsUnitData>;
