"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Icon, type IconName } from "./Icon";
import { useDismiss } from "./useDismiss";

// Sementara tetap. Nanti ambil dari api.auth.getMe().
const USER = { name: "Bu Pemilik", role: "Admin utama", email: "bupemilik@sojukuliner.com", initials: "BP" };

export function ProfileMenu() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);

  function keluar() {
    api.auth.logout();
    router.push("/login");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 text-left transition hover:bg-app"
      >
        <span className="flex size-[38px] items-center justify-center rounded-full bg-[linear-gradient(160deg,#FFB547,#F08A00)] text-[13px] font-extrabold text-white">
          {USER.initials}
        </span>
        <span>
          <span className="block text-[13.5px] font-bold leading-tight">{USER.name}</span>
          <span className="block text-[11px] text-muted">{USER.role}</span>
        </span>
        <Icon name="down" size={16} stroke={2.2} className={"text-muted transition " + (open ? "rotate-180" : "")} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-full z-40 mt-3 w-[300px] rounded-[20px] border border-line-soft bg-white p-2 shadow-pop">
          <div className="mb-1.5 border-b border-[#eef0f5] px-3 pb-3.5 pt-3">
            <p className="text-sm font-bold">{USER.name}</p>
            <p className="text-xs text-muted">{USER.email}</p>
          </div>

          <MenuLink href="/profile" icon="gear" title="Pengaturan" sub="Profil dan kata sandi" onClick={close} />
          <MenuLink href="/audit" icon="history" title="Riwayat & Audit" onClick={close} />

          <div className="mx-1 my-1.5 h-px bg-[#eef0f5]" />

          <button
            type="button"
            role="menuitem"
            onClick={keluar}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-bad-tint"
          >
            <span className="flex size-[34px] items-center justify-center rounded-[11px] bg-bad-tint text-bad">
              <Icon name="logout" size={17} />
            </span>
            <span className="text-sm font-semibold text-bad-text">Keluar</span>
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, icon, title, sub, onClick }: { href: string; icon: IconName; title: string; sub?: string; onClick: () => void }) {
  return (
    <Link href={href} role="menuitem" onClick={onClick} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-app">
      <span className="flex size-[34px] items-center justify-center rounded-[11px] bg-app text-body">
        <Icon name={icon} size={17} />
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold">{title}</span>
        {sub && <span className="text-[11.5px] text-faint">{sub}</span>}
      </span>
    </Link>
  );
}
