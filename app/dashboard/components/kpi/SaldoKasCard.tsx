"use client";

import { Icon } from "../shared/Icon";
import { rupiah } from "../shared/format";

type SaldoKasCardProps = { amount: number; note: string; hint: string };

export function SaldoKasCard({ amount, note, hint }: SaldoKasCardProps) {
  return (
    <article className="relative overflow-hidden rounded-card bg-navy px-6 py-[22px] shadow-navy">
      <svg
        aria-hidden="true"
        viewBox="0 0 260 170"
        className="pointer-events-none absolute -right-[70px] -top-10 h-[170px] w-[260px]"
      >
        <ellipse
          cx="140"
          cy="85"
          rx="115"
          ry="52"
          transform="rotate(-22 140 85)"
          fill="none"
          stroke="rgba(142,209,228,.3)"
          strokeDasharray="7 7"
        />
      </svg>

      <div className="relative flex items-center justify-between">
        <span className="text-sm text-[#cfeff7]">Saldo Kas Hari Ini</span>
        <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 text-white">
          <Icon name="wallet" size={20} />
        </span>
      </div>

      <p className="tabular relative my-3.5 text-[34px] font-bold tracking-[-.035em] text-white">{rupiah(amount)}</p>

      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-[5px] text-[12.5px] font-bold text-white">
          <Icon name="trend" size={15} stroke={2.4} className="text-[#6ee7b7]" />
          {hint}
        </span>
        <span className="text-xs text-[#cfeff7]">{note}</span>
      </div>
    </article>
  );
}
