import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Modal } from "../ui/Modal";
import type { TextForm } from "../shared/types";

type AboutModalProps = {
  open: boolean;
  onClose: () => void;
  form: TextForm;
  onForm: (updater: (f: TextForm) => TextForm) => void;
  saving: boolean;
  onSave: () => void;
};

export function AboutModal({ open, onClose, form, onForm, saving, onSave }: AboutModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Halaman customer"
      title="Edit Tentang Kami"
      icon="users"
      width={550}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button icon="check" onClick={onSave} disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Judul" placeholder="Contoh: Tentang Kami" value={form.judul} onChange={(v) => onForm((f) => ({ ...f, judul: v }))} required />
        <Field label="Sub Judul / Tagline" placeholder="Contoh: Kualitas dan Kepercayaan" value={form.subJudul} onChange={(v) => onForm((f) => ({ ...f, subJudul: v }))} />
        <Field label="Konten / Cerita Profil" type="textarea" placeholder="Tuliskan cerita, visi, dan misi Buku Dapur..." value={form.deskripsi} onChange={(v) => onForm((f) => ({ ...f, deskripsi: v }))} />
      </div>
    </Modal>
  );
}
