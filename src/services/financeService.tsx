import { supabase } from "@/lib/supabase/supabase";

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
  month_index: number;
  income: number;
}

export async function getDashboardData(
  year: number,
): Promise<{ stats: FinanceStats; yearlyData: YearlyData[] }> {
  try {
    const month = new Date().getMonth() + 1;
    const { data, error } = await supabase.rpc("get_finance_dashboard_data", {
      p_year: year,
      p_month: month,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Ошибка получения данных дашборда:", error);
    throw error;
  }
}

export async function getTransactions(
  page: number = 1,
  pageSize: number = 10,
  type?: "income" | "expense",
): Promise<{ transactions: Transaction[]; total: number }> {
  try {
    const start = (page - 1) * pageSize;

    let query = supabase
      .from("transactions")
      .select("*", { count: "exact" })
      .in("status", ["completed", "cancelled"])
      .order("created_at", { ascending: false });

    if (type) {
      query = query.eq("type", type);
    }

    const { data, count, error } = await query.range(
      start,
      start + pageSize - 1,
    );

    if (error) throw error;

    return {
      transactions: (data || []) as Transaction[],
      total: count || 0,
    };
  } catch (error) {
    console.error("Ошибка получения транзакций:", error);
    throw error;
  }
}

export async function searchTransactions(
  query: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<{ transactions: Transaction[]; total: number }> {
  try {
    const start = (page - 1) * pageSize;

    const { data, count, error } = await supabase
      .from("transactions")
      .select("*", { count: "exact" })
      .ilike("description", `%${query}%`)
      .order("created_at", { ascending: false })
      .range(start, start + pageSize - 1);

    if (error) throw error;

    return {
      transactions: (data || []) as Transaction[],
      total: count || 0,
    };
  } catch (error) {
    console.error("Ошибка поиска транзакций:", error);
    throw error;
  }
}

/**
 * Добавление новой транзакции
 */
export async function createTransaction(
  transaction: Omit<Transaction, "id" | "created_at">,
): Promise<Transaction> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert([transaction])
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  } catch (error) {
    console.error("Ошибка добавления транзакции:", error);
    throw error;
  }
}

/**
 * Обновление статуса транзакции
 */
export async function updateTransactionStatus(
  id: string,
  status: "completed" | "cancelled",
): Promise<Transaction> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  } catch (error) {
    console.error("Ошибка обновления транзакции:", error);
    throw error;
  }
}

/**
 * Получение статистики по категориям
 */
export async function getCategoryStats(): Promise<
  { category: string; amount: number; type: string }[]
> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("category, type, amount")
      .eq("status", "completed");

    if (error) throw error;

    const stats = new Map<string, number>();
    (data || []).forEach((item) => {
      const key = `${item.category}-${item.type}`;
      stats.set(key, (stats.get(key) || 0) + item.amount);
    });

    return Array.from(stats).map(([key, amount]) => {
      const [category, type] = key.split("-");
      return { category, amount, type };
    });
  } catch (error) {
    console.error("Ошибка получения статистики категорий:", error);
    throw error;
  }
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
  try {
    // Проверяем валидность суммы
    if (amount <= 0) {
      throw new Error("Сумма должна быть больше нуля");
    }

    // Создаем описание (объединяем причину и примечание)
    const description = remarks
      ? `Вывод средств: ${remarks.trim()}`
      : "Вывод из кассы";

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          type: "expense",
          amount: amount,
          description: description,
          category: "Withdraw",
          status: "completed",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data as Transaction;
  } catch (error) {
    console.error("❌ Ошибка при создании запроса на вывод:", error);
    throw error;
  }
}
