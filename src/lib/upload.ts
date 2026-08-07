import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function saveImage(file: File) {
  const extension = file.name.split(".").pop();

  const fileName = `${randomUUID()}.${extension}`;

  const uploadDir = path.join(process.cwd(), "uploads", "inventory");

  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return `/api/images/inventory/${fileName}`;
}
