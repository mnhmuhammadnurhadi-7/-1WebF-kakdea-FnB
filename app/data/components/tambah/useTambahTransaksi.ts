"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { emptyColumn } from "../shared/constants";
import { errMsg, parseOpsi, todayStr } from "../shared/format";
import type { ColumnDraft, Kolom } from "../shared/types";

type TxForm = { tanggal: string; detail: string; jenisTransaksiId: string; nominal: string; debit: string; kredit: string };

type Params = {
  loadJenisList: () => Promise<void>;
  refresh: () => void;
  setActiveTab: (id: string) => void;
};

const blankTx = (presetJenisId?: number): TxForm => ({
  tanggal: todayStr(),
  detail: "",
  jenisTransaksiId: presetJenisId ? String(presetJenisId) : "",
  nominal: "",
  debit: "",
  kredit: "",
});

/**
 * Logic modal "Tambah Transaksi" (shared, dipakai dari tab manapun) —
 * dipindah apa adanya dari halaman asli, termasuk alur "bikin jenis/tabel baru sekalian".
 */
export function useTambahTransaksi({ loadJenisList, refresh, setActiveTab }: Params) {
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txForm, setTxForm] = useState<TxForm>(blankTx());
  const [txCustomValues, setTxCustomValues] = useState<Record<string, string>>({});
  const [txColumns, setTxColumns] = useState<Kolom[]>([]);
  const [txError, setTxError] = useState("");
  const [savingTx, setSavingTx] = useState(false);

  const [creatingNewJenis, setCreatingNewJenis] = useState(false);
  const [newJenisForm, setNewJenisForm] = useState({ namaTabel: "", jenisAkun: "", arah: "" });
  const [newJenisColumns, setNewJenisColumns] = useState<ColumnDraft[]>([emptyColumn()]);
  const [newJenisError, setNewJenisError] = useState("");
  const [savingNewJenis, setSavingNewJenis] = useState(false);

  const openTambahTransaksi = async (presetJenisId?: number) => {
    setTxForm(blankTx(presetJenisId));
    setTxCustomValues({});
    setTxError("");
    setCreatingNewJenis(false);
    setNewJenisForm({ namaTabel: "", jenisAkun: "", arah: "" });
    setNewJenisColumns([emptyColumn()]);
    setNewJenisError("");
    if (presetJenisId) {
      try {
        const res = await api.transactionTypes.getColumns(presetJenisId);
        if (res.success) setTxColumns(res.data);
      } catch { setTxColumns([]); }
    } else {
      setTxColumns([]);
    }
    setTxModalOpen(true);
  };

  const onJenisPicked = async (val: string) => {
    if (val === "__new__") {
      setCreatingNewJenis(true);
      return;
    }
    setTxForm((f) => ({ ...f, jenisTransaksiId: val }));
    setTxCustomValues({});
    if (val) {
      try {
        const res = await api.transactionTypes.getColumns(parseInt(val));
        if (res.success) setTxColumns(res.data);
      } catch { setTxColumns([]); }
    } else {
      setTxColumns([]);
    }
  };

  const submitNewJenis = async () => {
    if (!newJenisForm.namaTabel.trim() || !newJenisForm.arah) {
      setNewJenisError("Nama tabel dan penanda (Pemasukan/Pengeluaran/Pendataan) wajib diisi.");
      return;
    }
    const validCols = newJenisColumns.filter((c) => c.namaKolom.trim());
    for (const c of validCols) {
      if (c.tipeData === "DROPDOWN" && !c.opsiDropdown.trim()) {
        setNewJenisError(`Kolom "${c.namaKolom}" bertipe Dropdown wajib punya opsi.`);
        return;
      }
    }
    setSavingNewJenis(true);
    setNewJenisError("");
    try {
      if (newJenisForm.arah === "PENDATAAN") {
        await api.freeTables.create({
          nama_tabel: newJenisForm.namaTabel,
          kolom: validCols.map((c) => ({
            nama_kolom: c.namaKolom,
            tipe_data: c.tipeData,
            opsi_dropdown: c.tipeData === "DROPDOWN" ? parseOpsi(c.opsiDropdown) : undefined,
          })),
        });
        setTxModalOpen(false);
        setActiveTab("tabel_bebas");
      } else {
        const kodeAuto = newJenisForm.namaTabel.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "JT";
        const jenisRes = await api.transactionTypes.create({
          kode: `${kodeAuto}${Date.now().toString().slice(-4)}`,
          nama_transaksi: newJenisForm.namaTabel,
          arah: newJenisForm.arah,
          jenis_akun: newJenisForm.jenisAkun || undefined,
        });
        const newJenis = jenisRes.data;
        for (const c of validCols) {
          await api.transactionTypes.createColumn(newJenis.id, {
            nama_kolom: c.namaKolom,
            tipe_data: c.tipeData,
            opsi_dropdown: c.tipeData === "DROPDOWN" ? parseOpsi(c.opsiDropdown) : undefined,
          });
        }
        await loadJenisList();
        setCreatingNewJenis(false);
        setTxForm((f) => ({ ...f, jenisTransaksiId: String(newJenis.id) }));
        const colsRes = await api.transactionTypes.getColumns(newJenis.id);
        if (colsRes.success) setTxColumns(colsRes.data);
      }
    } catch (e) {
      setNewJenisError(errMsg(e, "Gagal membuat jenis/tabel baru."));
    } finally {
      setSavingNewJenis(false);
    }
  };

  const submitTransaksi = async () => {
    if (!txForm.tanggal || !txForm.jenisTransaksiId || !txForm.nominal || Number(txForm.nominal) <= 0) {
      setTxError("Tanggal, Jenis Transaksi, dan Nominal wajib diisi (nominal harus > 0).");
      return;
    }
    setSavingTx(true);
    setTxError("");
    try {
      await api.transactions.create({
        tanggal: txForm.tanggal,
        jenis_transaksi_id: parseInt(txForm.jenisTransaksiId),
        detail: txForm.detail,
        nominal: Number(txForm.nominal),
        debit: txForm.debit || undefined,
        kredit: txForm.kredit || undefined,
        custom_data: txCustomValues,
      });
      setTxModalOpen(false);
      refresh();
    } catch (e) {
      setTxError(errMsg(e, "Gagal menyimpan transaksi."));
    } finally {
      setSavingTx(false);
    }
  };

  return {
    txModalOpen,
    setTxModalOpen,
    txForm,
    setTxForm,
    txCustomValues,
    setTxCustomValues,
    txColumns,
    txError,
    savingTx,
    creatingNewJenis,
    setCreatingNewJenis,
    newJenisForm,
    setNewJenisForm,
    newJenisColumns,
    setNewJenisColumns,
    newJenisError,
    savingNewJenis,
    openTambahTransaksi,
    onJenisPicked,
    submitNewJenis,
    submitTransaksi,
  };
}

export type TambahTransaksiCtrl = ReturnType<typeof useTambahTransaksi>;
