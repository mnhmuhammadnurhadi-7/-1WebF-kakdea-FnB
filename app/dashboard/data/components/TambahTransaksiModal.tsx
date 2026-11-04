"use client";

import { ArahPicker } from "./ArahPicker";
import { Button } from "./Button";
import { ColumnBuilder } from "./ColumnBuilder";
import { DynamicColumnField } from "./DynamicColumnField";
import { Field } from "./Field";
import { Modal } from "./Modal";
import type { TambahTransaksiCtrl } from "./useTambahTransaksi";
import type { Jenis } from "./types";
import { StateBanner } from "@/components/feedback/StateBanner";

type TambahTransaksiModalProps = { ctrl: TambahTransaksiCtrl; jenisList: Jenis[] };

export function TambahTransaksiModal({ ctrl: c, jenisList }: TambahTransaksiModalProps) {
  // Error per kolom hanya tampil setelah ada upaya simpan yang gagal (txError terisi).
  const failed = !!c.txError;
  const errTanggal = failed && !c.txForm.tanggal ? "Tanggal belum diisi." : undefined;
  const errJenis = failed && !c.txForm.jenisTransaksiId ? "Jenis transaksi wajib dipilih." : undefined;
  const errNominal = failed && (!c.txForm.nominal || Number(c.txForm.nominal) <= 0) ? "Nominal belum diisi (harus lebih dari 0)." : undefined;
  const hasFieldError = !!(errTanggal || errJenis || errNominal);
  return (
    <Modal
      open={c.txModalOpen}
      onClose={() => c.setTxModalOpen(false)}
      eyebrow={c.creatingNewJenis ? "Tabel baru" : "Catatan baru"}
      title={c.creatingNewJenis ? "Buat Jenis / Tabel Baru" : "Tambah Transaksi Baru"}
      subtitle={c.creatingNewJenis ? undefined : "Isi tanggal, lalu tentukan jenisnya - kalau belum ada, bikin baru sekalian."}
      icon={c.creatingNewJenis ? "clipboard" : "swap"}
      width={480}
      footer={
        c.creatingNewJenis ? (
          <>
            <Button variant="secondary" onClick={() => c.setCreatingNewJenis(false)}>Batal</Button>
            <Button onClick={c.submitNewJenis} disabled={c.savingNewJenis}>
              {c.savingNewJenis ? "Menyimpan..." : c.newJenisError ? "Coba Lagi" : "Tambahkan"}
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => c.setTxModalOpen(false)}>Batal</Button>
            <Button icon="check" onClick={c.submitTransaksi} disabled={c.savingTx || !c.txForm.jenisTransaksiId}>
              {c.savingTx ? "Menyimpan..." : c.txError && !hasFieldError ? "Coba simpan lagi" : "Simpan"}
            </Button>
          </>
        )
      }
    >
      {c.creatingNewJenis ? (
        <div className="flex flex-col gap-4">
          <Field label="Nama Tabel" placeholder="Contoh: Biaya Tak Langsung" value={c.newJenisForm.namaTabel} onChange={(v) => c.setNewJenisForm((f) => ({ ...f, namaTabel: v }))} required />
          <Field label="Jenis Akun" placeholder="Contoh: Kas Utama (boleh ketik bebas)" value={c.newJenisForm.jenisAkun} onChange={(v) => c.setNewJenisForm((f) => ({ ...f, jenisAkun: v }))} />
          <ArahPicker value={c.newJenisForm.arah} onChange={(v) => c.setNewJenisForm((f) => ({ ...f, arah: v }))} />
          <div className="h-px w-full bg-line-soft" />
          <ColumnBuilder columns={c.newJenisColumns} onChange={c.setNewJenisColumns} />
          {c.newJenisError && <StateBanner title="Jenis / tabel belum bisa dibuat" code="ERR-S222">{c.newJenisError}</StateBanner>}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Field label="Tanggal" type="date" required error={errTanggal} value={c.txForm.tanggal} onChange={(v) => c.setTxForm((f) => ({ ...f, tanggal: v }))} />
          <Field label="Keterangan" placeholder="Contoh: Beli bahan ayam 5kg - Supplier Jaya" value={c.txForm.detail} onChange={(v) => c.setTxForm((f) => ({ ...f, detail: v }))} />
          <Field
            label="Jenis Transaksi"
            type="select"
            required
            error={errJenis}
            value={c.txForm.jenisTransaksiId}
            onChange={c.onJenisPicked}
            options={[
              ...jenisList.map((j) => ({ value: String(j.id), label: j.namaTransaksi })),
              { value: "__new__", label: "+ Tambahkan Jenis Transaksi Baru" },
            ]}
          />
          <Field label="Nominal (Rp)" type="number" prefix="Rp" required error={errNominal} value={c.txForm.nominal} onChange={(v) => c.setTxForm((f) => ({ ...f, nominal: v }))} />
          <div className="flex gap-3">
            <Field label="Debit" className="flex-1" placeholder="Opsional" value={c.txForm.debit} onChange={(v) => c.setTxForm((f) => ({ ...f, debit: v }))} />
            <Field label="Kredit" className="flex-1" placeholder="Opsional" value={c.txForm.kredit} onChange={(v) => c.setTxForm((f) => ({ ...f, kredit: v }))} />
          </div>
          {c.txColumns.map((col) => (
            <DynamicColumnField key={col.id} kolom={col} value={c.txCustomValues[String(col.id)] || ""} onChange={(v) => c.setTxCustomValues((prev) => ({ ...prev, [String(col.id)]: v }))} />
          ))}
          {c.txError && !hasFieldError && <StateBanner title="Transaksi belum tersimpan" code="ERR-S201">{c.txError} Data Anda masih aman di layar.</StateBanner>}
        </div>
      )}
    </Modal>
  );
}
