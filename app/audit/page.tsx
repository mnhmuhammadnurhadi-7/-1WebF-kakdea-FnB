"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChipSelector, type ChipOption } from "@/components/ui/ChipSelector";
import { api } from "@/lib/api";
import { ErrorState } from "@/components/ui/ErrorState";

const sheetTabs: ChipOption[] = [
  { id: "semua", label: "Semua" },
  { id: "transaksi", label: "Transaksi" },
  { id: "stok", label: "Stok" },
  { id: "order", label: "Order" },
  { id: "tabel_bebas", label: "Tabel Bebas" },
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
    <polyline points="12 6 12 16 14" />
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

type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "TAMBAH" | "UBAH" | "HAPUS" | string;
type AuditSource = "AI" | "MANUAL" | string;

interface AuditLog {
  id: string;
  tanggal: string;
  jam: string;
  sheet: string;
  recordLabel: string;
  action: AuditAction;
  source: AuditSource;
  actor: string;
  detail: string;
  perubahan?: { field: string; sebelum: string; sesudah: string }[];
}

const sheetTone: Record<string, string> = {
  transaksi: "source",
  stok: "ai",
  order: "manual",
  tabel_bebas: "new",
  user: "custom",
};

const actionMetaMap: Record<string, { label: string; icon: React.ReactNode; tone: string }> = {
  CREATE: {
    label: "Tambah",
    icon: PlusIcon,
    tone: "bg-teal-success-bg text-teal-success",
  },
  TAMBAH: {
    label: "Tambah",
    icon: PlusIcon,
    tone: "bg-teal-success-bg text-teal-success",
  },
  UPDATE: {
    label: "Ubah",
    icon: EditIcon,
    tone: "bg-yellow-tag-bg text-yellow-tag-ink",
  },
  UBAH: {
    label: "Ubah",
    icon: EditIcon,
    tone: "bg-yellow-tag-bg text-yellow-tag-ink",
  },
  DELETE: {
    label: "Hapus",
    icon: TrashIcon,
    tone: "bg-danger-bg text-danger",
  },
  HAPUS: {
    label: "Hapus",
    icon: TrashIcon,
    tone: "bg-danger-bg text-danger",
  },
};

function getActionMeta(action: string) {
  const key = (action || "").toUpperCase();
  return (
    actionMetaMap[key] || {
      label: action || "Aksi",
      icon: EditIcon,
      tone: "bg-card-muted text-muted",
    }
  );
}

export default function AuditPage() {
  const [sheet, setSheet] = useState("semua");
  const [source, setSource] = useState("semua");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Fetch audit logs on mount and when filters change
  useEffect(() => {
    async function fetchAuditLogs() {
      try {
        setLoading(true);
        const response = await api.auditLog.getAll({
          sheet: sheet === 'semua' ? undefined : sheet.toLowerCase(),
          source: source === 'semua' ? undefined : source.toUpperCase(),
          page: 1,
          limit: 50,
        });

        if (response.success && response.data.logs) {
          const formattedLogs = response.data.logs.map((log: any) => ({
            id: String(log.id),
            tanggal: new Date(log.createdAt || log.dibuatPada).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
            jam: new Date(log.createdAt || log.dibuatPada).toLocaleTimeString('id-ID'),
            sheet: (log.sheet || log.tabelTarget || 'transaksi').toLowerCase(),
            recordLabel: log.recordLabel || log.labelRecord || 'Record',
            action: log.action || log.aksi || 'UBAH',
            source: log.source || log.sumber || 'MANUAL',
            actor: log.user?.nama || 'Pengguna',
            detail: log.detail || '',
            perubahan: log.dataSebelum || log.dataSesudah ? [
              ...(log.dataSebelum ? [{ field: 'Sebelum', sebelum: log.dataSebelum, sesudah: '' }] : []),
              ...(log.dataSesudah ? [{ field: 'Sesudah', sebelum: '', sesudah: log.dataSesudah }] : []),
            ] : undefined,
          }));
          setLogs(formattedLogs);
          setLoadError(false);
        }
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAuditLogs();
  }, [sheet, source, reloadKey]);

  const filteredLogs = logs.filter((l) => {
    const sheetOk = sheet === "semua" || l.sheet.includes(sheet.toLowerCase());
    const sourceOk = source === "semua" || l.source.toUpperCase() === source.toUpperCase();
    return sheetOk && sourceOk;
  });

  const statsRingkasan = [
    { l: "Total Aktivitas (30h)", v: filteredLogs.length, tone: "teal-active", icon: ClockIcon },
    { l: "Diproses AI", v: filteredLogs.filter((l) => l.source.toUpperCase() === "AI").length, tone: "teal-active", icon: ClockIcon },
    { l: "Input Manual", v: filteredLogs.filter((l) => l.source.toUpperCase() === "MANUAL").length, tone: "accent", icon: ClockIcon },
    { l: "Perubahan Data", v: filteredLogs.filter((l) => ["UPDATE", "DELETE", "UBAH", "HAPUS"].includes(l.action.toUpperCase())).length, tone: "danger", icon: ClockIcon },
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
            {loadError ? (
              <div className="p-5 sm:p-8"><ErrorState title="Riwayat belum berhasil dimuat" description="Periksa koneksi atau sesi masuk Anda. Catatan audit tidak dihapus; silakan coba lagi." onRetry={() => setReloadKey((n) => n + 1)} /></div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card-muted text-muted">
                  {ClockIcon}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-[16px] font-semibold text-ink">
                    Memuat catatan audit...
                  </span>
                </div>
              </div>
            ) : filteredLogs.length === 0 ? (
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

                {filteredLogs.map((l, idx) => {
                  const expanded = expandedId === l.id;
                  const meta = getActionMeta(l.action);
                  const last = idx === filteredLogs.length - 1;
                  const sTone = sheetTone[l.sheet] || "source";
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
                            <Badge variant={sTone as any}>
                              {l.sheet.toUpperCase()}
                            </Badge>
                            <Badge variant={l.source.toUpperCase() === "AI" ? "ai" : "manual"}>
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
                          <div className="flex items-center gap-3 text-[12px] text-muted">
                            <span>{l.tanggal} · {l.jam}</span>
                            <span>oleh <strong className="text-ink font-semibold">{l.actor}</strong></span>
                          </div>
                        </div>

                        {l.detail && (
                          <p className="text-[13px] text-muted leading-relaxed">
                            {l.detail}
                          </p>
                        )}

                        {l.perubahan && l.perubahan.length > 0 && (
                          <div className="flex flex-col gap-2 pt-1">
                            <button
                              onClick={() => setExpandedId(expanded ? null : l.id)}
                              className="self-start text-[12px] font-semibold text-accent hover:underline flex items-center gap-1"
                            >
                              {expanded ? "Sembunyikan detail perubahan ▲" : `Lihat ${l.perubahan.length} detail perubahan ▼`}
                            </button>

                            {expanded && (
                              <div className="flex flex-col gap-2 rounded-xl border border-border bg-card-alt p-3 text-[12px]">
                                {l.perubahan.map((p, pIdx) => (
                                  <div key={pIdx} className="flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-ink">{p.field}:</span>
                                    {p.sebelum && <span className="text-danger line-through">{p.sebelum}</span>}
                                    {p.sebelum && p.sesudah && <span className="text-muted">➔</span>}
                                    {p.sesudah && <span className="text-teal-success font-semibold">{p.sesudah}</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
