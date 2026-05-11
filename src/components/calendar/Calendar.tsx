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
} from "@/services/bookings";

import { useClients } from "@/hooks/useClients";
import { Calendar1 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  inventoryId: string;
};

export default function Calendar({ inventoryId }: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<
    {
      id: string;
      start_date: string;
      end_date: string;
      status: string;
    }[]
  >([]);

  const { clients } = useClients();

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
          start: new Date(booking.start_date),
          end: new Date(booking.end_date),
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
  // Создание бронирования — теперь просто показывает тост
  function handleBooking() {
    if (!range?.from || !range?.to) return;

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
              clientId: selectedClientId,
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
        onClick: () => {},
      },
      duration: 15000,
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
            <p>
              {range.from.toLocaleDateString()} —{" "}
              {range.to.toLocaleDateString()}
            </p>

            <button
              onClick={handleBooking}
              // disabled={loading}
              className={styles.bookButton}
            >
              {"Забронировать"}
            </button>
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <select
          value={selectedClientId ?? ""}
          onChange={(e) => setSelectedClientId(e.target.value)}
          className={styles.select}
        >
          <option value="">Клиент (опционально)</option>

          {clients.map((client) => {
            const label =
              client.client_type === "individual"
                ? `${client.first_name ?? ""} ${client.last_name ?? ""}`
                : (client.company_name ?? "Без названия");

            return (
              <option key={client.id} value={client.id}>
                {label}
              </option>
            );
          })}
        </select>
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
                {format(new Date(booking.start_date), "d MMM", { locale: ru })}{" "}
                —{" "}
                {format(new Date(booking.end_date), "d MMM yyyy", {
                  locale: ru,
                })}
              </div>

              <button
                onClick={() => handleCancelBooking(booking.id)}
                className={styles.cancelButton}
              >
                Отменить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
