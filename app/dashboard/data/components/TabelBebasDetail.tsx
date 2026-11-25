"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "./Button";
import { TH } from "./constants";
import { errMsg } from "./format";
import { Panel } from "./Panel";
import { RowActions } from "./RowActions";
import { RowModal } from "./RowModal";
import type { FreeRow, FreeTable } from "./types";
import { InlineState } from "@/components/status/InlineState";
import { useToast } from "@/components/feedback/ToastProvider";
import { useConfirm } from "@/components/feedback/ConfirmDialog";
import { Pagination } from "./Pagination";

type TabelBebasDetailProps = { table: FreeTable; onBack: () => void };

export function TabelBebasDetail({ table, onBack }: TabelBebasDetailProps) {
  const [detail, setDetail] = useState<FreeTable>(table);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [rowModalOpen, setRowModalOpen] = useState(false);
  const [rowValues, setRowValues] = useState<Record<string, string>>({});
  const [editingRow, setEditingRow] = useState<FreeRow | null>(null);
  const [rowError, setRowError] = useState("");
  const [savingRow, setSavingRow] = useState(false);
  const toast = useToast();
  const { confirm, dialog } = useConfirm();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.freeTables.getById(table.id);
      if (res.success) setDetail(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [table.id]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const columns = detail.kolom || [];
  const rows = detail.baris || [];
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const visibleRows = rows.slice((Math.min(page, totalPages) - 1) * pageSize, Math.min(page, totalPages) * pageSize);

  const openAddRow = () => {
    setEditingRow(null);
    setRowValues({});
    setRowError("");
    setRowModalOpen(true);
  };

  const openEditRow = (row: FreeRow) => {
    setEditingRow(row);
    setRowValues(row.data || {});
    setRowError("");
    setRowModalOpen(true);
  };

  const submitRow = async () => {
    setSavingRow(true);
    setRowError("");
    try {
      if (editingRow) {
        await api.freeTables.updateRow(table.id, editingRow.id, rowValues);
      } else {
        await api.freeTables.createRow(table.id, rowValues);
      }
      setRowModalOpen(false);
      load();
    } catch (e) {
      setRowError(errMsg(e, "Gagal menyimpan baris."));
    } finally {
      setSavingRow(false);
    }
  };

  const deleteRow = async (row: FreeRow) => {
    const ok = await confirm({ title: "Hapus baris ini?", description: "Tindakan ini tidak bisa dibatalkan.", confirmLabel: "Ya, hapus baris" });
    if (!ok) return;
    try {
      await api.freeTables.deleteRow(table.id, row.id);
      load();
      toast.info("Baris dihapus", { tag: "DIHAPUS", icon: "trash" });
    } catch (e) {
      toast.error("Baris belum terhapus", { description: errMsg(e, "Gagal menghapus baris.") });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-[13px] font-bold text-faint transition hover:text-ink">
          ← Kembali ke Tabel Bebas
        </button>
        <Button size="sm" icon="plus" onClick={openAddRow} disabled={columns.length === 0}>Tambah Baris</Button>
      </div>

      <Panel padding="md">
        <span className="text-[18px] font-bold tracking-[-.02em] text-ink">{detail.namaTabel}</span>
        {detail.deskripsi && <p className="mt-1 text-[12.5px] text-body">{detail.deskripsi}</p>}
      </Panel>

      {columns.length === 0 ? (
        <Panel className="flex items-center justify-center py-16"><div className="text-faint">Tabel ini belum punya kolom.</div></Panel>
      ) : (
        <Panel className="overflow-hidden">
          {/* Tampilan Tabel Desktop/Tablet (>=768px) */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-[13.5px]">
              <thead className="bg-cream">
                <tr>
                  {columns.map((c: { id: number; namaKolom: string }) => (
                    <th key={c.id} className={TH}>{c.namaKolom}</th>
                  ))}
                  <th className={TH + " text-right"}>Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {loading ? (
                  <tr><td colSpan={columns.length + 1} className="px-5 py-10 text-center text-faint">Memuat...</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={columns.length + 1}><InlineState kind="kosong" compact title="Belum ada baris" description="Tambah yang pertama lewat tombol di atas." /></td></tr>
                ) : (
                  visibleRows.map((row: FreeRow) => (
                    <tr key={row.id} className="transition-colors hover:bg-app/70">
                      {columns.map((c: { id: number }) => (
                        <td key={c.id} className="whitespace-nowrap px-5 py-4">{row.data?.[String(c.id)] ?? "-"}</td>
                      ))}
                      <td className="px-5 py-4">
                        <RowActions onEdit={() => openEditRow(row)} onDelete={() => deleteRow(row)} />
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
            ) : rows.length === 0 ? (
              <InlineState kind="kosong" compact title="Belum ada baris" description="Tambah yang pertama lewat tombol di atas." />
            ) : (
              visibleRows.map((row: FreeRow) => (
                <article key={row.id} className="flex flex-col gap-3 p-4">
                  <div className="grid grid-cols-1 gap-2 rounded-xl bg-app/60 p-3 sm:grid-cols-2">
                    {columns.map((c: { id: number; namaKolom: string }) => (
                      <div key={c.id} className="min-w-0">
                        <span className="block text-[10.5px] font-bold uppercase tracking-wider text-faint">{c.namaKolom}</span>
                        <span className="break-words text-[13.5px] font-semibold text-ink">{row.data?.[String(c.id)] ?? "-"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <RowActions onEdit={() => openEditRow(row)} onDelete={() => deleteRow(row)} />
                  </div>
                </article>
              ))
            )}
          </div>

          <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} total={rows.length} pageSize={pageSize} onPage={setPage} onPageSize={(size) => { setPageSize(size); setPage(1); }} />
        </Panel>
      )}

      <RowModal
        open={rowModalOpen}
        onClose={() => setRowModalOpen(false)}
        tableName={detail.namaTabel}
        editingRow={editingRow}
        columns={columns}
        values={rowValues}
        onValues={setRowValues}
        error={rowError}
        saving={savingRow}
        onSubmit={submitRow}
      />
      {dialog}
    </div>
  );
}
