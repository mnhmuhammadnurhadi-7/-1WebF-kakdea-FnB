/** Setara dengan `e.message || fallback` di kode asli, tapi aman untuk error non-Error. */
export function errMsg(e: unknown, fallback: string): string {
  return (e as { message?: string } | null)?.message || fallback;
}

export function formatRupiah(n: unknown): string {
  return `Rp ${Number(n).toLocaleString("id-ID")}`;
}
