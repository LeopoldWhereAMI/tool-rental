export const uploadInventoryImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Ошибка загрузки изображения");
    }

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

export const deleteInventoryImage = async (id: string) => {
  try {
    const response = await fetch(`/api/inventory/${id}/image`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Ошибка удаления изображения");
    }

    return true;
  } catch (error) {
    console.error("Ошибка удаления изображения:", error);
    throw error;
  }
};
