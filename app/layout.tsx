import type { Metadata } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tanishq Mangal | 3D Interactive Portfolio",
  description: "Explore the interactive 3D portfolio of Tanishq Mangal, a creative technologist.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23000005'/><text x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' font-size='50' fill='%23ff9a24'>TM</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${outfit.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body),sans-serif]">
        {children}
      </body>
    </html>
  );
}
