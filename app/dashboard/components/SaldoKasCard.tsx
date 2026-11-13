"use client";

import { Icon } from "./Icon";
import { rupiah } from "./format";

type SaldoKasCardProps = { amount: number; note: string; hint: string };

export function SaldoKasCard({ amount, note, hint }: SaldoKasCardProps) {
  return (
    <article className="relative isolate flex min-h-[164px] flex-col justify-between overflow-hidden rounded-[20px] bg-gradient-to-br from-navy to-brand px-5 py-5 text-white shadow-blue">
      <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full border-[16px] border-white/10" />
      <div className="relative flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[.1em] text-white/70">Saldo kas</span>
        <span className="flex size-9 items-center justify-center rounded-xl bg-white/15">
          <Icon name="wallet" size={18} className="text-white" />
        </span>
      </div>

      <p className="tabular relative my-3 text-[27px] font-bold tracking-[-.035em]">{rupiah(amount)}</p>

      <div className="relative flex items-center justify-between gap-2 text-[11px] text-white/75">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="trend" size={13} stroke={1.8} className="text-sky" />
          {hint}
        </span>
        <span className="text-right">{note}</span>
      </div>
    </article>
  );
}
