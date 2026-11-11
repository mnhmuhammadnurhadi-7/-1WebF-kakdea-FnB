import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOJU — Kuliner & Frozen Food",
  description: "Sajian kuliner nusantara siap santap dan produk beku berstandar HACCP.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
