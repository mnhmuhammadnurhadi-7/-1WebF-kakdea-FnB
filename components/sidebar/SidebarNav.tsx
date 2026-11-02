"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_MENU } from "./menu";
import { SidebarIcon } from "./SidebarIcon";

/** Daftar menu; menu aktif ditentukan dari alamat halaman. */
export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="relative flex flex-col gap-1.5 px-4 py-[18px]">
      {SIDEBAR_MENU.map((item) => {
        const active = item.href === "/dashboard" ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
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
            <SidebarIcon name={item.icon} size={20} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
