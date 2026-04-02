import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuanLyHS - Hệ thống Quản lý Học sinh",
  description: "Hệ thống quản lý học sinh trường học",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}