"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { Topbar } from "@/components/topbar/Topbar";

/** Bingkai halaman: sidebar kiri, topbar atas, isi halaman di tengah. */
export function DashboardFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-app" style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}>
      <Sidebar />
      <div className="pl-64">
        <Topbar />
        <main className="px-8 pb-14 pt-5">{children}</main>
      </div>
    </div>
  );
}
