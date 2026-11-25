import PageContainer from "@/components/PageContainer/PageContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Клиенты | Rent App",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ClientsLayout({
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
