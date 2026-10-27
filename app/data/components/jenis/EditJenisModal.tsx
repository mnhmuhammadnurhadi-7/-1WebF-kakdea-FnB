"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { errMsg } from "../shared/format";
import { Modal } from "../ui/Modal";
import type { Jenis } from "../shared/types";

type EditJenisModalProps = { jenis: Jenis; onClose: () => void; onSaved: () => void; onDeleted: () => void };

// Modal Edit Table — edit definisi jenis (nama/arah/jenisAkun) + Hapus Table.
// Dipasang dengan key=jenis.id, jadi form selalu mulai dari data jenis yang dipilih.
export function EditJenisModal({ jenis, onClose, onSaved, onDeleted }: EditJenisModalProps) {
  const [form, setForm] = useState({
    namaTransaksi: jenis.namaTransaksi || "",
    arah: jenis.arah || "PEMASUKAN",
    jenisAkun: jenis.jenisAkun || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const submit = async () => {
    if (!form.namaTransaksi.trim()) {
      setError("Nama transaksi wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.transactionTypes.update(jenis.id, {
        nama_transaksi: form.namaTransaksi,
        arah: form.arah,
        jenis_akun: form.jenisAkun || null,
      });
      onSaved();
    } catch (e) {
      setError(errMsg(e, "Gagal menyimpan."));
    } finally {
      setSaving(false);
    }
  };

  const hapus = async () => {
    if (!confirm(`Hapus jenis transaksi "${jenis.namaTransaksi}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeleting(true);
    setError("");
    try {
      await api.transactionTypes.delete(jenis.id);
      onDeleted();
    } catch (e) {
      setError(errMsg(e, "Gagal menghapus - kemungkinan masih ada entri di jenis ini."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow="Ubah tabel"
      title="Edit Table"
      subtitle={`Kode: ${jenis.kode}`}
      icon="clipboard"
      width={440}
      footer={
        <>
          <Button variant="danger" onClick={hapus} disabled={deleting || saving}>{deleting ? "Menghapus..." : "Hapus Table"}</Button>
          <Button icon="check" onClick={submit} disabled={saving || deleting}>{saving ? "Menyimpan..." : "Simpan"}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Nama Transaksi" value={form.namaTransaksi} onChange={(v) => setForm((f) => ({ ...f, namaTransaksi: v }))} required />
        <Field
          label="Arah"
          type="select"
          value={form.arah}
          onChange={(v) => setForm((f) => ({ ...f, arah: v }))}
          options={[{ value: "PEMASUKAN", label: "Pemasukan" }, { value: "PENGELUARAN", label: "Pengeluaran" }]}
        />
        <Field label="Jenis Akun (saran, opsional)" value={form.jenisAkun} onChange={(v) => setForm((f) => ({ ...f, jenisAkun: v }))} />
        {error && <p className="text-[12.5px] font-semibold text-bad">{error}</p>}
      </div>
    </Modal>
  );
}
