"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type AppLayoutProps = { children: ReactNode; activeMenu?: string };

/** Bingkai halaman admin: sidebar kiri, topbar atas, isi halaman di tengah. Dipakai semua halaman admin. */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-app">
      <Sidebar />
      <div className="pl-64">
        <Topbar />
        <main className="px-8 pb-14 pt-5">{children}</main>
      </div>
    </div>
  );
}
