"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

const iconClass = "w-[18px] h-[18px]";

const DashboardIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const DataIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

const AIIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
    <path d="M12 8a4 4 0 0 0-4 4c0 1.5.5 2.5 2 3.5s2 2 2 4" />
    <path d="M12 8a4 4 0 0 1 4 4c0 1.5-.5 2.5-2 3.5s-2 2-2 4" />
  </svg>
);

const HistoryIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const CMSIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const menu: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { id: "data", label: "Data", href: "/data", icon: DataIcon },
  { id: "ai", label: "Asisten AI", href: "/ai", icon: AIIcon },
  { id: "audit", label: "Riwayat & Audit", href: "/audit", icon: HistoryIcon },
  { id: "cms", label: "CMS System", href: "/cms", icon: CMSIcon },
];

interface SidebarProps {
  active?: string;
}

export function Sidebar({ active = "dashboard" }: SidebarProps) {
  const router = useRouter();
  const goToProfile = () => router.push("/profile");

  return (
    <>
    <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col justify-between bg-sidebar-bg p-6 md:flex">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: "#B8791E" }}
          >
            <span className="font-heading text-[16px] font-black text-white">
              BD
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-heading text-[18px] font-semibold text-white leading-tight">
              Buku Dapur
            </span>
            <span className="text-[11px] font-normal text-teal-soft leading-tight">
              Frozen & Siap Saji
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {menu.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  group flex items-center gap-3 self-stretch rounded-[10px] px-4 py-3
                  transition-all duration-200 ease-out hover:shadow-lg
                  ${isActive
                    ? "bg-teal-active text-white"
                    : "text-teal-soft hover:bg-sidebar-surface hover:text-white"
                  }
                `}
                style={isActive ? { borderLeft: "3px solid #B8791E" } : undefined}
              >
                <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-teal-soft group-hover:text-white"}`}>
                  {item.icon}
                </span>
                <span className="text-[14px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={goToProfile}
        className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 ease-out hover:bg-white/10 hover:shadow-lg cursor-pointer"
        style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-bg">
          <span className="text-[14px] font-bold text-teal-deep">BP</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-[13px] font-semibold text-white">
            Bu Pemilik
          </span>
          <span className="truncate text-[11px] font-normal text-teal-soft">
            2 pengguna aktif
          </span>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-soft shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </aside>
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white"><span className="font-heading text-sm font-black">BD</span></div>
        <div className="flex flex-col"><span className="font-heading text-base font-semibold leading-tight text-ink">Buku Dapur</span><span className="text-[10px] text-muted">Panel usaha</span></div>
      </div>
      <button type="button" onClick={goToProfile} aria-label="Buka profil" className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-bg text-sm font-bold text-teal-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">BP</button>
    </header>
    <nav aria-label="Navigasi utama" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 px-1 pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-2 shadow-[0_-6px_24px_rgba(30,42,40,0.08)] backdrop-blur md:hidden">
      {menu.map((item) => {
        const isActive = active === item.id;
        return <Link key={item.id} href={item.href} aria-current={isActive ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${isActive ? "text-teal-deep" : "text-muted hover:bg-background"}`}>
          <span className={isActive ? "text-accent" : ""}>{item.icon}</span><span className="max-w-full truncate">{item.label === "Riwayat & Audit" ? "Audit" : item.label === "Asisten AI" ? "Asisten AI" : item.label === "CMS System" ? "CMS" : item.label}</span>
        </Link>;
      })}
    </nav>
    </>
  );
}
