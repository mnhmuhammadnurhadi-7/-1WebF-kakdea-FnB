import type { ChatMessage, ChipOption } from "./types";

export const quickPrompts = [
  "/add jual nugget 2 pcs ke Bu Siti WA, 240rb",
  "/add beli daging ayam 10kg 320rb ke Pak Hadi",
  "/add order GF-1044 nugget 1, siomay 1, total 92rb",
  "ringkasan penjualan minggu ini",
  "stok mana yang mau habis?",
];

export const suggestionChips: ChipOption[] = [
  { id: "jual", label: "Catat Penjualan" },
  { id: "beli", label: "Catat Pengeluaran" },
  { id: "order", label: "Buat Order Baru" },
  { id: "restock", label: "Restock Stok" },
  { id: "laporan", label: "Lihat Laporan" },
];

export const initialMessages: ChatMessage[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Halo Bu Pemilik 👋 Saya Asisten AI Buku Dapur. Kirimkan chat WA/DM struk belanja, atau ketik `/add` diikuti deskripsi transaksi/order. Contoh: `/add jual 2 nugget ke Bu Siti, 240rb`",
    timestamp: "Baru saja",
  },
];
