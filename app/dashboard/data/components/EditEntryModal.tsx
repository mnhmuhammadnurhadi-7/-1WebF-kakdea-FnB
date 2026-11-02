"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "./Button";
import { DynamicColumnField } from "./DynamicColumnField";
import { Field } from "./Field";
import { errMsg, todayStr } from "./format";
import { Modal } from "./Modal";
import type { Entry, Kolom } from "./types";
import { useToast } from "@/components/feedback/ToastProvider";
import { StateBanner } from "@/components/feedback/StateBanner";

type EditEntryModalProps = { entry: Entry; columns: Kolom[]; onClose: () => void; onSaved: () => void };

/** Modal Edit Transaksi untuk satu entri. Dipasang dengan key=entry.id, jadi form selalu mulai dari data entri. */
export function EditEntryModal({ entry, columns, onClose, onSaved }: EditEntryModalProps) {
  const toast = useToast();
  const [form, setForm] = useState({
    tanggal: entry.tanggal ? new Date(entry.tanggal).toISOString().split("T")[0] : todayStr(),
    detail: entry.detail || "",
    nominal: String(Number(entry.nominal)),
    debit: entry.debit || "",
    kredit: entry.kredit || "",
  });
  const [custom, setCustom] = useState<Record<string, string>>(entry.customData ? { ...entry.customData } : {});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.nominal || Number(form.nominal) <= 0) {
      setError("Nominal wajib diisi dan > 0.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.transactions.update(entry.id, {
        tanggal: form.tanggal,
        detail: form.detail,
        nominal: Number(form.nominal),
        debit: form.debit || undefined,
        kredit: form.kredit || undefined,
        custom_data: custom,
      });
      onSaved();
      toast.success("Perubahan tersimpan", { description: entry.detail || entry.kode });
    } catch (e) {
      setError(errMsg(e, "Gagal menyimpan perubahan."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow="Ubah catatan"
      title="Edit Transaksi"
      subtitle={`Kode: ${entry.kode}`}
      icon="pencil"
      width={480}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button icon="check" onClick={submit} disabled={saving}>{saving ? "Menyimpan..." : error ? "Coba simpan lagi" : "Simpan"}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Tanggal" type="date" value={form.tanggal} onChange={(v) => setForm((f) => ({ ...f, tanggal: v }))} />
        <Field label="Keterangan" value={form.detail} onChange={(v) => setForm((f) => ({ ...f, detail: v }))} />
        <Field label="Nominal (Rp)" type="number" prefix="Rp" value={form.nominal} onChange={(v) => setForm((f) => ({ ...f, nominal: v }))} required />
        <div className="flex gap-3">
          <Field label="Debit" className="flex-1" value={form.debit} onChange={(v) => setForm((f) => ({ ...f, debit: v }))} />
          <Field label="Kredit" className="flex-1" value={form.kredit} onChange={(v) => setForm((f) => ({ ...f, kredit: v }))} />
        </div>
        {columns.map((c) => (
          <DynamicColumnField key={c.id} kolom={c} value={custom[String(c.id)] || ""} onChange={(v) => setCustom((prev) => ({ ...prev, [String(c.id)]: v }))} />
        ))}
        {error && <StateBanner title="Perubahan belum tersimpan" code="ERR-S203">{error}</StateBanner>}
      </div>
    </Modal>
  );
}
