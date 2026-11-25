import PageContainer from "@/components/PageContainer/PageContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Финансы и отчетность | Rent App",

  robots: {
    index: false,
    follow: false,
    noimageindex: true,
    nocache: true,
  },
};

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageContainer>{children}</PageContainer>;
}
