import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { UPLOADS_DIR } from "@/lib/uploadPath";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path: imagePath } = await params;

    if (
      imagePath.some(
        (segment) =>
          segment.includes("..") ||
          segment.includes("/") ||
          segment.includes("\\"),
      )
    ) {
      return new NextResponse("Invalid path", { status: 400 });
    }

    const filePath = path.join(UPLOADS_DIR, ...imagePath);
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadsDir = path.resolve(UPLOADS_DIR);

    if (!resolvedPath.startsWith(resolvedUploadsDir + path.sep)) {
      return new NextResponse("Invalid path", { status: 400 });
    }

    const file = await readFile(resolvedPath);

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType =
      ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : "image/webp";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image read error:", error);
    return new NextResponse("Image not found", { status: 404 });
  }
}
