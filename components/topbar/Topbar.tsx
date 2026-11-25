"use client";

import Image from "next/image";
import { NotificationMenu } from "./NotificationMenu";
import { ProfileMenu } from "./ProfileMenu";

type TopbarProps = {
  onMenuClick?: () => void;
  menuOpen?: boolean;
};

export function Topbar({ onMenuClick, menuOpen = false }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line-soft bg-white/95 px-4 backdrop-blur sm:px-6 lg:justify-end">
      <div className="flex items-center gap-2.5 lg:hidden">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Buka menu navigasi"
          aria-expanded={menuOpen}
          aria-controls="dashboard-sidebar"
          className="inline-flex size-10 items-center justify-center rounded-xl border border-line bg-white text-navy transition hover:bg-app"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <Image src="/soju.png" alt="" width={28} height={28} loading="eager" className="size-7 shrink-0 rounded-full object-cover" />
          <span className="text-[15px] font-extrabold tracking-tight text-navy">SOJU</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-[18px]">
        <NotificationMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}
