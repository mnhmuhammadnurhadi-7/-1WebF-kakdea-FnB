"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_MENU } from "./menu";
import { SidebarIcon } from "./SidebarIcon";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

/** Daftar menu; menu aktif ditentukan dari alamat halaman. */
export function SidebarNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<string>("");
  useEffect(() => { api.auth.getMe().then((res) => setRole(res.data.peran)).catch(() => setRole("ADMIN")); }, []);

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {SIDEBAR_MENU.filter((item) => !item.superAdminOnly || role === "SUPER_ADMIN").map((item) => {
        const active = item.href === "/dashboard" ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors " +
              (active
                ? "bg-white/10 font-semibold text-white"
                : "font-medium text-white/75 hover:bg-white/5 hover:text-white")
            }
          >
            <SidebarIcon name={item.icon} size={18} className={active ? "text-sky" : ""} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
