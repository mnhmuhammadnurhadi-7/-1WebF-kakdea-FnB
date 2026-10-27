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
export const TH = "px-5 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-[.08em] text-faint whitespace-nowrap";
