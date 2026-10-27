import type { PemasukanPengeluaran, PeriodeKey, RecentOrder, TrendPoint } from "./types";

/**
 * MODE TESTING (tanpa backend). Aktif kalau membuka /dashboard?testing saat npm run dev.
 * Dashboard tidak memanggil API, cukup membaca data contoh di file ini.
 * Hapus file ini dan TestBanner.tsx kalau backend sudah siap dipakai terus.
 */
export const TEST_TOKEN = "testing";

export const SAMPLE_SALDO_KAS = 4_850_000;

export const SAMPLE_PP: PemasukanPengeluaran = {
  daily: new Array(7).fill(0),
  totals: { pemasukan: 8_960_000, pengeluaran: 4_120_000, laba: 4_840_000 },
};

export const SAMPLE_ORDERS: RecentOrder[] = [
  { id: 1, title: "Order GrabFood", date: "15 Okt", amount: 350_000, via: "AI", source: "GrabFood" },
  { id: 2, title: "Frozen Food Nugget 10 Box", date: "15 Okt", amount: 450_000, via: "MANUAL", source: "WhatsApp" },
  { id: 3, title: "Siomay Frozen 20 pcs", date: "14 Okt", amount: 280_000, via: "AI", source: "WhatsApp" },
  { id: 4, title: "Order Reseller Malang", date: "14 Okt", amount: 780_000, via: "MANUAL", source: "-" },
];

/** Penjualan harian (ribu rupiah), diulang sesuai jumlah hari, berakhir hari ini. */
const POLA = [480, 540, 590, 360, 640, 720, 610, 550, 700, 780, 600, 680, 840, 870];

export function sampleTrend(periode: PeriodeKey): TrendPoint[] {
  const n = periode === "7d" ? 7 : 30;
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (n - 1 - i));
    return { tanggal: d.toISOString().slice(0, 10), total: POLA[i % POLA.length] * 1000 };
  });
}
