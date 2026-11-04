import { Button } from "./Button";
import { DynamicColumnField } from "./DynamicColumnField";
import { Modal } from "./Modal";
import type { FreeRow, Kolom } from "./types";
import { StateBanner } from "@/components/feedback/StateBanner";

type RowModalProps = {
  open: boolean;
  onClose: () => void;
  tableName: string;
  editingRow: FreeRow | null;
  columns: Kolom[];
  values: Record<string, string>;
  onValues: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  error: string;
  saving: boolean;
  onSubmit: () => void;
};

export function RowModal(p: RowModalProps) {
  return (
    <Modal
      open={p.open}
      onClose={p.onClose}
      eyebrow={p.tableName}
      title={p.editingRow ? "Ubah Baris" : "Tambah Baris"}
      icon="clipboard"
      width={440}
      footer={
        <>
          <Button variant="secondary" onClick={p.onClose}>Batal</Button>
          <Button icon="check" onClick={p.onSubmit} disabled={p.saving}>{p.saving ? "Menyimpan..." : p.error ? "Coba simpan lagi" : "Simpan"}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {p.columns.map((c) => (
          <DynamicColumnField key={c.id} kolom={c} value={p.values[String(c.id)] || ""} onChange={(v) => p.onValues((prev) => ({ ...prev, [String(c.id)]: v }))} />
        ))}
        {p.error && <StateBanner title="Baris belum tersimpan" code="ERR-S205">{p.error}</StateBanner>}
      </div>
    </Modal>
  );
}
