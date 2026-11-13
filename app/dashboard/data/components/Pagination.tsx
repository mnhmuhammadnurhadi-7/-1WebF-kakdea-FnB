"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
};

export function Pagination({ page, totalPages, total, pageSize, onPage, onPageSize }: PaginationProps) {
  const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  const first = total ? (safePage - 1) * pageSize + 1 : 0;
  const last = Math.min(safePage * pageSize, total);
  const visible = total ? last - first + 1 : 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft bg-white px-4 py-3 text-[13px]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-xs font-medium text-muted">Menampilkan {visible} dari {total} data</span>
        <label className="flex items-center gap-2 text-xs font-medium text-muted">
          Tampilkan
          <select value={pageSize} onChange={(event) => onPageSize(Number(event.target.value))} className="rounded-lg border border-line bg-field px-3 py-2 font-semibold text-navy shadow-inset focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10">
            {[10, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
          per halaman
        </label>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPage(safePage - 1)} disabled={safePage <= 1} className="rounded-lg border border-line bg-white px-3.5 py-2 text-xs font-bold text-navy transition hover:border-brand hover:bg-sky-tint disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-white">Sebelumnya</button>
        <span className="tabular min-w-16 rounded-lg bg-app px-3 py-2 text-center text-xs font-bold text-navy">{safePage} / {Math.max(1, totalPages)}</span>
        <button type="button" onClick={() => onPage(safePage + 1)} disabled={safePage >= totalPages} className="rounded-lg border border-line bg-white px-3.5 py-2 text-xs font-bold text-navy transition hover:border-brand hover:bg-sky-tint disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-white">Berikutnya</button>
      </div>
    </div>
  );
}
