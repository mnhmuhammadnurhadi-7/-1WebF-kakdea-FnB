import { Button } from "../ui/Button";
import { ColumnBuilder } from "../tambah/ColumnBuilder";
import { Field } from "../ui/Field";
import { Modal } from "../ui/Modal";
import type { ColumnDraft } from "../shared/types";

type CreateTabelModalProps = {
  open: boolean;
  onClose: () => void;
  namaTabel: string;
  onNamaTabel: (v: string) => void;
  deskripsi: string;
  onDeskripsi: (v: string) => void;
  columns: ColumnDraft[];
  onColumns: (cols: ColumnDraft[]) => void;
  error: string;
  saving: boolean;
  onSubmit: () => void;
};

export function CreateTabelModal(p: CreateTabelModalProps) {
  return (
    <Modal
      open={p.open}
      onClose={p.onClose}
      eyebrow="Tabel baru"
      title="Tambah Data Baru"
      icon="clipboard"
      width={520}
      footer={
        <>
          <Button variant="secondary" onClick={p.onClose}>Batal</Button>
          <Button onClick={p.onSubmit} disabled={p.saving}>{p.saving ? "Menyimpan..." : "Buat Tabel"}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Nama Tabel" placeholder="Contoh: Hutang Planning" value={p.namaTabel} onChange={p.onNamaTabel} required />
        <Field label="Deskripsi" type="textarea" placeholder="Jelaskan fungsi atau catatan singkat untuk tabel ini...." value={p.deskripsi} onChange={p.onDeskripsi} />
        <div className="h-px w-full bg-line-soft" />
        <ColumnBuilder columns={p.columns} onChange={p.onColumns} />
        {p.error && <p className="text-[12.5px] font-semibold text-bad">{p.error}</p>}
      </div>
    </Modal>
  );
}
