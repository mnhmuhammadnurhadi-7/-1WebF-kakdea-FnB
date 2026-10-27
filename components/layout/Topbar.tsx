"use client";

import { Icon } from "./Icon";
import { NotificationMenu } from "./NotificationMenu";
import { ProfileMenu } from "./ProfileMenu";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line-soft bg-white/95 px-6 backdrop-blur">
      <label className="flex h-10 w-[420px] max-w-full items-center gap-2.5 rounded-input border border-line bg-app px-3.5 text-[13.5px] text-muted shadow-inset focus-within:border-brand focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/15">
        <Icon name="search" size={17} stroke={2} />
        <input
          type="search"
          placeholder="Cari transaksi atau menu"
          className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
        />
      </label>

      <div className="flex items-center gap-[18px]">
        <NotificationMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}
