"use client";

import { NotificationMenu } from "./NotificationMenu";
import { ProfileMenu } from "./ProfileMenu";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end border-b border-line-soft bg-white/95 px-6 backdrop-blur">
      <div className="flex items-center gap-[18px]">
        <NotificationMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}
