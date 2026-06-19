export const uploadInventoryImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!data.success) throw new Error(data.error);

    return data.url;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    console.error("Storage Upload Error:", message);
    throw new Error(message);
  }
};

export const deleteImageByUrl = async (url: string | null) => {
  if (!url) return;

  try {
    await fetch("/api/delete-image", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: url }),
    });
  } catch (error) {
    console.error("Ошибка при удалении файла из Storage:", error);
  }
};
