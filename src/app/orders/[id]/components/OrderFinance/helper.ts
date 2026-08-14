import { OrderDetailsUI } from "@/types";

export function calculateUnpaidExtensions(
  extensions: OrderDetailsUI["extensions"],
) {
  return extensions.reduce(
    (sum, extension) => sum + (extension.amount - extension.paid_amount),
    0,
  );
}
