"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "../ui/Button";
import { TH } from "../shared/constants";
import { errMsg } from "../shared/format";
import { Panel } from "../ui/Panel";
import { RowActions } from "../ui/RowActions";
import { RowModal } from "./RowModal";
import type { FreeRow, FreeTable } from "../shared/types";

type TabelBebasDetailProps = { table: FreeTable; onBack: () => void };

export function TabelBebasDetail({ table, onBack }: TabelBebasDetailProps) {
  const [detail, setDetail] = useState<FreeTable>(table);
  const [loading, setLoading] = useState(true);

  const [rowModalOpen, setRowModalOpen] = useState(false);
  const [rowValues, setRowValues] = useState<Record<string, string>>({});
  const [editingRow, setEditingRow] = useState<FreeRow | null>(null);
  const [rowError, setRowError] = useState("");
  const [savingRow, setSavingRow] = useState(false);

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
    if (!confirm("Hapus baris ini?")) return;
    try {
      await api.freeTables.deleteRow(table.id, row.id);
      load();
    } catch (e) {
      alert(errMsg(e, "Gagal menghapus baris."));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
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
        <Panel className="overflow-x-auto">
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
              ) : (detail.baris || []).length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="px-5 py-10 text-center text-faint">Belum ada baris. Tambah yang pertama lewat tombol di atas.</td></tr>
              ) : (
                (detail.baris || []).map((row: FreeRow) => (
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
    </div>
  );
}
