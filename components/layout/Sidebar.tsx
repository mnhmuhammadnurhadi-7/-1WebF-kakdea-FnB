"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";

const MENU: { label: string; href: string; icon: IconName }[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Data", href: "/data", icon: "data" },
  { label: "Asisten AI", href: "/ai", icon: "bot" },
  { label: "Riwayat & Audit", href: "/audit", icon: "history" },
  { label: "CMS System", href: "/cms", icon: "cms" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col overflow-hidden bg-navy">
      {/* Garis orbit dekoratif */}
      <svg
        aria-hidden="true"
        viewBox="0 0 360 420"
        className="pointer-events-none absolute -bottom-10 -left-24 h-[300px] w-80"
      >
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

      <div className="relative flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <span className="flex size-[38px] items-center justify-center rounded-xl bg-brand text-[19px] font-extrabold text-white shadow-blue">
          S
        </span>
        <div>
          <div className="text-[19px] font-extrabold tracking-wide text-white">SOJU</div>
          <div className="text-[9.5px] font-bold tracking-[.1em] text-sky">KULINER &amp; FROZEN FOOD</div>
        </div>
      </div>

      <nav className="relative flex flex-col gap-1.5 px-4 py-[18px]">
        {MENU.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={
                "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[15px] transition-colors " +
                (active
                  ? "bg-[linear-gradient(160deg,#1E8BFF,#06B6D4)] font-semibold text-white shadow-menu"
                  : "font-medium text-white/80 hover:bg-white/10 hover:text-white")
              }
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
