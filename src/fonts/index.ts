// import {
//   Geist,
//   Geist_Mono,
//   IBM_Plex_Sans,
//   Nunito,
//   Space_Grotesk,
// } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin", "cyrillic"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin", "cyrillic"],
// });

// const nunito = Nunito({
//   variable: "--font-nunito",
//   subsets: ["latin", "cyrillic"],
//   weight: ["200", "400", "600", "700"],
//   display: "swap",
// });

// const spaceGrotesk = Space_Grotesk({
//   variable: "--font-space-grotesk",
//   subsets: ["latin"], // Обратите внимание: в Google Fonts для него обычно нет кириллицы
//   weight: ["300", "400", "500", "600", "700"],
//   display: "swap",
// });

// const ibmPlex = IBM_Plex_Sans({
//   variable: "--font-ibm-plex",
//   subsets: ["latin", "cyrillic"],
//   weight: ["300", "400", "500", "600"],
// });

// export const fontVariables = `${nunito.variable} ${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${ibmPlex.variable}`;

import localFont from "next/font/local";

export const geistSans = localFont({
  variable: "--font-geist-sans",
  display: "swap",
  src: [
    {
      path: "./geist/geist-v4-cyrillic_latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./geist/geist-v4-cyrillic_latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./geist/geist-v4-cyrillic_latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./geist/geist-v4-cyrillic_latin-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./geist/geist-v4-cyrillic_latin-800.woff2",
      weight: "800",
      style: "normal",
    },
  ],
});

export const geistMono = localFont({
  variable: "--font-geist-mono",
  display: "swap",
  src: [
    {
      path: "./geist-mono/geist-mono-v4-cyrillic_latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./geist-mono/geist-mono-v4-cyrillic_latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./geist-mono/geist-mono-v4-cyrillic_latin-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./geist-mono/geist-mono-v4-cyrillic_latin-800.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./geist-mono/geist-mono-v4-cyrillic_latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

export const ibmPlex = localFont({
  variable: "--font-ibm-plex",
  display: "swap",
  src: [
    {
      path: "./ibm/ibm-plex-sans-v23-cyrillic_latin-300.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./ibm/ibm-plex-sans-v23-cyrillic_latin-300italic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./ibm/ibm-plex-sans-v23-cyrillic_latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./ibm/ibm-plex-sans-v23-cyrillic_latin-500italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./ibm/ibm-plex-sans-v23-cyrillic_latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./ibm/ibm-plex-sans-v23-cyrillic_latin-600italic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "./ibm/ibm-plex-sans-v23-cyrillic_latin-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./ibm/ibm-plex-sans-v23-cyrillic_latin-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./ibm/ibm-plex-sans-v23-cyrillic_latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

export const nunito = localFont({
  variable: "--font-nunito",
  display: "swap",
  src: [
    {
      path: "./nunito/nunito-v32-cyrillic_latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./nunito/nunito-v32-cyrillic_latin-500italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./nunito/nunito-v32-cyrillic_latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./nunito/nunito-v32-cyrillic_latin-600italic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "./nunito/nunito-v32-cyrillic_latin-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./nunito/nunito-v32-cyrillic_latin-700italic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./nunito/nunito-v32-cyrillic_latin-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./nunito/nunito-v32-cyrillic_latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

export const spaceGrotesk = localFont({
  variable: "--font-space-grotesk",
  display: "swap",
  src: [
    {
      path: "./space-grotesk/space-grotesk-v22-latin-300.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./space-grotesk/space-grotesk-v22-latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./space-grotesk/space-grotesk-v22-latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./space-grotesk/space-grotesk-v22-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./space-grotesk/space-grotesk-v22-latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

export const fontVariables = `
  ${geistSans.variable}
  ${geistMono.variable}
  ${nunito.variable}
  ${spaceGrotesk.variable}
  ${ibmPlex.variable}
`;
