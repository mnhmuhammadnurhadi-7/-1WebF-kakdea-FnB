"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "./Button";
import { emptyColumn } from "./constants";
import { CreateTabelModal } from "./CreateTabelModal";
import { errMsg, parseOpsi } from "./format";
import { Panel } from "./Panel";
import { TabelBebasCard } from "./TabelBebasCard";
import { TabelBebasDetail } from "./TabelBebasDetail";
import type { ColumnDraft, FreeTable } from "./types";
import { InlineState } from "@/components/status/InlineState";
import { useToast } from "@/components/feedback/ToastProvider";
import { useConfirm } from "@/components/feedback/ConfirmDialog";

// TABEL BEBAS — pendataan generik, terpisah total dari Master Transaksi
export function TabelBebasTab() {
  const [tables, setTables] = useState<FreeTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<FreeTable | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [namaTabel, setNamaTabel] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [newColumns, setNewColumns] = useState<ColumnDraft[]>([emptyColumn()]);
  const [createError, setCreateError] = useState("");
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { confirm, dialog } = useConfirm();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.freeTables.getAll();
      if (res.success) setTables(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const openCreate = () => {
    setNamaTabel("");
    setDeskripsi("");
    setNewColumns([emptyColumn()]);
    setCreateError("");
    setCreateModalOpen(true);
  };

  const submitCreate = async () => {
    if (!namaTabel.trim()) {
      setCreateError("Nama tabel wajib diisi.");
      return;
    }
    const validCols = newColumns.filter((c) => c.namaKolom.trim());
    for (const c of validCols) {
      if (c.tipeData === "DROPDOWN" && !c.opsiDropdown.trim()) {
        setCreateError(`Kolom "${c.namaKolom}" bertipe Dropdown wajib punya opsi.`);
        return;
      }
    }
    setSaving(true);
    setCreateError("");
    try {
      await api.freeTables.create({
        nama_tabel: namaTabel,
        deskripsi,
        kolom: validCols.map((c) => ({
          nama_kolom: c.namaKolom,
          tipe_data: c.tipeData,
          opsi_dropdown: c.tipeData === "DROPDOWN" ? parseOpsi(c.opsiDropdown) : undefined,
        })),
      });
      setCreateModalOpen(false);
      load();
      toast.success("Tabel dibuat", { description: namaTabel });
    } catch (e) {
      setCreateError(errMsg(e, "Gagal membuat tabel."));
    } finally {
      setSaving(false);
    }
  };

  const deleteTable = async (t: FreeTable) => {
    const ok = await confirm({
      title: "Hapus tabel ini?",
      detail: t.namaTabel,
      description: "Seluruh isi tabel ikut terhapus. Tindakan ini tidak bisa dibatalkan.",
      confirmLabel: "Ya, hapus tabel",
    });
    if (!ok) return;
    try {
      await api.freeTables.delete(t.id);
      load();
      toast.info("Tabel dihapus", { tag: "DIHAPUS", icon: "trash", description: t.namaTabel });
    } catch (e) {
      toast.error("Tabel belum terhapus", { description: errMsg(e, "Gagal menghapus tabel.") });
    }
  };

  if (selectedTable) {
    return <TabelBebasDetail table={selectedTable} onBack={() => { setSelectedTable(null); load(); }} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[13.5px] text-body">Pendataan bebas, terpisah dari Master Transaksi/akuntansi.</p>
        <Button icon="plus" onClick={openCreate}>Buat Tabel</Button>
      </div>

      {loading ? (
        <Panel className="flex items-center justify-center py-16"><div className="text-faint">Memuat...</div></Panel>
      ) : tables.length === 0 ? (
        <Panel><InlineState kind="kosong" title="Belum ada Pendataan" description="Buat yang pertama lewat tombol di atas." /></Panel>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((t) => (
            <TabelBebasCard key={t.id} table={t} onOpen={() => setSelectedTable(t)} onDelete={() => deleteTable(t)} />
          ))}
        </div>
      )}

      <CreateTabelModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        namaTabel={namaTabel}
        onNamaTabel={setNamaTabel}
        deskripsi={deskripsi}
        onDeskripsi={setDeskripsi}
        columns={newColumns}
        onColumns={setNewColumns}
        error={createError}
        saving={saving}
        onSubmit={submitCreate}
      />
      {dialog}
    </div>
  );
}
