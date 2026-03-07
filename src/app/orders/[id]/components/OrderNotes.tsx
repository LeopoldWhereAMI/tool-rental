import { useState } from "react";
import { StickyNote, Save, Edit2, X } from "lucide-react";
import styles from "./OrderNotes.module.css";
import { updateOrderNotes } from "@/services/orderService";
import { toast } from "sonner";

interface Props {
  orderId: string;
  initialNotes?: string | null;
}

export default function OrderNotes({ orderId, initialNotes }: Props) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateOrderNotes(orderId, notes);
      toast.success("Заметка обновлена");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Не удалось сохранить");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.whiteBox}>
      <div className={styles.boxHeader}>
        <div className={styles.headerTitle}>
          <StickyNote size={18} />
          <h3>Заметки администратора</h3>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
            <Edit2 size={14} />
            <span>Добавить</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className={styles.editContainer}>
          <textarea
            className={styles.textarea}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Добавьте примечание к заказу..."
            autoFocus
          />
          <div className={styles.actions}>
            <button
              onClick={() => setIsEditing(false)}
              className={styles.cancelBtn}
            >
              <X size={16} /> Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className={styles.saveBtn}
            >
              <Save size={16} /> {loading ? "..." : "Сохранить"}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.notesContent}>
          {notes ? (
            <p className={styles.text}>{notes}</p>
          ) : (
            <p className={styles.placeholder}>Заметок к заказу пока нет...</p>
          )}
        </div>
      )}
    </section>
  );
}
