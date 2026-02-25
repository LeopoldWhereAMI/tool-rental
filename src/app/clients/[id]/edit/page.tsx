"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getClientById, updateClient } from "@/services/clientsService";
import styles from "./page.module.css";
import { toast } from "sonner";
import { User, Phone, Save, Info } from "lucide-react";
import PageContainer from "@/components/PageContainer/PageContainer";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";

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

  const breadcrumbItems = useMemo(
    () => [
      { label: "Клиенты", href: "/clients" },
      {
        label:
          `${formData.last_name} ${formData.first_name}`.trim() || "Клиент",
        href: `/clients/${id}`,
      },
      { label: "Редактировать профиль" },
    ],
    [formData.first_name, formData.last_name, id],
  );

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

  if (loading) return <div className={styles.pageWrapper}>Загрузка...</div>;

  return (
    <PageContainer>
      <div className={styles.pageContainer}>
        <header className={styles.pageHeader}>
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className={styles.pageTitle}>Редактирование профиля</h1>
          <p className={styles.pageSubtitle}>
            Измените личные данные и контактную информацию клиента
          </p>
        </header>

        <div className={styles.mainContent}>
          <main className={styles.formColumn}>
            <form id="edit-client-form" onSubmit={handleSubmit}>
              <section className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <User size={18} /> Данные клиента
                  </h2>
                </div>

                {/* Личные данные */}
                <div className={styles.row}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Фамилия</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.last_name}
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Имя</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.first_name}
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Отчество</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={formData.middle_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          middle_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Номер телефона</label>
                    <div className={styles.inputWithIcon}>
                      <Phone size={16} />
                      <input
                        className={styles.input}
                        type="tel"
                        value={formData.phone}
                        required
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </section>
            </form>
          </main>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Действия</h3>
              <button
                type="submit"
                form="edit-client-form"
                className={styles.submitBtn}
                disabled={saving}
              >
                <Save size={18} />{" "}
                {saving ? "Сохранение..." : "Сохранить изменения"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className={styles.cancelBtn}
              >
                Отмена
              </button>
              <div className={styles.infoBox}>
                <Info size={16} />
                <div className={styles.infoBoxText}>
                  Все изменения будут сохранены.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}
