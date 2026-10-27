import type { ChipOption } from "./types";

export const sheetTabs: ChipOption[] = [
  { id: "semua", label: "Semua" },
  { id: "transaksi", label: "Transaksi" },
  { id: "stok", label: "Stok" },
  { id: "order", label: "Order" },
  { id: "tabel_bebas", label: "Tabel Bebas" },
  { id: "user", label: "User" },
];

export const sourceTabs: ChipOption[] = [
  { id: "semua", label: "Semua Sumber" },
  { id: "AI", label: "AI" },
  { id: "MANUAL", label: "Manual" },
];

export type Tone = "brand" | "sky" | "ok" | "warn" | "bad" | "neutral";

/** Warna chip per tone (bg + teks). */
export const TONE_CHIP: Record<Tone, string> = {
  brand: "bg-[#e8f0ff] text-brand",
  sky: "bg-sky-tint text-navy",
  ok: "bg-ok-tint text-ok-text",
  warn: "bg-[#FFF4D6] text-[#92400E]",
  bad: "bg-bad-tint text-bad-text",
  neutral: "bg-field text-body",
};

/** Warna titik di garis waktu per tone. */
export const TONE_DOT: Record<Tone, string> = {
  brand: "bg-brand",
  sky: "bg-sky",
  ok: "bg-ok",
  warn: "bg-[#F59E0B]",
  bad: "bg-bad",
  neutral: "bg-faint",
};

export const sheetTone: Record<string, Tone> = {
  transaksi: "brand",
  stok: "sky",
  order: "ok",
  tabel_bebas: "warn",
  user: "neutral",
};

export const actionMetaMap: Record<string, { label: string; tone: Tone }> = {
  CREATE: { label: "Tambah", tone: "ok" },
  TAMBAH: { label: "Tambah", tone: "ok" },
  UPDATE: { label: "Ubah", tone: "warn" },
  UBAH: { label: "Ubah", tone: "warn" },
  DELETE: { label: "Hapus", tone: "bad" },
  HAPUS: { label: "Hapus", tone: "bad" },
};

export function getActionMeta(action: string): { label: string; tone: Tone } {
  const key = (action || "").toUpperCase();
  return actionMetaMap[key] || { label: action || "Aksi", tone: "neutral" };
}
