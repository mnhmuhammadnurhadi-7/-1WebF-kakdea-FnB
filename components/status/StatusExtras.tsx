"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { StatusExtra } from "./presets";

function Pill({ children, tone = "white" }: { children: React.ReactNode; tone?: "white" | "ok" }) {
  return (
    <span className={"inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold shadow-btn " + (tone === "ok" ? "border border-ok/25 bg-ok-tint text-ok-text" : "bg-white text-body")}>
      {children}
    </span>
  );
}

function Incident({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 text-[12px] shadow-btn">
      <span className="text-body">ID Insiden:</span>
      <span className="font-mono font-bold text-brand">{id}</span>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(id);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="rounded-full bg-sky-tint px-3 py-1 text-[11px] font-bold text-navy transition hover:brightness-95"
      >
        {copied ? "Tersalin" : "Salin ID"}
      </button>
    </div>
  );
}

function Countdown() {
  const [sec, setSec] = useState(28);
  useEffect(() => {
    const t = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-app px-4 py-3">
      <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-full border-4 border-brand text-brand">
        <span className="tabular text-[17px] font-extrabold leading-none">{sec}</span>
        <span className="text-[8px] font-bold">DETIK</span>
      </span>
      <div className="text-left">
        <div className="text-[13px] font-bold text-ink">Penyelarasan Data Otomatis</div>
        <div className="text-[12px] text-body">Mohon tunggu, pola sistem dan kestabilan data kembali ke sinkronisasi.</div>
      </div>
    </div>
  );
}

function Diagnostics() {
  const rows = [
    { n: "Buku Kas", s: "TERPUTUS" },
    { n: "Stok & Gudang", s: "TERPUTUS" },
    { n: "Asisten AI", s: "OFFLINE" },
  ];
  return (
    <div className="rounded-2xl bg-white p-4 text-left shadow-btn">
      <div className="mb-2 text-[10px] font-extrabold tracking-[.1em] text-faint">DIAGNOSTIK SUBSISTEM DAPUR</div>
      <div className="grid grid-cols-3 gap-2">
        {rows.map((r) => (
          <div key={r.n} className="flex flex-col gap-1 rounded-xl bg-app px-3 py-2">
            <span className="text-[12px] font-semibold text-ink">{r.n}</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-bad"><span className="size-1.5 rounded-full bg-bad" />{r.s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type StatusExtrasProps = { extra?: StatusExtra; incidentId?: string };

export function StatusExtras({ extra, incidentId }: StatusExtrasProps) {
  const pathname = usePathname();
  if (!extra) return null;
  switch (extra) {
    case "path":
      return <Pill>Alamat <code className="rounded bg-bad-tint px-1.5 py-0.5 font-mono text-bad-text">{pathname}</code> tidak dikenali</Pill>;
    case "incident":
      return <Incident id={incidentId || "INC-TIDAK-TERSEDIA"} />;
    case "diagnostics":
      return <Diagnostics />;
    case "countdown":
      return <Countdown />;
    case "offlineChips":
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Pill>Mencoba lagi dalam beberapa detik</Pill>
          <Pill>Catatan nota aman tersimpan di perangkat</Pill>
        </div>
      );
    case "syncPill":
      return <Pill tone="ok">Semua catatan berhasil disinkronkan ke server pusat (0 konflik)</Pill>;
    case "maintCode":
      return <Pill><span className="font-extrabold text-bad">KODE STATUS:</span> E10-MAINT</Pill>;
  }
}
