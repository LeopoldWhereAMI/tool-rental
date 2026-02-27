import PageContainer from "@/components/PageContainer/PageContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Инвентарь | Rent App",

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
  return (
    <PageContainer>
      <section>{children}</section>
    </PageContainer>
  );
}
