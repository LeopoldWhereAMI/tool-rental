import { Geist, Geist_Mono, Nunito } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["200", "400", "600", "700"],
  display: "swap",
});

export const fontVariables = `${nunito.variable} ${geistSans.variable} ${geistMono.variable} `;
