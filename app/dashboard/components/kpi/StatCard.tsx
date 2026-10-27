"use client";

import { Icon, type IconName } from "../shared/Icon";

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
    <article className="flex min-h-[168px] flex-col justify-between rounded-card bg-white px-6 py-[22px] shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.1em] text-label">{label}</p>
          <p className="tabular mt-1.5 text-[26px] font-bold tracking-[-.03em]">{value}</p>
        </div>
        <span className={"flex size-[38px] items-center justify-center rounded-xl " + STAT_ICON[tone]}>
          <Icon name={icon} size={19} stroke={1.8} />
        </span>
      </div>

      <div className="flex items-center justify-between text-[12.5px] font-semibold">
        <span className="flex items-center gap-[7px] text-body">
          <span className={"size-2 rounded-full " + STAT_DOT[tone]} />
          {sub}
        </span>
        {change && <span className="text-[11px] font-bold tracking-[.04em] text-faint">{change}</span>}
      </div>
    </article>
  );
}
