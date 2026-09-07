"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChipSelector, type ChipOption } from "@/components/ui/ChipSelector";

const sheetTabs: ChipOption[] = [
  { id: "semua", label: "Semua" },
  { id: "transaksi", label: "Transaksi" },
  { id: "stok", label: "Stok" },
  { id: "order", label: "Order" },
  { id: "customer", label: "Customer" },
  { id: "supplier", label: "Supplier" },
  { id: "user", label: "User" },
];

const sourceTabs: ChipOption[] = [
  { id: "semua", label: "Semua Sumber" },
  { id: "AI", label: "AI" },
  { id: "MANUAL", label: "Manual" },
];

const SearchIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const DownloadIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const ClockIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PlusIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const EditIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const TrashIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const SheetIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

type AuditAction = "CREATE" | "UPDATE" | "DELETE";
type AuditSource = "AI" | "MANUAL";
type AuditSheet = "transaksi" | "stok" | "order" | "customer" | "supplier" | "user";

interface AuditLog {
  id: string;
  tanggal: string;
  jam: string;
  sheet: AuditSheet;
  recordLabel: string;
  action: AuditAction;
  source: AuditSource;
  actor: string;
  detail: string;
  perubahan?: { field: string; sebelum: string; sesudah: string }[];
}

const dummyLogs: AuditLog[] = [
  {
    id: "AUD-1290",
    tanggal: "05 Sep 2026",
    jam: "10:32:14",
    sheet: "transaksi",
    recordLabel: "TRX-2026-0189",
    action: "CREATE",
    source: "AI",
    actor: "Asisten AI",
    detail: "Penjualan Produk Rp 185.000 — DM IG Toko Barokah",
  },
  {
    id: "AUD-1289",
    tanggal: "05 Sep 2026",
    jam: "10:31:58",
    sheet: "order",
    recordLabel: "#ORD-0105",
    action: "CREATE",
    source: "AI",
    actor: "Asisten AI",
    detail: "Order baru dari DM Instagram — Toko Barokah",
  },
  {
    id: "AUD-1288",
    tanggal: "05 Sep 2026",
    jam: "09:20:03",
    sheet: "stok",
    recordLabel: "Nugget Ayam 500g",
    action: "UPDATE",
    source: "MANUAL",
    actor: "Bu Pemilik",
    detail: "Perubahan stok (opname fisik)",
    perubahan: [
      { field: "Current Stock", sebelum: "22 pcs", sesudah: "18 pcs" },
    ],
  },
  {
    id: "AUD-1287",
    tanggal: "05 Sep 2026",
    jam: "09:15:42",
    sheet: "transaksi",
    recordLabel: "TRX-2026-0188",
    action: "CREATE",
    source: "AI",
    actor: "Asisten AI",
    detail: "Penjualan Produk Rp 92.000 — GrabFood GF-1044",
  },
  {
    id: "AUD-1286",
    tanggal: "04 Sep 2026",
    jam: "18:44:21",
    sheet: "order",
    recordLabel: "#ORD-0103",
    action: "UPDATE",
    source: "MANUAL",
    actor: "Bu Pemilik",
    detail: "Update status order → Selesai",
    perubahan: [
      { field: "Status", sebelum: "Diproses", sesudah: "Selesai" },
    ],
  },
  {
    id: "AUD-1285",
    tanggal: "04 Sep 2026",
    jam: "16:10:07",
    sheet: "supplier",
    recordLabel: "Warung Sayur Pak Darso",
    action: "CREATE",
    source: "MANUAL",
    actor: "Bu Pemilik",
    detail: "Supplier baru ditambahkan secara manual",
  },
  {
    id: "AUD-1284",
    tanggal: "04 Sep 2026",
    jam: "14:02:55",
    sheet: "customer",
    recordLabel: "Warung Makmur — COD",
    action: "UPDATE",
    source: "MANUAL",
    actor: "Admin Kakak",
    detail: "Update data customer",
    perubahan: [
      { field: "Telepon", sebelum: "0812-0000-0000", sesudah: "0812-1234-5678" },
      { field: "Alamat", sebelum: "-", sesudah: "Jl. Merdeka No. 45, Depok" },
    ],
  },
  {
    id: "AUD-1283",
    tanggal: "04 Sep 2026",
    jam: "11:24:18",
    sheet: "transaksi",
    recordLabel: "TRX-2026-0182",
    action: "CREATE",
    source: "MANUAL",
    actor: "Bu Pemilik",
    detail: "Pembelian Bahan Baku Rp 320.000 — Daging ayam 10kg",
  },
  {
    id: "AUD-1282",
    tanggal: "03 Sep 2026",
    jam: "20:45:33",
    sheet: "transaksi",
    recordLabel: "TRX-2026-0175",
    action: "DELETE",
    source: "MANUAL",
    actor: "Bu Pemilik",
    detail: "Transaksi dibatalkan — double entry (duplikat TRX-2026-0174)",
  },
  {
    id: "AUD-1281",
    tanggal: "03 Sep 2026",
    jam: "09:00:12",
    sheet: "user",
    recordLabel: "Admin Kakak",
    action: "CREATE",
    source: "MANUAL",
    actor: "Bu Pemilik",
    detail: "Akun pengguna baru ditambahkan (role: Admin Operasional)",
  },
];

const sheetTone: Record<AuditSheet, string> = {
  transaksi: "source",
  stok: "ai",
  order: "manual",
  customer: "new",
  supplier: "custom",
  user: "custom",
};

const actionMeta: Record<AuditAction, { label: string; icon: React.ReactNode; tone: string }> = {
  CREATE: {
    label: "Tambah",
    icon: PlusIcon,
    tone: "bg-teal-success-bg text-teal-success",
  },
  UPDATE: {
    label: "Ubah",
    icon: EditIcon,
    tone: "bg-yellow-tag-bg text-yellow-tag-ink",
  },
  DELETE: {
    label: "Hapus",
    icon: TrashIcon,
    tone: "bg-danger-bg text-danger",
  },
};

export default function AuditPage() {
  const [sheet, setSheet] = useState("semua");
  const [source, setSource] = useState("semua");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const logs = dummyLogs.filter((l) => {
    const sheetOk = sheet === "semua" || l.sheet === sheet;
    const sourceOk = source === "semua" || l.source === source;
    return sheetOk && sourceOk;
  });

  const statsRingkasan = [
    { l: "Total Aktivitas (30h)", v: logs.length, tone: "teal-active", icon: ClockIcon },
    { l: "Diproses AI", v: logs.filter((l) => l.source === "AI").length, tone: "teal-active", icon: ClockIcon },
    { l: "Input Manual", v: logs.filter((l) => l.source === "MANUAL").length, tone: "accent", icon: ClockIcon },
    { l: "Perubahan Data", v: logs.filter((l) => l.action === "UPDATE" || l.action === "DELETE").length, tone: "danger", icon: ClockIcon },
  ];

  return (
    <AppLayout activeMenu="audit">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-[28px] font-semibold text-ink leading-tight">
              Riwayat & Audit
            </h1>
            <p className="text-[14px] text-muted">
              Catat semua perubahan data: siapa, kapan, apa yang diubah, dan sumbernya (AI / Manual).
            </p>
          </div>
        </div>

        {/* Ringkasan stat */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsRingkasan.map((s) => (
            <Card key={s.l} className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-mint text-teal-active">
                {s.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-medium text-muted">{s.l}</span>
                <span className={`font-heading text-[22px] font-bold text-${s.tone}`}>
                  {s.v}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Filter Bar */}
        <Card className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2.5 text-muted flex-1 min-w-[240px]">
              {SearchIcon}
              <input
                type="text"
                placeholder="Cari ID audit, deskripsi, nama record, actor…"
                className="w-full bg-transparent text-[14px] text-ink placeholder:text-muted-light focus:outline-none"
              />
            </div>
            <Button variant="outline" size="md" leftIcon={ClockIcon}>
              Rentang Tanggal
            </Button>
            <Button variant="secondary" size="md" leftIcon={DownloadIcon}>
              Export Audit
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted uppercase tracking-wide shrink-0">
                {SheetIcon}
                Sheet
              </span>
              <div className="flex flex-wrap gap-1.5">
                <ChipSelector options={sheetTabs} value={sheet} onChange={setSheet} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted uppercase tracking-wide shrink-0">
                🔍 Sumber
              </span>
              <div className="flex flex-wrap gap-1.5">
                <ChipSelector options={sourceTabs} value={source} onChange={setSource} />
              </div>
            </div>
          </div>
        </Card>

        {/* Audit Timeline */}
        <Card className="p-0 overflow-hidden" padding="none">
          <div className="flex flex-col">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card-muted text-muted">
                  {SearchIcon}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-[16px] font-semibold text-ink">
                    Tidak ada catatan audit
                  </span>
                  <span className="text-[13px] text-muted max-w-sm">
                    Coba ubah filter sheet / sumber, atau lakukan aksi apa pun di aplikasi Buku Dapur.
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-10 top-0 bottom-0 w-px bg-border" />

                {logs.map((l, idx) => {
                  const expanded = expandedId === l.id;
                  const meta = actionMeta[l.action];
                  const last = idx === logs.length - 1;
                  return (
                    <div
                      key={l.id}
                      className={`relative px-6 py-4 hover:bg-card-alt/70 transition-colors ${
                        last ? "" : "border-b border-border"
                      }`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-6 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border shadow-card z-10">
                        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${meta.tone}`}>
                          {meta.icon}
                        </span>
                      </div>

                      <div className="pl-14 flex flex-col gap-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={sheetTone[l.sheet] as any}>
                              {l.sheet.toUpperCase()}
                            </Badge>
                            <Badge variant={l.source === "AI" ? "ai" : "manual"}>
                              {l.source}
                            </Badge>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${meta.tone}`}
                            >
                              {meta.label}
                            </span>
                            <span className="font-heading text-[14px] font-bold text-ink">
                              {l.recordLabel}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex flex-col items-end">
                              <span className="text-[13px] font-semibold text-ink">
                                {l.tanggal}
                              </span>
                              <span className="text-[11px] text-muted flex items-center gap-1">
                                {ClockIcon}
                                {l.jam}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[12px] font-semibold text-ink">
                                {l.actor}
                              </span>
                              <span className="text-[11px] text-muted">ID: {l.id}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <p className="text-[14px] text-ink leading-relaxed">
                              {l.detail}
                            </p>
                            {expanded && l.perubahan && l.perubahan.length > 0 && (
                              <div className="mt-2 rounded-xl border border-border bg-card p-4">
                                <div className="text-[12px] font-bold text-muted uppercase tracking-wide mb-3">
                                  Detail Perubahan Field
                                </div>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-[13px]">
                                    <thead>
                                      <tr className="text-muted text-[12px]">
                                        <th className="text-left py-2 pr-4 font-semibold">
                                          Field
                                        </th>
                                        <th className="text-left py-2 pr-4 font-semibold">
                                          Sebelum
                                        </th>
                                        <th className="text-left py-2 font-semibold">
                                          Sesudah
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                      {l.perubahan.map((p, pi) => (
                                        <tr key={pi}>
                                          <td className="py-2.5 pr-4 font-medium text-ink whitespace-nowrap">
                                            {p.field}
                                          </td>
                                          <td className="py-2.5 pr-4">
                                            <span className="inline-flex items-center rounded-md bg-danger-bg px-2 py-1 text-[12px] font-medium text-danger whitespace-nowrap">
                                              {p.sebelum}
                                            </span>
                                          </td>
                                          <td className="py-2.5">
                                            <span className="inline-flex items-center rounded-md bg-teal-success-bg px-2 py-1 text-[12px] font-medium text-teal-success whitespace-nowrap">
                                              {p.sesudah}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>

                          {l.perubahan && l.perubahan.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setExpandedId(expanded ? null : l.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-accent hover:bg-accent-tag transition-colors shrink-0"
                            >
                              {expanded ? "Sembunyikan detail" : `Lihat ${l.perubahan.length} perubahan`}
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${expanded ? "rotate-180" : ""}`}>
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination placeholder */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-3.5 bg-card-alt">
            <span className="text-[12px] text-muted">
              Menampilkan <b className="text-ink">{logs.length}</b> dari <b className="text-ink">{dummyLogs.length}</b> total catatan audit
            </span>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm">
                ‹ Sebelumnya
              </Button>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-teal-active text-white text-[13px] font-bold">
                1
              </span>
              <Button variant="ghost" size="sm">
                2
              </Button>
              <Button variant="ghost" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Berikutnya ›
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
