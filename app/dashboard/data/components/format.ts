import type { Entry } from "./types";

export function formatRupiah(n: unknown): string {
  const num = Number(n || 0);
  return `Rp ${num.toLocaleString("id-ID")}`;
}

export function matchesEntrySearch(entry: Entry, searchTerm: string): boolean {
  const query = searchTerm.trim().toLocaleLowerCase();
  if (!query) return true;

  return [
    entry.detail,
    entry.namaTransaksi,
    entry.jenisTransaksi?.arah === "PEMASUKAN" ? "Pemasukan" : "Pengeluaran",
    entry.tanggal,
    formatRupiah(entry.nominal),
  ].some((value) => String(value ?? "").toLocaleLowerCase().includes(query));
}

export function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

/** "a, b , c" -> ["a","b","c"] */
export function parseOpsi(opsi: string): string[] {
  return opsi.split(",").map((s) => s.trim()).filter(Boolean);
}

/** Setara dengan `e.message || fallback` di kode asli, tapi aman untuk error non-Error. */
export function errMsg(e: unknown, fallback: string): string {
  return (e as { message?: string } | null)?.message || fallback;
}
