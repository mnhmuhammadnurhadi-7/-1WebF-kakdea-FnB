export type PeriodeKey = "semua" | "mingguan" | "bulanan";
export type CashflowEntry = { id: number; detail: string; jenis: string; arah: "PEMASUKAN" | "PENGELUARAN"; nominal: number };
export type CashflowPoint = { tanggal: string; pemasukan: number; pengeluaran: number; transaksi: CashflowEntry[] };
export type InputSourceStats = { ai: number; manual: number; total: number; aiPersen: number; manualPersen: number };
export type PemasukanPengeluaran = {
  daily: unknown[];
  totals: { pemasukan: number; pengeluaran: number; laba: number };
};
