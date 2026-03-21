"use client";

import { uploadAvatarAction } from "@/app/profile/actions/actions";
import { useRef, useState } from "react";
import styles from "./AvatarUploadForm.module.css";
import { toast } from "sonner";
import { Save, Upload } from "lucide-react";

export default function AvatarUploadForm() {
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fileInput = fileInputRef.current;

    if (!fileInput?.files?.length) {
      toast.error("Выберите файл");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", fileInput.files[0]);

    try {
      setLoading(true);

      const result = await uploadAvatarAction(formData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setSelectedFileName(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Аватар успешно загружен");
    } catch (err) {
      toast.error("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];

    if (file) {
      setSelectedFileName(file.name);
    } else {
      setSelectedFileName(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputField}>
        <input
          id="avatar"
          type="file"
          name="avatar"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
        />

        <button
          type="button"
          onClick={handleButtonClick}
          className={styles.uploadButton}
        >
          <Upload size={16} />
          Выберите файл
        </button>

        {selectedFileName && (
          <div>
            <p className={styles.fileName}>
              📎 Выбран файл: <strong>{selectedFileName}</strong>
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !selectedFileName}
        className={styles.button}
      >
        <Save size={16} />
        {loading ? "Загрузка..." : "Сохранить"}
      </button>
    </form>
  );
}
