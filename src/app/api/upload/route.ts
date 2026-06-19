import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const isVercel = process.env.VERCEL === "1";

    if (isVercel) {
      // Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, buffer, { contentType: file.type });

      if (uploadError) throw uploadError;

      const publicUrl = `/api/image?path=${fileName}`;
      return NextResponse.json({ success: true, url: publicUrl });
    } else {
      // Локальное хранилище
      const { writeFile } = await import("fs/promises");
      const path = await import("path");
      await writeFile(path.join("/var/www/images", fileName), buffer);

      const publicUrl = `/uploads/${fileName}`;
      return NextResponse.json({ success: true, url: publicUrl });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 },
    );
  }
}
