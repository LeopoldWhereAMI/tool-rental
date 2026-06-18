// // для локального хранилища
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const path = searchParams.get("path");

//   if (!path) {
//     return NextResponse.json({ error: "No path" }, { status: 400 });
//   }

//   return NextResponse.redirect(new URL(`/uploads/${path}`, request.url));
// }

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "No path" }, { status: 400 });
  }

  const isVercel = process.env.VERCEL === "1";

  if (isVercel) {
    const proxyUrl = process.env.SUPABASE_URL_PROXY;
    return NextResponse.redirect(
      `${proxyUrl}/storage/v1/object/public/images/${path}`,
    );
  } else {
    return NextResponse.redirect(new URL(`/uploads/${path}`, request.url));
  }
}
