import { OrderInput } from "@/lib/validators/orderSchema";

export type Inventory = {
  id: string;
  created_at: string;
  name: string;
  category: string;
  daily_price: number;
  purchase_price: number;
  purchase_date: number;
  status: "available" | "rented" | "maintenance";
  quantity: number;
  notes: string;
  updated_at: string;
  serial_number: string;
  article: string;
  image_url?: string | null;
};

export type InventoryUI = Omit<Inventory, "purchase_date"> & {
  purchase_date: string | null; // ← СТРОКА
};

export type CreateOrderDTO = {
  inventory_id: string;
  client_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
};

export type CreateClientInput = {
  last_name: string;
  first_name: string;
  middle_name?: string;
  phone?: string;
};

export interface Client extends CreateClientInput {
  id: string;
  created_at: string;
}

export type OrderPrintData = OrderInput & {
  total_price: number;
  order_number?: number;
};

export interface OrderUI {
  id: string;
  order_number: string;
  status: string;
  total_price: number;
  start_date: string;
  end_date: string;
  inventory_id?: string;
  client_id?: string;
  // Вложенные объекты из Supabase (JOIN)
  client: {
    first_name: string;
    last_name: string;
    phone?: string;
  };
  inventory: {
    name: string;
    daily_price?: number;
    serial_number?: string;
    article?: string;
  };
}
