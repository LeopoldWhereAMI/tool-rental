import {
  Geist,
  Geist_Mono,
  IBM_Plex_Sans,
  Nunito,
  Space_Grotesk,
} from "next/font/google";

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

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"], // Обратите внимание: в Google Fonts для него обычно нет кириллицы
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
});

export const fontVariables = `${nunito.variable} ${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${ibmPlex.variable}`;
