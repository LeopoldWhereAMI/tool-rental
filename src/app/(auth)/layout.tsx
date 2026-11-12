import {
  ClipboardList,
  Wrench,
  Users,
  BarChart3,
  FileText,
} from "lucide-react";
import styles from "./layout.module.css";
import Logo from "@/components/ui/Logo/Logo";

const features = [
  {
    icon: ClipboardList,
    title: "Заказы",
    text: "Оформление аренды и контроль сроков возврата",
  },
  {
    icon: Wrench,
    title: "Инвентарь",
    text: "Каталог инструмента, наличие и стоимость аренды",
  },
  { icon: Users, title: "Клиенты", text: "База клиентов с историей заказов" },
  { icon: BarChart3, title: "Финансы", text: "Доходы и оплаты по периодам" },
  {
    icon: FileText,
    title: "Договоры",
    text: "Договор аренды с данными заказа",
  },
];

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={styles.page}>
      <main className={styles.content}>
        <section className={styles.info}>
          <div className={styles.logo}>
            <Logo />
          </div>

          <h1 className={styles.title}>
            Прокат инструмента <span>под полным контролем</span>
          </h1>
          <p className={styles.subtitle}>
            Заказы, инвентарь, клиенты, финансы и договоры в одном сервисе.
          </p>

          <ul className={styles.features}>
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className={styles.feature}>
                <div className={styles.icon}>
                  <Icon size={20} />
                </div>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.form}>{children}</section>
      </main>

      <footer className={styles.footer}>
        © 2026 Система управления прокатом
      </footer>
    </div>
  );
}
