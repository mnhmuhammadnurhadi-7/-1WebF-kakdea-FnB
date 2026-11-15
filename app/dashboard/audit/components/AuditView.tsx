"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AuditHeader } from "./AuditHeader";
import { FilterBar } from "./FilterBar";
import { LogTimeline } from "./LogTimeline";
import { StatCards, type Stat } from "./StatCards";
import type { AuditLog, RawAuditLog } from "./types";

/** Logic (fetch log, filter sheet/sumber, ringkasan) dari kode teman; tampilannya memakai komponen di atas. */
export function AuditView() {
  const [sheet, setSheet] = useState("semua");
  const [source, setSource] = useState("semua");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [appliedDateFrom, setAppliedDateFrom] = useState("");
  const [appliedDateTo, setAppliedDateTo] = useState("");

  const parseSnapshot = (snapshot: unknown): Record<string, unknown> => {
    if (!snapshot) return {};
    if (typeof snapshot === "object") return snapshot as Record<string, unknown>;
    try {
      const parsed = JSON.parse(String(snapshot));
      return parsed && typeof parsed === "object" ? parsed : { nilai: parsed };
    } catch {
      return { nilai: String(snapshot) };
    }
  };

  const fieldLabels: Record<string, string> = {
    id: "ID Data", kode: "Kode", tanggal: "Tanggal", unitBisnis: "Unit Bisnis",
    jenisTransaksiId: "Jenis Transaksi", namaTransaksi: "Nama Transaksi", detail: "Keterangan",
    jenisKas: "Jenis Kas", nominal: "Nominal", debit: "Debit", kredit: "Kredit",
    customData: "Data Tambahan", sumberInput: "Sumber Input", dibuatOleh: "Dibuat Oleh",
    dibuatPada: "Waktu Dibuat", diubahPada: "Waktu Diubah", namaBarang: "Nama Produk",
    hargaDefault: "Harga", aktif: "Status Aktif", key: "Nama Konten", judul: "Judul",
    subJudul: "Subjudul", konten: "Konten", tabelTarget: "Tabel", targetId: "ID Data",
  };
  const readableField = (key: string) => fieldLabels[key] || key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
  const readableValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Ya" : "Tidak";
    if (typeof value === "object") return Object.entries(value as Record<string, unknown>)
      .map(([key, nested]) => `${readableField(key)}: ${readableValue(nested)}`).join(" · ");
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      return new Date(value).toLocaleString("id-ID");
    }
    return String(value);
  };
  const readableFieldValue = (key: string, value: unknown): string => {
    if (key === "nominal" && value !== null && value !== undefined && value !== "") {
      const amount = Number(value);
      if (Number.isFinite(amount)) return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
    }
    return readableValue(value);
  };
  const makeChanges = (action: string, beforeValue: unknown, afterValue: unknown, customColumnNames: Record<string, string> = {}, productNames: Record<string, string> = {}, tableTarget = "") => {
    const before = parseSnapshot(beforeValue);
    const after = parseSnapshot(afterValue);
    const changes: { field: string; sebelum: string; sesudah: string }[] = [];
    const normalizedAction = action.toUpperCase();
    const isAdd = ["TAMBAH", "CREATE", "ADDED"].includes(normalizedAction);
    const isDelete = ["HAPUS", "DELETE", "REMOVED"].includes(normalizedAction);
    const hiddenFields = new Set(["id", "kode", "dibuatOleh", "dibuatPada", "diubahPada", "sumberInput"]);
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const key of keys) {
      if (hiddenFields.has(key)) continue;
      const left = before[key];
      const right = after[key];
      if (!isAdd && !isDelete && JSON.stringify(left) === JSON.stringify(right)) continue;
      if (key === "customData" && (left || right) && typeof (left || right) === "object") {
        const oldCustom = (left || {}) as Record<string, unknown>;
        const newCustom = (right || {}) as Record<string, unknown>;
        for (const columnId of new Set([...Object.keys(oldCustom), ...Object.keys(newCustom)])) {
          if (isAdd || isDelete || JSON.stringify(oldCustom[columnId]) !== JSON.stringify(newCustom[columnId])) {
            changes.push({ field: `Data tambahan · ${customColumnNames[columnId] || `kolom ${columnId}`}`, sebelum: readableValue(oldCustom[columnId]), sesudah: readableValue(newCustom[columnId]) });
          }
        }
      } else if (key === "konten" && (before.key === "produk_unggulan" || after.key === "produk_unggulan")) {
        const productList = (value: unknown) => {
          if (typeof value !== "string") return readableValue(value);
          try {
            const ids = JSON.parse(value);
            if (Array.isArray(ids)) return ids.map((id) => productNames[String(id)] || `Produk #${id}`).join("\n") || "Tidak ada produk";
          } catch {
            return readableValue(value);
          }
          return readableValue(value);
        };
        changes.push({ field: readableField(key), sebelum: productList(left), sesudah: productList(right) });
      } else {
        changes.push({ field: readableField(key), sebelum: readableFieldValue(key, left), sesudah: readableFieldValue(key, right) });
      }
    }
    const summaryFields = new Set(["Nama Transaksi", "Keterangan", "Nominal", "Tanggal", "Nama Produk", "Judul", "Nama Konten", "Nama Tabel", "Nama Kolom", "Konten"]);
    const isFreeTableRow = tableTarget === "baris_tabel_bebas";
    return ((isAdd || isDelete) && !isFreeTableRow ? changes.filter((change) => summaryFields.has(change.field) || change.field.startsWith("Data tambahan")) : changes).slice(0, 4);
  };
  const tableLabels: Record<string, string> = {
    produk_unggulan: "Produk Unggulan", transaksi: "Transaksi", tabel_bebas: "Pendataan", baris_tabel_bebas: "Pendataan",
    cms_content: "Konten Situs", produk: "Produk", jenis_transaksi: "Jenis Transaksi",
  };
  const readableTable = (table: string) => tableLabels[table.toLowerCase()]
    || table.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  // Fetch audit logs on mount and when filters change
  useEffect(() => {
    async function fetchAuditLogs() {
      try {
        setLoading(true);
        setLoadError(false);
        const response = await api.auditLog.getAll({
          sheet: sheet === "semua" ? undefined : sheet.toLowerCase(),
          source: source === "semua" ? undefined : source.toUpperCase(),
          search: search.trim() || undefined,
          page: 1,
          limit: 50,
          dateFrom: appliedDateFrom || undefined,
          dateTo: appliedDateTo || undefined,
        });

        if (response.success && response.data.logs) {
          const formattedLogs = response.data.logs.map((log: RawAuditLog) => ({
            id: String(log.id),
            tanggal: new Date(log.createdAt || log.dibuatPada).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
            jam: new Date(log.createdAt || log.dibuatPada).toLocaleTimeString("id-ID"),
            sheet: readableTable(log.sheet || log.tabelTarget || "transaksi"),
            recordLabel: log.recordLabel || log.labelRecord || "Record",
            action: log.action || log.aksi || "UBAH",
            source: log.source || log.sumber || "MANUAL",
            actor: log.user?.nama || "Pengguna",
            detail: log.detail || "",
            perubahan: log.dataSebelum || log.dataSesudah ? makeChanges(log.action || log.aksi || "UBAH", log.dataSebelum, log.dataSesudah, log.customColumnNames || {}, log.productNames || {}, log.tabelTarget || "") : undefined,
          }));
          setLogs(formattedLogs);
          setLoadError(false);
        }
      } catch (error) {
        console.error("Error fetching audit logs:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAuditLogs();
  }, [sheet, source, search, reloadKey, appliedDateFrom, appliedDateTo]);

  const searchTerm = search.trim().toLowerCase();
  const filteredLogs = logs.filter((l) => {
    const sheetOk = sheet === "semua" || l.sheet.toLowerCase().includes(sheet.toLowerCase());
    const sourceOk = source === "semua" || l.source.toUpperCase() === source.toUpperCase();
    const searchableText = [
      l.id,
      l.tanggal,
      l.jam,
      l.sheet,
      l.recordLabel,
      l.action,
      l.source,
      l.actor,
      l.detail,
      ...(l.perubahan?.flatMap((change) => [change.field, change.sebelum, change.sesudah]) ?? []),
    ].join(" ").toLowerCase();
    return sheetOk && sourceOk && (!searchTerm || searchableText.includes(searchTerm));
  });

  const statsRingkasan: Stat[] = [
    { l: appliedDateFrom || appliedDateTo ? "Aktivitas Terpilih" : "Aktivitas (7 Hari)", v: filteredLogs.length, icon: "doc" },
    { l: "Diproses AI", v: filteredLogs.filter((l) => l.source.toUpperCase() === "AI").length, icon: "bot" },
    { l: "Input Manual", v: filteredLogs.filter((l) => l.source.toUpperCase() === "MANUAL").length, icon: "pencil" },
    { l: "Perubahan Data", v: filteredLogs.filter((l) => ["UPDATE", "DELETE", "UBAH", "HAPUS"].includes(l.action.toUpperCase())).length, icon: "swap" },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <AuditHeader />
        <StatCards stats={statsRingkasan} />
        <FilterBar
          sheet={sheet}
          onSheet={setSheet}
          source={source}
          onSource={setSource}
          search={search}
          onSearch={setSearch}
          dateFrom={dateFrom}
          onDateFrom={setDateFrom}
          dateTo={dateTo}
          onDateTo={setDateTo}
          activeDateFrom={appliedDateFrom}
          activeDateTo={appliedDateTo}
          onApplyDates={() => { setAppliedDateFrom(dateFrom); setAppliedDateTo(dateTo); }}
          onClearDates={() => { setDateFrom(""); setDateTo(""); setAppliedDateFrom(""); setAppliedDateTo(""); }}
          dateRangeActive={Boolean(appliedDateFrom || appliedDateTo)}
        />
        <LogTimeline
          loadError={loadError}
          loading={loading}
          logs={filteredLogs}
          expandedId={expandedId}
          onToggle={(id) => setExpandedId(expandedId === id ? null : id)}
          onRetry={() => setReloadKey((n) => n + 1)}
        />
      </div>
    </>
  );
}
