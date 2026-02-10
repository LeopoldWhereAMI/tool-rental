import { InventoryCreateInput } from "@/lib/validators/inventorySchema";

export type InventoryFormValues = InventoryCreateInput & { id?: string };
export type InventoryItemBase = {
  id: string;
  category: string;
  article: string;
};
