import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Modal } from "../ui/Modal";
import type { ContactForm } from "../shared/types";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  form: ContactForm;
  onForm: (updater: (f: ContactForm) => ContactForm) => void;
  saving: boolean;
  onSave: () => void;
};

export function ContactModal({ open, onClose, form, onForm, saving, onSave }: ContactModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Halaman customer"
      title="Edit Informasi Kontak & Alamat"
      icon="phone"
      width={500}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button icon="check" onClick={onSave} disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="No. Telepon / WhatsApp" placeholder="Contoh: +62 812 3456 7890 atau 081234567890" value={form.telepon} onChange={(v) => onForm((f) => ({ ...f, telepon: v }))} />
        <Field label="Email" type="email" placeholder="Contoh: info@bukudapur.com" value={form.email} onChange={(v) => onForm((f) => ({ ...f, email: v }))} />
        <Field label="Alamat Lengkap" type="textarea" placeholder="Contoh: Jl. Contoh No. 123, Kota, Provinsi 12345" value={form.alamat} onChange={(v) => onForm((f) => ({ ...f, alamat: v }))} />
      </div>
    </Modal>
  );
}
