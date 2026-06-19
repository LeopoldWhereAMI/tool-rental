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
  ${spaceGrotesk.variable}
`;
