import type { ChipOption } from "./types";

export const quickPrompts = [
  "Berapa total penjualan dan pengeluaran 7 hari terakhir?",
  "Bagaimana SOP pencatatan transaksi dan stok di SOJU?",
  "Produk apa saja yang tersedia di katalog SOJU?",
  "/add jual nugget ayam 2 pack 90rb tunai ke Bu Siti",
  "/add beli bahan baku daging ayam 5kg 250rb transfer",
];

export const suggestionChips: ChipOption[] = [
  { id: "laporan", label: "Ringkasan Penjualan" },
  { id: "sop", label: "Tanya SOP & Produk" },
  { id: "jual", label: "Catat Penjualan" },
  { id: "beli", label: "Catat Pengeluaran" },
  { id: "order", label: "Cek Pesanan" },
];

/** Perintah yang dikenali asisten (awalan "/"). */
export const AVAILABLE_COMMANDS = [
  { cmd: "/add", label: "Buat Draf Transaksi" },
  { cmd: "/ask", label: "Tanya Data & SOP" },
  { cmd: "/edit", label: "Koreksi Draf" },
  { cmd: "/stock", label: "Cek Produk & Stok" },
];
