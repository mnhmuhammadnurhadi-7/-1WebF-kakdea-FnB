import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Modal } from "../ui/Modal";
import type { TextForm } from "../shared/types";

type HeadlineModalProps = {
  open: boolean;
  onClose: () => void;
  form: TextForm;
  onForm: (updater: (f: TextForm) => TextForm) => void;
  saving: boolean;
  onSave: () => void;
};

export function HeadlineModal({ open, onClose, form, onForm, saving, onSave }: HeadlineModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Halaman customer"
      title="Edit Headline Beranda"
      icon="home"
      width={500}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button icon="check" onClick={onSave} disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Judul" placeholder="Contoh: Selamat Datang di Buku Dapur" value={form.judul} onChange={(v) => onForm((f) => ({ ...f, judul: v }))} required />
        <Field label="Sub Judul" placeholder="Contoh: Frozen Food & Siap Saji Terbaik" value={form.subJudul} onChange={(v) => onForm((f) => ({ ...f, subJudul: v }))} />
        <Field label="Deskripsi" type="textarea" placeholder="Deskripsi lengkap untuk beranda..." value={form.deskripsi} onChange={(v) => onForm((f) => ({ ...f, deskripsi: v }))} />
      </div>
    </Modal>
  );
}
