"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { Topbar } from "@/components/topbar/Topbar";

/** Bingkai halaman: sidebar kiri, topbar atas, isi halaman di tengah. */
export function DashboardFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-app" style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}>
      <Sidebar />
      <div className="min-w-0 pl-64">
        <Topbar />
        <main className="min-w-0 px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pb-14">{children}</main>
      </div>
    </div>
  );
}
