import { Icon, type IconName } from "../shared/Icon";

export type Stat = { l: string; v: number; icon: IconName };

/** Kartu ringkasan: kartu pertama navy (sorotan), sisanya putih — mengikuti Figma. */
export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s, i) => {
        const hero = i === 0;
        return (
          <div key={s.l} className={"flex items-center gap-4 rounded-card p-5 " + (hero ? "bg-navy text-white shadow-navy" : "bg-white text-ink shadow-card")}>
            <span className={"flex size-11 shrink-0 items-center justify-center rounded-xl " + (hero ? "bg-white/15 text-white" : "bg-[#e8f0ff] text-brand")}>
              <Icon name={s.icon} size={20} />
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className={"text-[11px] font-extrabold uppercase tracking-[.08em] " + (hero ? "text-sky" : "text-label")}>{s.l}</span>
              <span className="tabular text-[28px] font-extrabold leading-tight tracking-[-.02em]">{s.v}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
