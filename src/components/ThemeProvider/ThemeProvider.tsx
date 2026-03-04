"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class" // Будет добавлять класс .light или .dark к тегу <html>
      defaultTheme="system"
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}
