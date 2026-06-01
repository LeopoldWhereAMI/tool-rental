"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { eachDayOfInterval, format } from "date-fns";
import { ru } from "date-fns/locale";
import styles from "./Calendar.module.css";
import "react-day-picker/dist/style.css";
import {
  getBookings,
  checkAvailability,
  createBooking,
  cancelBooking,
  updateBooking,
} from "@/services/bookings";

import { Calendar1, Check, FileText, Pencil, Phone, X } from "lucide-react";
import { toast } from "sonner";
import { parseISODate, toISODate } from "@/helpers/date";

type Props = {
  inventoryId: string;
};

type Booking = {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  notes: string | null;
  phone: string | null;
};

export default function Calendar({ inventoryId }: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  // const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // =========================
  // Загрузка бронирований
  // =========================

  useEffect(() => {
    fetchBookings();
  }, [inventoryId]);

  async function fetchBookings() {
    try {
      const data = await getBookings(inventoryId);
      setBookings(data);
    } catch (error) {
      console.error(error);
      setError("Ошибка загрузки бронирований");
    }
  }

  // =========================
  // Disabled dates
  // =========================

  const disabledDays = useMemo(() => {
    return bookings
      .filter((booking) => booking.status !== "cancelled")
      .flatMap((booking) =>
        eachDayOfInterval({
          start: parseISODate(booking.start_date), // строка → Date
          end: parseISODate(booking.end_date),
        }),
      );
  }, [bookings]);

  // =========================
  // Выбор диапазона
  // =========================

  async function handleSelect(selectedRange: DateRange | undefined) {
    setError("");
    setRange(selectedRange);

    if (!selectedRange?.from || !selectedRange?.to) {
      return;
    }

    try {
      const result = await checkAvailability(
        inventoryId,
        selectedRange.from,
        selectedRange.to,
      );

      if (!result.is_available) {
        setError("Эти даты уже заняты");
      }
    } catch (error) {
      console.error(error);

      setError("Ошибка проверки доступности");
    }
  }

  // Создание бронирования
  function handleBooking() {
    if (!range?.from || !range?.to) return;

    setLoading(true);

    const startDate = range.from;
    const endDate = range.to;
    const dates = `${startDate.toLocaleDateString()} — ${endDate.toLocaleDateString()}`;

    toast(`Создать бронирование?\n${dates}`, {
      action: {
        label: "Да, создать",
        onClick: async () => {
          setLoading(true);
          try {
            await createBooking({
              inventoryId,
              // clientId: selectedClientId,
              startDate,
              endDate,
            });
            await fetchBookings();
            setRange(undefined);
            toast.success("Бронь создана");
          } catch (error) {
            console.error(error);
            toast.error("Ошибка создания бронирования");
          } finally {
            setLoading(false);
          }
        },
      },
      cancel: {
        label: "Нет",
        onClick: () => setLoading(false),
      },
      duration: 15000,
      onDismiss: () => setLoading(false),
    });
  }

  // Отмена бронирования
  function handleCancelBooking(bookingId: string) {
    toast("Отменить бронирование?", {
      action: {
        label: "Да, отменить",
        onClick: async () => {
          try {
            await cancelBooking(bookingId);
            await fetchBookings();
            toast.success("Бронь отменена");
          } catch (error) {
            console.error(error);
            toast.error("Ошибка отмены");
          }
        },
      },
      cancel: {
        label: "Нет",
        onClick: () => {},
      },
    });
  }

  // Начать редактирование
  function startEdit(booking: Booking) {
    setEditingId(booking.id);
    setEditNotes(booking.notes || "");
    setEditPhone(booking.phone || "");
  }

  // Отменить редактирование
  function cancelEdit() {
    setEditingId(null);
    setEditNotes("");
    setEditPhone("");
  }

  // Сохранить изменения
  async function saveEdit(bookingId: string) {
    try {
      await updateBooking(bookingId, {
        notes: editNotes.trim() || null,
        phone: editPhone.trim() || null,
      });
      await fetchBookings();
      setEditingId(null);
      toast.success("Сохранено");
    } catch (error) {
      console.error(error);
      toast.error("Ошибка сохранения");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <Calendar1 width={20} height={20} /> Календарь бронирований
        </h3>
      </div>
      <div className={styles.cardContent}>
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          disabled={disabledDays}
          showOutsideDays
          locale={ru}
          weekStartsOn={1}
        />
        {range?.from && range?.to && (
          <div className={styles.selectedRange}>
            <p>Выбран диапазон:</p>
            <p>{/* {toISODate(range.from)} — {toISODate(range.to)} */}</p>
            {format(range.from, "dd.MM.yyyy")} —{" "}
            {format(range.to, "dd.MM.yyyy")}
            <button
              onClick={handleBooking}
              disabled={loading}
              className={styles.bookButton}
            >
              {loading ? "Создание..." : "Забронировать"}
            </button>
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}

        {/* Список бронирований */}
        <div className={styles.bookingsSection}>
          {bookings.length ? (
            <h3 className={styles.sectionTitle}>Бронирования:</h3>
          ) : (
            ""
          )}

          {bookings.map((booking) => (
            <div key={booking.id} className={styles.bookingItem}>
              <div className={styles.bookingDates}>
                <span>
                  {format(parseISODate(booking.start_date), "d MMM", {
                    locale: ru,
                  })}
                </span>
                <span>—</span>
                <span>
                  {format(parseISODate(booking.end_date), "d MMM", {
                    locale: ru,
                  })}
                </span>
              </div>

              {/* Режим редактирования */}
              {editingId === booking.id ? (
                <div className={styles.editForm}>
                  <div className={styles.inputGroup}>
                    <Phone width={14} height={14} color="#22c55e" />
                    <input
                      type="tel"
                      placeholder="Телефон клиента"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className={styles.editInput}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <FileText width={14} height={14} color="#2b5bee" />
                    <input
                      type="text"
                      placeholder="Комментарий"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className={styles.editInput}
                    />
                  </div>
                  <div className={styles.editActions}>
                    <button
                      onClick={() => saveEdit(booking.id)}
                      className={styles.saveButton}
                    >
                      <Check width={14} height={14} /> Сохранить
                    </button>
                    <button
                      onClick={cancelEdit}
                      className={styles.cancelEditButton}
                    >
                      <X width={14} height={14} /> Отмена
                    </button>
                  </div>
                </div>
              ) : (
                /* Режим просмотра */
                <div className={styles.bookingInfo}>
                  {booking.phone && (
                    <div className={styles.infoRow}>
                      <Phone width={14} height={14} color="#22c55e" />
                      <span>{booking.phone}</span>
                    </div>
                  )}
                  {booking.notes && (
                    <div className={styles.infoRow}>
                      <FileText width={14} height={14} color="#2b5bee" />
                      <span>{booking.notes}</span>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.bookingActions}>
                {editingId !== booking.id && (
                  <button
                    onClick={() => startEdit(booking)}
                    className={styles.editButton}
                    title="Редактировать"
                  >
                    <Pencil width={14} height={14} color="#5048e5" />
                  </button>
                )}
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className={styles.cancelButton}
                  title="Отменить бронирование"
                >
                  Отменить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
