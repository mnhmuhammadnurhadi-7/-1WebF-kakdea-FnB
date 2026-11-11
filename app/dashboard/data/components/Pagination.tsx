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
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft px-4 py-3 text-[13px]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-muted">Menampilkan {visible} dari {total} data</span>
        <label className="flex items-center gap-2 text-muted">
          Tampilkan
          <select value={pageSize} onChange={(event) => onPageSize(Number(event.target.value))} className="rounded-lg border border-line bg-white px-2.5 py-1.5 font-semibold text-body focus:border-brand focus:outline-none">
            {[10, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
          per halaman
        </label>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onPage(safePage - 1)} disabled={safePage <= 1} className="rounded-lg border border-line px-3 py-1.5 font-semibold text-body disabled:cursor-not-allowed disabled:opacity-40">Sebelumnya</button>
        <span className="tabular min-w-16 text-center text-muted">{safePage} / {Math.max(1, totalPages)}</span>
        <button type="button" onClick={() => onPage(safePage + 1)} disabled={safePage >= totalPages} className="rounded-lg border border-line px-3 py-1.5 font-semibold text-body disabled:cursor-not-allowed disabled:opacity-40">Berikutnya</button>
      </div>
    </div>
  );
}
