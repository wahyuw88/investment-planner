import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rencana — Investment Planner",
  description:
    "Simulasikan investasi rutin, bandingkan skenario imbal hasil, dan rencanakan target keuangan Anda.",
  applicationName: "Rencana Investment Planner"
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
