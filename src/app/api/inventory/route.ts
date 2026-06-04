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

  // Разрешённые домены
  const allowedOrigins = [
    "https://masterskaya1.online",
    "https://www.masterskaya1.online",
    "https://rent-app-landing.vercel.app",
  ];

  const origin = request.headers.get("origin");
  const corsOrigin =
    origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return NextResponse.json(
    { success: true, data },
    {
      headers: {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  );
}

export async function OPTIONS(request: Request) {
  const allowedOrigins = [
    "https://masterskaya1.online",
    "https://www.masterskaya1.online",
    "https://rent-app-landing.vercel.app",
  ];

  const origin = request.headers.get("origin");
  const corsOrigin =
    origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
