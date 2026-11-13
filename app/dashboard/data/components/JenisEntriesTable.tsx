"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { TH, TH_CENTER, TH_RIGHT } from "./constants";
import { EditEntryModal } from "./EditEntryModal";
import { errMsg, formatRupiah } from "./format";
import { Panel } from "./Panel";
import { RowActions } from "./RowActions";
import { TanggalCell } from "./TanggalCell";
import { DataSearch } from "./DataSearch";
import type { Entry, Jenis, Kolom } from "./types";
import { InlineState } from "@/components/status/InlineState";
import { useToast } from "@/components/feedback/ToastProvider";
import { useConfirm } from "@/components/feedback/ConfirmDialog";
import { Pagination } from "./Pagination";

type JenisEntriesTableProps = { jenis: Jenis; refreshKey: number; onChanged: () => void };

// Tabel entri per jenis — kolom lengkap + custom
export function JenisEntriesTable({ jenis, refreshKey, onChanged }: JenisEntriesTableProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [columns, setColumns] = useState<Kolom[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const toast = useToast();
  const { confirm, dialog } = useConfirm();

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const entriesRes = await api.transactions.getAll({
        jenis_transaksi_id: jenis.id,
        page,
        limit: pageSize,
        search: debouncedSearch || undefined,
      });
      if (entriesRes.success) {
        const list = Array.isArray(entriesRes.data?.data) ? entriesRes.data.data : (Array.isArray(entriesRes.data) ? entriesRes.data : []);
        const totalRecords = entriesRes.data?.pagination?.total ?? list.length;
        const lastPage = Math.max(1, Math.ceil(totalRecords / pageSize));
        setTotal(totalRecords);
        if (page > lastPage) {
          setPage(lastPage);
          return;
        }
        setEntries(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [jenis.id, page, pageSize, debouncedSearch]);

  const loadColumns = useCallback(async () => {
    try {
      const columnsRes = await api.transactionTypes.getColumns(jenis.id);
      if (columnsRes.success) setColumns(columnsRes.data || []);
    } catch (e) {
      console.error(e);
    }
  }, [jenis.id]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load, refreshKey]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadColumns(); }, [loadColumns]);

  const deleteEntry = async (entry: Entry) => {
    const ok = await confirm({
      title: "Hapus transaksi ini?",
      detail: `${entry.kode}${entry.detail ? " · " + entry.detail : ""} · ${formatRupiah(entry.nominal)}`,
      description: "Saldo akan disesuaikan kembali. Tindakan ini tidak bisa dibatalkan.",
    });
    if (!ok) return;
    try {
      await api.transactions.delete(entry.id);
      load();
      onChanged();
      toast.info("Transaksi dihapus", { tag: "DIHAPUS", icon: "trash", description: entry.detail || entry.kode });
    } catch (e) {
      toast.error("Transaksi belum terhapus", { description: errMsg(e, "Gagal menghapus entri.") });
    }
  };

  const hasSearch = searchTerm.trim().length > 0;
  const masuk = jenis.arah === "PEMASUKAN";
  const colSpan = 7 + columns.length;

  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-line-soft p-4 sm:px-5">
        <DataSearch
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setPage(1);
          }}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13.5px]">
          <thead className="bg-app">
            <tr>
              <th className={TH}>Tanggal</th>
              <th className={TH}>Keterangan</th>
              <th className={TH_CENTER}>Jenis Transaksi</th>
              <th className={TH}>Nominal</th>
              <th className={TH}>Debit</th>
              <th className={TH}>Kredit</th>
              {columns.map((c) => (
                <th key={c.id} className={TH}>{c.namaKolom}</th>
              ))}
              <th className={TH_RIGHT}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {loading ? (
              <tr><td colSpan={colSpan} className="px-5 py-10 text-center text-faint">Memuat...</td></tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={colSpan}>
                  <InlineState
                    kind="kosong"
                    compact
                    title={hasSearch ? "Tidak ada hasil pencarian" : "Belum ada entri"}
                    description={hasSearch ? "Coba kata kunci lain." : "Belum ada entri untuk jenis ini. Tambah lewat tombol “Tambah Transaksi” di atas."}
                  />
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr
                  key={e.id}
                  className="cursor-pointer transition-colors hover:bg-app/70"
                  onClick={() => setEditEntry(e)}
                >
                  <td className="whitespace-nowrap px-4 py-3"><TanggalCell tanggal={e.tanggal} /></td>
                  <td className="px-4 py-3 font-semibold text-ink">{e.detail || "-"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">{e.namaTransaksi}</td>
                  <td className={"tabular whitespace-nowrap px-4 py-3 text-left text-[14.5px] font-extrabold " + (masuk ? "text-ok-text" : "text-bad")}>
                    {formatRupiah(e.nominal)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{e.debit || "-"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{e.kredit || "-"}</td>
                  {columns.map((c) => (
                    <td key={c.id} className="whitespace-nowrap px-4 py-3">{e.customData?.[String(c.id)] ?? "-"}</td>
                  ))}
                  <td className="px-4 py-3">
                    <RowActions
                      onEdit={() => setEditEntry(e)}
                      onDelete={() => deleteEntry(e)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={Math.ceil(total / pageSize)} total={total} pageSize={pageSize} onPage={setPage} onPageSize={(size) => { setPageSize(size); setPage(1); }} />

      {editEntry && (
        <EditEntryModal
          key={editEntry.id}
          entry={editEntry}
          columns={columns}
          onClose={() => setEditEntry(null)}
          onSaved={() => { setEditEntry(null); load(); onChanged(); }}
        />
      )}
      {dialog}
    </Panel>
  );
}
