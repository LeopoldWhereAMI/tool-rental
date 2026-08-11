export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category?: string;
  status: "completed" | "cancelled";
  order_id?: string;
  created_at: string;
}

export interface FinanceStats {
  currentBalance: number;
  dailyRevenue: number;
  monthlyProfit: number;
  trendPercent?: number;
  companyIncomePercent: number;
}

export interface YearlyData {
  month: number;
  income: number;
  expense: number;
  profit: number;
}

export async function getDashboardData(
  year: number,
): Promise<{ stats: FinanceStats; yearlyData: YearlyData[] }> {
  const response = await fetch(`/api/transactions/dashboard?year=${year}`);

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

export async function getTransactions(
  page: number = 1,
  pageSize: number = 10,
  type?: "income" | "expense",
  orderId?: string,
): Promise<{ transactions: Transaction[]; total: number }> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (type) {
    params.set("type", type);
  }

  if (orderId) {
    params.set("orderId", orderId);
  }

  const response = await fetch(`/api/transactions?${params.toString()}`);

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

export async function searchTransactions(
  query: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<{ transactions: Transaction[]; total: number }> {
  const params = new URLSearchParams({
    query,
    page: String(page),
    pageSize: String(pageSize),
  });

  const response = await fetch(`/api/transactions/search?${params.toString()}`);

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

export async function createTransaction(
  transaction: Omit<Transaction, "id" | "created_at">,
): Promise<Transaction> {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

export async function updateTransactionStatus(
  id: string,
  status: "completed" | "cancelled",
): Promise<Transaction> {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

export async function getCategoryStats(): Promise<
  { category: string; amount: number; type: string }[]
> {
  const response = await fetch("/api/transactions/categories");

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

/**
 * Создание запроса на вывод средств
 * @param amount - Сумма к выводу
 * @param remarks - Дополнительные примечания (опционально)
 */
export async function createWithdrawRequest(
  amount: number,
  remarks?: string,
): Promise<Transaction> {
  if (amount <= 0) {
    throw new Error("Сумма должна быть больше нуля");
  }

  const description = remarks
    ? `Вывод средств: ${remarks.trim()}`
    : "Вывод из кассы";

  return createTransaction({
    type: "expense",
    amount,
    description,
    category: "Withdraw",
    status: "completed",
  });
}
