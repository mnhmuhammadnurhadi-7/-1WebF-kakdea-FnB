/** Pita kecil penanda bahwa halaman memakai data contoh, bukan data dari backend. */
export function TestBanner() {
  return (
    <div className="mb-5 flex items-center gap-2 rounded-2xl border border-[#c5d8ff] bg-[#e8f0ff] px-4 py-2.5 text-[13px] font-semibold text-navy">
      <span className="size-2 rounded-full bg-brand" />
      Mode testing: data di halaman ini adalah contoh, belum dari backend.
    </div>
  );
}
