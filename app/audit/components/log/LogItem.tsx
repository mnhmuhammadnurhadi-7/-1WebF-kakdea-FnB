import { TONE_CHIP, TONE_DOT, getActionMeta, sheetTone } from "../shared/constants";
import type { AuditLog } from "../shared/types";

type LogItemProps = { log: AuditLog; expanded: boolean; onToggle: () => void };

export function LogItem({ log: l, expanded, onToggle }: LogItemProps) {
  const meta = getActionMeta(l.action);
  const sTone = sheetTone[l.sheet] || "brand";
  const isAi = l.source.toUpperCase() === "AI";

  return (
    <div className="px-5 py-2">
      <div className="relative flex flex-col gap-3 rounded-2xl border border-line-soft bg-[#fbfcff] p-4 transition-shadow hover:shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className={"size-2.5 shrink-0 rounded-full " + TONE_DOT[meta.tone]} aria-hidden="true" />
            <span className="text-[14.5px] font-bold tracking-[-.01em] text-ink">{l.recordLabel}</span>
            <span className={"rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[.06em] " + TONE_CHIP[sTone]}>{l.sheet}</span>
            <span className={"rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[.06em] " + (isAi ? TONE_CHIP.sky : TONE_CHIP.neutral)}>{l.source}</span>
            <span className={"rounded-full px-2.5 py-1 text-[10.5px] font-extrabold " + TONE_CHIP[meta.tone]}>{meta.label}</span>
          </div>
        </div>

        {l.detail && <p className="text-[13px] leading-relaxed text-body">{l.detail}</p>}

        <p className="text-[11.5px] text-faint">
          oleh <strong className="font-bold text-ink">{l.actor}</strong> • {l.tanggal} · {l.jam}
        </p>

        {l.perubahan && l.perubahan.length > 0 && (
          <div className="flex flex-col gap-2">
            <button type="button" onClick={onToggle} className="self-start text-[12.5px] font-bold text-brand hover:underline">
              {expanded ? "Sembunyikan detail perubahan ▲" : `Lihat ${l.perubahan.length} detail perubahan ▼`}
            </button>

            {expanded && (
              <div className="flex flex-col gap-2 rounded-xl bg-cream p-3 text-[12.5px]">
                {l.perubahan.map((p, pIdx) => (
                  <div key={pIdx} className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-ink">{p.field}:</span>
                    {p.sebelum && <span className="text-bad-text line-through">{p.sebelum}</span>}
                    {p.sebelum && p.sesudah && <span className="text-faint">➔</span>}
                    {p.sesudah && <span className="font-bold text-ok-text">{p.sesudah}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
