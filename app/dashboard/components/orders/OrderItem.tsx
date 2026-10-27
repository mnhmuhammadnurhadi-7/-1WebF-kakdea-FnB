"use client";

import { rupiah } from "../shared/format";
import type { RecentOrder } from "../shared/types";

const badge = "rounded-full px-[9px] py-[3px] text-[10.5px] font-extrabold tracking-[.06em]";

export function OrderItem({ title, date, amount, via, source }: RecentOrder) {
  return (
    <li className="rounded-2xl bg-plate px-4 py-3.5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[14.5px] font-bold leading-snug">{title}</span>
        <span className="tabular shrink-0 text-[14.5px] font-extrabold text-ok-text">+ {rupiah(amount)}</span>
      </div>
      <p className="mb-2 mt-1 text-[11.5px] font-semibold text-faint">{date}</p>
      <div className="flex flex-wrap gap-2">
        <span className={badge + (via === "AI" ? " bg-brand text-white" : " bg-navy text-white")}>{via}</span>
        {source !== "-" && <span className={badge + " bg-sky-soft text-[#0f4c75]"}>{source.toUpperCase()}</span>}
      </div>
    </li>
  );
}
