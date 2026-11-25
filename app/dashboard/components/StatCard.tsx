"use client";

import { Icon, type IconName } from "./Icon";

export type StatTone = "ok" | "bad" | "brand";

const STAT_ICON: Record<StatTone, string> = {
  ok: "bg-ok-tint text-ok-text",
  bad: "bg-bad-tint text-bad",
  brand: "bg-[#e8f0ff] text-brand",
};

const STAT_DOT: Record<StatTone, string> = {
  ok: "bg-ok",
  bad: "bg-bad",
  brand: "bg-brand",
};

type StatCardProps = {
  label: string;
  value: string;
  sub: string;
  change: string;
  icon: IconName;
  tone: StatTone;
};

export function StatCard({ label, value, sub, change, icon, tone }: StatCardProps) {
  return (
    <article className="flex min-h-[164px] flex-col justify-between rounded-[20px] border border-line bg-white px-5 py-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.1em] text-faint">{label}</p>
          <p className="tabular mt-2 text-[23px] font-bold tracking-[-.035em] text-ink">{value}</p>
        </div>
        <span className={"flex size-9 shrink-0 items-center justify-center rounded-xl " + STAT_ICON[tone]}>
          <Icon name={icon} size={19} stroke={1.8} />
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 text-[12px] font-medium">
        <span className="flex items-center gap-[7px] text-body">
          <span className={"size-2 rounded-full " + STAT_DOT[tone]} />
          {sub}
        </span>
        {change && <span className="text-right text-[10px] font-semibold text-faint">{change}</span>}
      </div>
    </article>
  );
}
