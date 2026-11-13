"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { greeting } from "./format";

const OWNER = "Bu Pemilik";

type WelcomeHeaderProps = { period: string | null };

export function WelcomeHeader({ period }: WelcomeHeaderProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const displayedDate = selectedDate
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${selectedDate}T00:00:00`))
    : period || "Pilih tanggal";

  return (
    <section className="relative isolate overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-navy via-navy to-brand px-5 py-6 text-white shadow-navy sm:px-7 sm:py-7 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 hidden size-80 rounded-full border-[34px] border-sky/10 xl:block" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-16 hidden size-56 rounded-full border border-white/10 xl:block" />

      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.17em] text-sky">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-sky" />
            Dapur Soju <span className="font-medium text-white/55">/ Pusat Kendali</span>
          </p>
          <h1 className="mt-3 text-[28px] font-bold leading-[1.15] tracking-[-.035em] sm:text-[34px]">
            {greeting()}, {OWNER}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
            Pantau ringkasan kas dan aktivitas operasional tokomu hari ini.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 self-start xl:items-end">
          <span className="text-[10px] font-bold uppercase tracking-[.14em] text-white/70">Pilih tanggal</span>
          <label className="relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-white/80 bg-white px-4 py-2 text-[13px] font-bold text-navy shadow-btn transition hover:bg-sky-tint focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky">
            <Icon name="calendar" size={17} stroke={1.9} className="text-brand" />
            <span>{displayedDate}</span>
            <Icon name="down" size={14} stroke={2} className="ml-1 text-brand" />
            <input
              aria-label="Pilih tanggal"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            />
          </label>
          <span className="text-[10px] text-white/60">Tanggal pilihan tidak mengubah filter grafik.</span>
        </div>
      </div>
    </section>
  );
}
