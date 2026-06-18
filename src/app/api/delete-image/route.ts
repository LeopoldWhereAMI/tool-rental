// // для локального хранилища
// import { NextRequest, NextResponse } from "next/server";
// import { createSupabaseServerClient } from "@/lib/supabase/server";
// import { unlink } from "fs/promises";
// import path from "path";

// export async function DELETE(request: NextRequest) {
//   try {
//     const supabase = await createSupabaseServerClient();

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { path: filePath } = await request.json();
//     if (!filePath) {
//       return NextResponse.json({ error: "No path" }, { status: 400 });
//     }

//     // Извлекаем имя файла из пути /uploads/filename.ext или /api/image?path=filename.ext
//     const fileName = filePath.includes("?path=")
//       ? filePath.split("?path=")[1]
//       : path.basename(filePath);

//     await unlink(path.join("/var/www/images", fileName));

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Delete error:", error);
//     return NextResponse.json({ success: false }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { path: filePath } = await request.json();
    if (!filePath) {
      return NextResponse.json({ error: "No path" }, { status: 400 });
    }

    const isVercel = process.env.VERCEL === "1";

    if (isVercel) {
      // Supabase Storage
      const fileName = filePath.includes("?path=")
        ? filePath.split("?path=")[1]
        : filePath.split("/").pop();

      const { error } = await supabase.storage
        .from("images")
        .remove([fileName]);
      if (error) throw error;
    } else {
      // Локальное хранилище
      const { unlink } = await import("fs/promises");
      const path = await import("path");

      const fileName = filePath.includes("?path=")
        ? filePath.split("?path=")[1]
        : path.basename(filePath);

      await unlink(path.join("/var/www/images", fileName));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
