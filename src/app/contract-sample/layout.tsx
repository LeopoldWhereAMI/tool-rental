import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактор шаблона договора | Rent App",

  robots: {
    index: false,
    follow: false,
  },
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
