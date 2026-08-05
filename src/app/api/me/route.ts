import { auth } from "../../../../auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  console.log("SESSION:", session);

  return NextResponse.json(session);
}
