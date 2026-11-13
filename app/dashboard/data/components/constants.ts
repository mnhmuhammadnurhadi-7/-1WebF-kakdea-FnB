import type { ColumnDraft } from "./types";

export const TIPE_DATA_OPTIONS = [
  { value: "TEKS", label: "Teks" },
  { value: "ANGKA", label: "Angka" },
  { value: "TANGGAL", label: "Tanggal" },
  { value: "DROPDOWN", label: "Dropdown" },
];

export const ARAH_OPTIONS = [
  { value: "PEMASUKAN", label: "Pemasukan" },
  { value: "PENGELUARAN", label: "Pengeluaran" },
  { value: "PENDATAAN", label: "Pendataan biasa" },
];

export const emptyColumn = (): ColumnDraft => ({ namaKolom: "", tipeData: "TEKS", opsiDropdown: "" });

/* class tabel dipakai bareng semua tabel di halaman Data */
const TH_BASE = "whitespace-nowrap px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.1em] text-label";
export const TH = `${TH_BASE} text-left`;
export const TH_CENTER = `${TH_BASE} text-center`;
export const TH_RIGHT = `${TH_BASE} text-right`;
