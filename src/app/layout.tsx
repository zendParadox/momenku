import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MomenKu — Undangan Digital yang Bikin Tamu Terpesona",
  description:
    "Buat undangan digital website custom dengan desain memukau. AI-powered, 500+ tema, real-time analytics. Coba gratis sekarang!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${cormorant.variable} ${greatVibes.variable}`}
    >
      <body className="font-[family-name:var(--font-jakarta)] antialiased">
        {children}
      </body>
    </html>
  );
}
