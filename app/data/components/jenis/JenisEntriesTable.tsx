"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { TH } from "../shared/constants";
import { EditEntryModal } from "./EditEntryModal";
import { errMsg, formatRupiah } from "../shared/format";
import { Panel } from "../ui/Panel";
import { RowActions } from "../ui/RowActions";
import { TanggalCell } from "../master/TanggalCell";
import type { Entry, Jenis, Kolom } from "../shared/types";

type JenisEntriesTableProps = { jenis: Jenis; refreshKey: number; onChanged: () => void };

// Tabel entri per jenis — kolom lengkap + custom
export function JenisEntriesTable({ jenis, refreshKey, onChanged }: JenisEntriesTableProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [columns, setColumns] = useState<Kolom[]>([]);
  const [loading, setLoading] = useState(true);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [entriesRes, columnsRes] = await Promise.all([
        api.transactions.getAll({ jenis_transaksi_id: jenis.id }),
        api.transactionTypes.getColumns(jenis.id),
      ]);
      if (entriesRes.success) {
        const list = Array.isArray(entriesRes.data) ? entriesRes.data : (Array.isArray(entriesRes.data?.data) ? entriesRes.data.data : []);
        setEntries(list);
      }
      if (columnsRes.success) setColumns(columnsRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [jenis.id]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load, refreshKey]);

  const deleteEntry = async (entry: Entry) => {
    if (!confirm(`Hapus entri "${entry.kode}"?`)) return;
    try {
      await api.transactions.delete(entry.id);
      load();
      onChanged();
    } catch (e) {
      alert(errMsg(e, "Gagal menghapus entri."));
    }
  };

  const masuk = jenis.arah === "PEMASUKAN";
  const colSpan = 7 + columns.length;

  return (
    <Panel className="overflow-x-auto">
      <table className="w-full text-[13.5px]">
        <thead className="bg-cream">
          <tr>
            <th className={TH}>Tanggal</th>
            <th className={TH}>Keterangan</th>
            <th className={TH}>Jenis Transaksi</th>
            <th className={TH + " text-right"}>Nominal</th>
            <th className={TH}>Debit</th>
            <th className={TH}>Kredit</th>
            {columns.map((c) => (
              <th key={c.id} className={TH}>{c.namaKolom}</th>
            ))}
            <th className={TH + " text-right"}>Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft">
          {loading ? (
            <tr><td colSpan={colSpan} className="px-5 py-10 text-center text-faint">Memuat...</td></tr>
          ) : entries.length === 0 ? (
            <tr><td colSpan={colSpan} className="px-5 py-10 text-center text-faint">Belum ada entri untuk jenis ini. Tambah lewat tombol &quot;Tambah Transaksi&quot; di atas.</td></tr>
          ) : (
            entries.map((e) => (
              <tr key={e.id} className="cursor-pointer transition-colors hover:bg-app/70" onClick={() => setEditEntry(e)}>
                <td className="whitespace-nowrap px-5 py-4"><TanggalCell tanggal={e.tanggal} /></td>
                <td className="px-5 py-4 font-semibold text-ink">{e.detail || "-"}</td>
                <td className="whitespace-nowrap px-5 py-4">{e.namaTransaksi}</td>
                <td className={"tabular whitespace-nowrap px-5 py-4 text-right text-[14.5px] font-extrabold " + (masuk ? "text-ok-text" : "text-bad")}>
                  {formatRupiah(e.nominal)}
                </td>
                <td className="whitespace-nowrap px-5 py-4">{e.debit || "-"}</td>
                <td className="whitespace-nowrap px-5 py-4">{e.kredit || "-"}</td>
                {columns.map((c) => (
                  <td key={c.id} className="whitespace-nowrap px-5 py-4">{e.customData?.[String(c.id)] ?? "-"}</td>
                ))}
                <td className="px-5 py-4">
                  <RowActions onEdit={() => setEditEntry(e)} onDelete={() => deleteEntry(e)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editEntry && (
        <EditEntryModal
          key={editEntry.id}
          entry={editEntry}
          columns={columns}
          onClose={() => setEditEntry(null)}
          onSaved={() => { setEditEntry(null); load(); onChanged(); }}
        />
      )}
    </Panel>
  );
}
