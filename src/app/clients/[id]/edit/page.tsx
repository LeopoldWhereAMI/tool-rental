"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getClientById, updateClient } from "@/services/clientsService";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import BackButton from "@/components/BackButton/BackButton";
import styles from "./page.module.css";
import { toast } from "sonner";

export default function EditClientPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      getClientById(id as string)
        .then((data) => {
          setFormData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            middle_name: data.middle_name || "",
            phone: data.phone || "",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateClient(id as string, formData);
      toast.success("Данные клиента обновлены");
      router.push(`/clients/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Не удалось обновить данные");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageWrapper>Загрузка...</PageWrapper>;

  return (
    <PageWrapper>
      <BackButton>Отмена</BackButton>

      <div className={styles.formContainer}>
        <h1>Редактирование клиента</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Фамилия</label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.field}>
            <label>Имя</label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.field}>
            <label>Отчество</label>
            <input
              type="text"
              value={formData.middle_name}
              onChange={(e) =>
                setFormData({ ...formData, middle_name: e.target.value })
              }
            />
          </div>

          <div className={styles.field}>
            <label>Телефон</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" disabled={saving} className={styles.saveBtn}>
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
