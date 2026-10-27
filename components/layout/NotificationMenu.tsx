"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Icon, type IconName } from "./Icon";
import { useDismiss } from "./useDismiss";

type Notif = {
  id: string;
  icon: IconName;
  tone: "warn" | "info" | "bad" | "ok";
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

/** Belum ada endpoint notifikasi di backend. Isi dari API nanti; kosong = tampil "Tidak ada notifikasi baru". */
const NOTIFS: Notif[] = [];

const TONE: Record<Notif["tone"], string> = {
  warn: "bg-[#fff4dc] text-[#b7791f]",
  info: "bg-[#e8f0ff] text-brand",
  bad: "bg-bad-tint text-bad",
  ok: "bg-ok-tint text-ok-text",
};

export function NotificationMenu() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [items, setItems] = useState(NOTIFS);

  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);

  const unread = items.filter((n) => n.unread).length;
  const shown = onlyUnread ? items.filter((n) => n.unread) : items;

  const markRead = (id: string) => setItems((l) => l.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  const markAll = () => setItems((l) => l.map((n) => ({ ...n, unread: false })));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={unread ? `Notifikasi, ${unread} belum dibaca` : "Notifikasi"}
        aria-expanded={open}
        className={
          "relative flex size-10 items-center justify-center rounded-xl border transition " +
          (open ? "border-[#c5d8ff] bg-[#e8f0ff] text-brand" : "border-line bg-white shadow-btn")
        }
      >
        <Icon name="bell" size={19} />
        {unread > 0 &&
          (open ? (
            <span className="absolute -right-[7px] -top-[7px] flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-bad px-1 text-[11px] font-extrabold text-white">
              {unread}
            </span>
          ) : (
            <span className="absolute right-2.5 top-2 size-[9px] rounded-full border-2 border-white bg-bad" />
          ))}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-3 w-[400px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[22px] border border-line-soft bg-white shadow-pop">
          <div className="flex items-center justify-between px-[18px] pb-1 pt-[18px]">
            <span className="text-lg font-bold tracking-[-.03em]">Notifikasi</span>
            <button type="button" onClick={markAll} disabled={!unread} className="text-[12.5px] font-semibold text-brand disabled:text-faint">
              Tandai semua dibaca
            </button>
          </div>

          <div className="flex gap-1.5 px-[18px] pb-2.5 pt-3">
            <button
              type="button"
              onClick={() => setOnlyUnread(false)}
              className={
                "rounded-full px-3.5 py-1.5 text-[12.5px] " +
                (!onlyUnread ? "bg-brand font-bold text-white shadow-[0_6px_14px_rgba(25,105,255,.3)]" : "bg-[#eef2fb] font-semibold text-body")
              }
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setOnlyUnread(true)}
              className={
                "rounded-full px-3.5 py-1.5 text-[12.5px] " +
                (onlyUnread ? "bg-brand font-bold text-white shadow-[0_6px_14px_rgba(25,105,255,.3)]" : "bg-[#eef2fb] font-semibold text-body")
              }
            >
              Belum dibaca ({unread})
            </button>
          </div>

          <ul className="max-h-[380px] overflow-y-auto">
            {shown.length === 0 && <li className="px-[18px] py-10 text-center text-sm text-muted">Tidak ada notifikasi baru.</li>}
            {shown.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  className={"flex w-full items-start gap-3 border-b border-[#eef0f5] px-[18px] py-3.5 text-left transition hover:bg-[#f7faff] " + (n.unread ? "bg-[#f7faff]" : "")}
                >
                  <span className={"mt-[7px] size-2 shrink-0 rounded-full " + (n.unread ? "bg-brand shadow-[0_0_0_3px_rgba(25,105,255,.15)]" : "bg-transparent")} />
                  <span className={"flex size-10 shrink-0 items-center justify-center rounded-[13px] " + TONE[n.tone]}>
                    <Icon name={n.icon} size={20} />
                  </span>
                  <span className="flex flex-1 flex-col gap-[3px]">
                    <span className={"text-sm " + (n.unread ? "font-bold" : "font-semibold")}>{n.title}</span>
                    <span className="text-[12.5px] leading-snug text-muted">{n.body}</span>
                    <span className="mt-0.5 text-[11.5px] font-semibold text-faint">{n.time}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <Link
            href="/audit"
            onClick={close}
            className="block bg-[#f7f5f0] px-[18px] py-3.5 text-center text-[13.5px] font-bold text-brand hover:underline"
          >
            Lihat semua di Riwayat &amp; Audit
          </Link>
        </div>
      )}
    </div>
  );
}
