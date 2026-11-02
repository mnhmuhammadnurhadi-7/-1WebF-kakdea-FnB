import { SidebarBrand } from "./SidebarBrand";
import { SidebarNav } from "./SidebarNav";

/** Sidebar kiri bergaya Figma SOJU — dipakai bersama oleh semua halaman dashboard. */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col overflow-hidden bg-navy">
      {/* Garis orbit dekoratif */}
      <svg aria-hidden="true" viewBox="0 0 360 420" className="pointer-events-none absolute -bottom-10 -left-24 h-[300px] w-80">
        <ellipse
          cx="190"
          cy="220"
          rx="170"
          ry="84"
          transform="rotate(-28 190 220)"
          fill="none"
          stroke="rgba(142,209,228,.22)"
          strokeWidth="1.2"
          strokeDasharray="7 7"
        />
      </svg>

      <SidebarBrand />
      <SidebarNav />
    </aside>
  );
}
