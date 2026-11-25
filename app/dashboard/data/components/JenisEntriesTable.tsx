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
  const colSpan = 8 + columns.length;

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

      {/* Tampilan Tabel Desktop/Tablet (>=768px) */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-[13.5px]">
          <thead className="bg-app">
            <tr>
              <th className={TH}>Tanggal</th>
              <th className={TH}>Kode Transaksi</th>
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
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-brand">{e.kode || "-"}</td>
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

      {/* Tampilan Kartu Mobile (<768px) */}
      <div className="divide-y divide-line-soft md:hidden">
        {loading ? (
          <div className="px-4 py-10 text-center text-sm text-faint">Memuat...</div>
        ) : entries.length === 0 ? (
          <InlineState
            kind="kosong"
            compact
            title={hasSearch ? "Tidak ada hasil pencarian" : "Belum ada entri"}
            description={hasSearch ? "Coba kata kunci lain." : "Belum ada entri untuk jenis ini. Tambah lewat tombol “Tambah Transaksi” di atas."}
          />
        ) : (
          entries.map((e) => (
            <article
              key={e.id}
              onClick={() => setEditEntry(e)}
              className="flex cursor-pointer flex-col gap-3 p-4 transition-colors active:bg-app/70"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words text-[14px] font-bold text-ink">{e.detail || "-"}</p>
                  <p className="mt-0.5 font-mono text-[11.5px] font-semibold text-brand">{e.kode || "-"}</p>
                </div>
                <span className={"tabular shrink-0 text-[14.5px] font-extrabold " + (masuk ? "text-ok-text" : "text-bad")}>
                  {formatRupiah(e.nominal)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl bg-app/70 p-3 text-[12px]">
                <div>
                  <span className="block text-[10.5px] font-bold uppercase tracking-wider text-faint">Tanggal</span>
                  <TanggalCell tanggal={e.tanggal} />
                </div>
                <div>
                  <span className="block text-[10.5px] font-bold uppercase tracking-wider text-faint">Jenis</span>
                  <span className="font-semibold text-ink">{e.namaTransaksi}</span>
                </div>
                <div>
                  <span className="block text-[10.5px] font-bold uppercase tracking-wider text-faint">Debit</span>
                  <span className="break-words font-medium text-body">{e.debit || "-"}</span>
                </div>
                <div>
                  <span className="block text-[10.5px] font-bold uppercase tracking-wider text-faint">Kredit</span>
                  <span className="break-words font-medium text-body">{e.kredit || "-"}</span>
                </div>
                {columns.map((c) => (
                  <div key={c.id}>
                    <span className="block text-[10.5px] font-bold uppercase tracking-wider text-faint">{c.namaKolom}</span>
                    <span className="break-words font-medium text-body">{e.customData?.[String(c.id)] ?? "-"}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end" onClick={(ev) => ev.stopPropagation()}>
                <RowActions
                  onEdit={() => setEditEntry(e)}
                  onDelete={() => deleteEntry(e)}
                />
              </div>
            </article>
          ))
        )}
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
