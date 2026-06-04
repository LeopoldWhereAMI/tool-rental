import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "user_id required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("inventory")
    .select("id, name, category, daily_price, status, image_url, serial_number")
    .eq("user_id", userId)
    .order("name");

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: true, data },
    {
      headers: {
        "Access-Control-Allow-Origin": "https://masterskaya1.online",
      },
    },
  );
}
