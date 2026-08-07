import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ path: string[] }>;
  },
) {
  try {
    const { path: imagePath } = await params;

    const filePath = path.join(process.cwd(), "uploads", ...imagePath);

    const file = await readFile(filePath);

    const ext = path.extname(filePath).toLowerCase();

    const contentType =
      ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : "image/webp";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Image read error:", error);

    return new NextResponse("Image not found", {
      status: 404,
    });
  }
}
