import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kalkulator Investasi Online & Simulasi Keuntungan | Investment Planner",
  description:
    "Hitung simulasi investasi, estimasi keuntungan, dan pertumbuhan aset Anda. Rencanakan target keuangan untuk masa depan yang lebih sejahtera dengan Investment Planner.",
  applicationName: "Investment Planner",
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
