import { supabase } from "@/lib/supabase/supabase";

export const getAnalyticsData = async (month: number | null, year: number) => {
  try {
    let startDate: Date;
    let endDate: Date;

    if (month === null) {
      // Весь год: от 1 января до 31 декабря
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
    } else {
      // Конкретный месяц
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0, 23, 59, 59);
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("total_price")
      .eq("status", "completed")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (error) throw error;

    // const totalRevenue = orders.reduce(
    //   (sum, order) => sum + (order.total_price || 0),
    //   0,
    // );
    // const completedCount = orders.length;
    const totalRevenue =
      orders?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;
    const completedCount = orders?.length || 0;

    return {
      totalRevenue,
      completedCount,
    };
  } catch (e) {
    console.error("Analytics Error:", e);
    return { totalRevenue: 0, completedCount: 0 };
  }
};
