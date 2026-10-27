"use client";

import { ArahPicker } from "../jenis/ArahPicker";
import { Button } from "../ui/Button";
import { ColumnBuilder } from "./ColumnBuilder";
import { DynamicColumnField } from "./DynamicColumnField";
import { Field } from "../ui/Field";
import { Modal } from "../ui/Modal";
import type { TambahTransaksiCtrl } from "./useTambahTransaksi";
import type { Jenis } from "../shared/types";

type TambahTransaksiModalProps = { ctrl: TambahTransaksiCtrl; jenisList: Jenis[] };

export function TambahTransaksiModal({ ctrl: c, jenisList }: TambahTransaksiModalProps) {
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
              {c.savingNewJenis ? "Menyimpan..." : "Tambahkan"}
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => c.setTxModalOpen(false)}>Batal</Button>
            <Button icon="check" onClick={c.submitTransaksi} disabled={c.savingTx || !c.txForm.jenisTransaksiId}>
              {c.savingTx ? "Menyimpan..." : "Simpan"}
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
          {c.newJenisError && <p className="text-[12.5px] font-semibold text-bad">{c.newJenisError}</p>}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Field label="Tanggal" type="date" required value={c.txForm.tanggal} onChange={(v) => c.setTxForm((f) => ({ ...f, tanggal: v }))} />
          <Field label="Keterangan" placeholder="Contoh: Beli bahan ayam 5kg - Supplier Jaya" value={c.txForm.detail} onChange={(v) => c.setTxForm((f) => ({ ...f, detail: v }))} />
          <Field
            label="Jenis Transaksi"
            type="select"
            required
            value={c.txForm.jenisTransaksiId}
            onChange={c.onJenisPicked}
            options={[
              ...jenisList.map((j) => ({ value: String(j.id), label: j.namaTransaksi })),
              { value: "__new__", label: "+ Tambahkan Jenis Transaksi Baru" },
            ]}
          />
          <Field label="Nominal (Rp)" type="number" prefix="Rp" required value={c.txForm.nominal} onChange={(v) => c.setTxForm((f) => ({ ...f, nominal: v }))} />
          <div className="flex gap-3">
            <Field label="Debit" className="flex-1" placeholder="Opsional" value={c.txForm.debit} onChange={(v) => c.setTxForm((f) => ({ ...f, debit: v }))} />
            <Field label="Kredit" className="flex-1" placeholder="Opsional" value={c.txForm.kredit} onChange={(v) => c.setTxForm((f) => ({ ...f, kredit: v }))} />
          </div>
          {c.txColumns.map((col) => (
            <DynamicColumnField key={col.id} kolom={col} value={c.txCustomValues[String(col.id)] || ""} onChange={(v) => c.setTxCustomValues((prev) => ({ ...prev, [String(col.id)]: v }))} />
          ))}
          {c.txError && <p className="text-[12.5px] font-semibold text-bad">{c.txError}</p>}
        </div>
      )}
    </Modal>
  );
}
