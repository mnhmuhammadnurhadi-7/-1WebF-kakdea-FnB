"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Topbar } from "@/components/topbar/Topbar";

/** Bingkai halaman: sidebar kiri (drawer di <1024px), topbar atas, isi halaman di tengah. */
export function DashboardFrame({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <div
      className="min-h-screen overflow-x-clip bg-app"
      style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
    >
      <Sidebar mobileOpen={mobileMenuOpen} onClose={closeMobileMenu} />
      <div className="min-w-0 lg:pl-64">
        <Topbar onMenuClick={openMobileMenu} menuOpen={mobileMenuOpen} />
        <main className="min-w-0 px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pb-14">{children}</main>
      </div>
    </div>
  );
}
