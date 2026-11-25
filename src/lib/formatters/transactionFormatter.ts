import { Transaction as PrismaTransaction } from "@/generated/prisma/client";
import { Transaction } from "@/services/financeService";

export function formatTransaction(transaction: PrismaTransaction): Transaction {
  return {
    id: transaction.id,
    type: transaction.type as "income" | "expense",
    amount: Number(transaction.amount),
    description: transaction.description,
    category: transaction.category ?? undefined,
    status: transaction.status as "completed" | "cancelled",
    order_id: transaction.orderId ?? undefined,
    created_at: transaction.createdAt.toISOString(),
  };
}
