/* eslint-disable @typescript-eslint/no-explicit-any */
// Bentuk data dari backend dibiarkan longgar seperti kode aslinya (res.data bertipe any).
export type Jenis = any;
export type Entry = any;
export type FreeTable = any;
export type FreeRow = any;

export type Kolom = { id: number; namaKolom: string; tipeData: string; opsiDropdown?: string[] | null };
export type ColumnDraft = { namaKolom: string; tipeData: string; opsiDropdown: string };
export type ChipOption = { id: string; label: string };
