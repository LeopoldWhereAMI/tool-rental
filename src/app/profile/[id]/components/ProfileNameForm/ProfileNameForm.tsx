"use client";

import { updateProfileAction } from "@/app/profile/actions/actions";
import { useState } from "react";
import styles from "./ProfileNameForm.module.css";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface Props {
  defaultName: string;
}

export default function ProfileNameForm({ defaultName }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      setLoading(true);

      const result = await updateProfileAction(formData);

      if (!result?.success) {
        toast.error(result?.error || "Ошибка обновления");
        return;
      }

      toast.success("Имя успешно обновлено");
    } catch {
      toast.error("Ошибка обновления");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* <label htmlFor="fullName">Редактирование имени</label> */}

      <input
        type="text"
        name="fullName"
        defaultValue={defaultName}
        className={styles.input}
        placeholder="Введите имя"
      />

      <button type="submit" disabled={loading} className={styles.button}>
        <Save size={16} />
        {loading ? "Сохранение..." : "Сохранить"}
      </button>
    </form>
  );
}
