import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kalkulator Investasi Online & Perencanaan Keuangan | Rencana",
  description:
    "Gunakan kalkulator investasi online untuk menghitung potensi keuntungan, memproyeksikan pertumbuhan aset, membandingkan skenario imbal hasil, dan merencanakan target keuangan Anda.",
  applicationName: "Rencana",
  keywords: [
    "kalkulator investasi",
    "simulasi investasi online",
    "kalkulator keuntungan investasi",
    "perencanaan keuangan",
    "simulasi bunga majemuk",
    "perhitungan investasi bulanan",
    "target keuangan masa depan"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
