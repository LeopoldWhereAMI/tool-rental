import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

export async function saveImage(file: File) {
  const fileName = `${randomUUID()}.webp`;

  const uploadDir = path.join(process.cwd(), "uploads", "inventory");

  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());

  const optimizedImage = await sharp(buffer)
    .resize(800, 800, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();

  await writeFile(filePath, optimizedImage);

  return `/api/images/inventory/${fileName}`;
}
