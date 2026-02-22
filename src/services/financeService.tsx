import { supabase } from "@/lib/supabase";

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
}

export interface YearlyData {
  month_index: number;
  income: number;
}

export async function getFinanceStats(): Promise<FinanceStats> {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // 1. Текущий баланс (все время)
    const { data: balanceData, error: balanceError } = await supabase.rpc(
      "get_current_balance",
    );
    if (balanceError) throw balanceError;

    // 2. Дневной доход (сегодня)
    const { data: dailyData, error: dailyError } = await supabase.rpc(
      "get_daily_revenue",
      { p_date: now.toISOString().split("T")[0] },
    );
    if (dailyError) throw dailyError;

    // 3. Прибыль текущего месяца
    const { data: monthlyData, error: monthlyError } = await supabase.rpc(
      "get_monthly_profit",
      { p_year: currentYear, p_month: currentMonth },
    );
    if (monthlyError) throw monthlyError;

    // 4. Прибыль ПРОШЛОГО месяца (для расчета тренда)
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const { data: prevMonthlyData } = await supabase.rpc("get_monthly_profit", {
      p_year: lastMonthDate.getFullYear(),
      p_month: lastMonthDate.getMonth() + 1,
    });

    // Расчет процента тренда
    const current = monthlyData || 0;
    const previous = prevMonthlyData || 0;
    let trend = 0;

    if (previous > 0) {
      trend = Math.round(((current - previous) / previous) * 100);
    } else if (current > 0 && previous === 0) {
      trend = 100; // Если в прошлом месяце было 0, а сейчас есть доход
    }

    return {
      currentBalance: balanceData || 0,
      dailyRevenue: dailyData || 0,
      monthlyProfit: current,
      trendPercent: trend,
    };
  } catch (error) {
    console.error("Ошибка получения финансовой статистики:", error);
    throw error;
  }
} /**
 * Получение истории транзакций с пагинацией
 */
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

/**
 * Поиск транзакций по описанию
 */
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

export async function getYearlyReport(year: number) {
  try {
    const { data, error } = await supabase.rpc("get_yearly_stats", {
      p_year: year,
    });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Ошибка получения годового отчета:", error);
    throw error;
  }
}
