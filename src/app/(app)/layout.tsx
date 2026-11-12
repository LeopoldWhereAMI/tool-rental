import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import Footer from "@/components/Footer/Footer";
import MobileNav from "@/components/ui/MobileNav/MobileNav";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
      <MobileNav />
      <Footer />
    </>
  );
}
