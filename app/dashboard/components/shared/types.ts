export type PeriodeKey = "7d" | "30d";
export type TrendPoint = { tanggal: string; total: number };
export type PemasukanPengeluaran = {
  daily: unknown[];
  totals: { pemasukan: number; pengeluaran: number; laba: number };
};
export type RecentOrder = {
  id: number | string;
  title: string;
  date: string;
  amount: number;
  via: "AI" | "MANUAL";
  source: string;
};
