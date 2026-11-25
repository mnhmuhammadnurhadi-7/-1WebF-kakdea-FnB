export type PeriodeKey = "semua" | "mingguan" | "bulanan" | "7d" | "30d";
export type CashflowEntry = { id: number; detail: string; jenis: string; arah: "PEMASUKAN" | "PENGELUARAN"; nominal: number };
export type CashflowPoint = { tanggal: string; pemasukan: number; pengeluaran: number; transaksi: CashflowEntry[] };
export type InputSourceStats = { ai: number; manual: number; total: number; aiPersen: number; manualPersen: number };
export type RecentOrder = { id: number; title: string; date: string; amount: number; via: "AI" | "MANUAL"; source: string };
export type TrendPoint = { tanggal: string; total: number };
export type PemasukanPengeluaran = {
  daily: unknown[];
  totals: { pemasukan: number; pengeluaran: number; laba: number };
};
