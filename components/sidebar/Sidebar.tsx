import { SidebarBrand } from "./SidebarBrand";
import { SidebarNav } from "./SidebarNav";

/** Sidebar kiri bergaya Figma SOJU — dipakai bersama oleh semua halaman dashboard. */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-navy">
      <SidebarBrand />
      <SidebarNav />
    </aside>
  );
}
