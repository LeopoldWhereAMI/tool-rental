"use client";

import {
  deleteImageByUrl,
  uploadInventoryImage,
} from "@/services/storageService";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import styles from "./ImageUploader.module.css";

type ImageUploaderProps = {
  currentImageUrl?: string | null;
  onUploadSuccess: (url: string) => Promise<void>;
};

export default function ImageUploader({
  onUploadSuccess,
  currentImageUrl,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    currentImageUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Ограничение 5МБ
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Файл слишком большой (макс. 5МБ)");
      return;
    }

    try {
      setUploading(true);
      const url = await uploadInventoryImage(file);

      setPreview(url);
      onUploadSuccess(url);
      toast.success("Изображение загружено");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      toast.error("Ошибка загрузки: ");
      console.error("Ошибка загрузки: " + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (preview) {
      try {
        setUploading(true);
        await deleteImageByUrl(preview);
        setPreview(null);
        await onUploadSuccess("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast.success("Изображение  удалено");
      } catch (error) {
        console.error("Ошибка при удалении:", error);
        toast.error("Ошибка при физическом удалении файла");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className={styles.uploaderWrapper}>
      {preview ? (
        <div className={styles.imagePreviewContainer}>
          <img src={preview} alt="Инструмент" className={styles.previewImage} />
          <button
            type="button"
            onClick={handleRemove}
            className={styles.removeBtn}
            title="Удалить фото"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className={styles.dropzone}>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/webp"
            hidden
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading ? (
            <div className={styles.loadingState}>
              <Loader2 className={styles.spinner} />
              <span>Загрузка...</span>
            </div>
          ) : (
            <div className={styles.placeholderState}>
              <ImagePlus size={40} strokeWidth={1.5} />
              <span>Нажмите, чтобы добавить фото</span>
              <small>JPG, PNG или WebP (до 5МБ)</small>
            </div>
          )}
        </label>
      )}
    </div>
  );
}
