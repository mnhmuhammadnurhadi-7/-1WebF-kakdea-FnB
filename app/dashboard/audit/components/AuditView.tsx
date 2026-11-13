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
        });

        if (response.success && response.data.logs) {
          const formattedLogs = response.data.logs.map((log: RawAuditLog) => ({
            id: String(log.id),
            tanggal: new Date(log.createdAt || log.dibuatPada).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
            jam: new Date(log.createdAt || log.dibuatPada).toLocaleTimeString("id-ID"),
            sheet: (log.sheet || log.tabelTarget || "transaksi").toLowerCase(),
            recordLabel: log.recordLabel || log.labelRecord || "Record",
            action: log.action || log.aksi || "UBAH",
            source: log.source || log.sumber || "MANUAL",
            actor: log.user?.nama || "Pengguna",
            detail: log.detail || "",
            perubahan: log.dataSebelum || log.dataSesudah ? [
              ...(log.dataSebelum ? [{ field: "Sebelum", sebelum: log.dataSebelum, sesudah: "" }] : []),
              ...(log.dataSesudah ? [{ field: "Sesudah", sebelum: "", sesudah: log.dataSesudah }] : []),
            ] : undefined,
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
  }, [sheet, source, search, reloadKey]);

  const searchTerm = search.trim().toLowerCase();
  const filteredLogs = logs.filter((l) => {
    const sheetOk = sheet === "semua" || l.sheet.includes(sheet.toLowerCase());
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
    { l: "Total Aktivitas (30h)", v: filteredLogs.length, icon: "doc" },
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
