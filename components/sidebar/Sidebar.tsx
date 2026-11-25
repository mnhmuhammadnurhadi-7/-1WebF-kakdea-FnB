"use client";

import { SidebarBrand } from "./SidebarBrand";
import { SidebarNav } from "./SidebarNav";

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

/** Sidebar kiri bergaya Figma SOJU — fixed di desktop (>=1024px) dan slide-over drawer di mobile/tablet (<1024px). */
export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop overlay untuk mobile/tablet drawer */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={
          "fixed inset-0 z-40 bg-navy/50 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden " +
          (mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")
        }
      />

      <aside
        id="dashboard-sidebar"
        aria-label="Navigasi utama dashboard"
        className={
          "fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col bg-navy shadow-navy transition-transform duration-200 ease-out lg:z-30 lg:translate-x-0 lg:shadow-none " +
          (mobileOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <SidebarBrand onClose={onClose} />
        <SidebarNav onNavigate={onClose} />
      </aside>
    </>
  );
}
