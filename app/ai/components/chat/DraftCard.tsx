import { Button } from "../shared/Button";
import { Icon } from "../shared/Icon";
import type { DraftCardData } from "../shared/types";

export function DraftCard({ data }: { data: DraftCardData }) {
  return (
    <div className="w-full overflow-hidden rounded-card bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-soft px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#e8f0ff] text-brand">
            <Icon name="doc" size={17} stroke={2} />
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold leading-tight tracking-[-.02em] text-ink">{data.title}</span>
            <span className="text-[11.5px] text-faint">Sheet: {data.sheet} · menunggu konfirmasi</span>
          </div>
        </div>
        {data.sourceBadge && (
          <span className="rounded-full bg-sky-tint px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[.08em] text-navy">{data.sourceBadge}</span>
        )}
      </div>

      <div className="flex flex-col px-5 py-3">
        {data.rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between gap-4 border-b border-dashed border-line py-2.5 last:border-b-0">
            <span className="text-[13px] text-body">{r.label}</span>
            <span className="text-right text-[13.5px] font-bold text-ink">{r.value}</span>
          </div>
        ))}
      </div>

      {data.total && (
        <div className="mx-4 mb-4 flex items-center justify-between rounded-xl bg-[#eef4ff] px-4 py-3">
          <span className="text-[13.5px] font-bold text-ink">Total</span>
          <span className="tabular text-[24px] font-extrabold tracking-[-.02em] text-brand">{data.total}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line-soft bg-cream px-5 py-3.5">
        <Button variant="secondary" size="sm">Koreksi</Button>
        <Button variant="outline" size="sm">Simpan sebagai Draf</Button>
        <Button size="sm" icon="check">Simpan &amp; Posting</Button>
      </div>
    </div>
  );
}
