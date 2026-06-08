import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "No path" }, { status: 400 });
  }

  // В дев-режиме редиректим на прокси
  if (process.env.NODE_ENV === "development") {
    return NextResponse.redirect(
      `https://api.xn--46-6kcay4al8ahci5n.xn--p1ai/storage/v1/object/public/images/${path}`,
    );
  }

  const supabaseUrl = `https://guicprnabbwmkpxhhrwg.supabase.co/storage/v1/object/public/images/${path}`;

  const response = await fetch(supabaseUrl);

  if (!response.ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/webp";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
