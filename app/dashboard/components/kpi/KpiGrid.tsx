"use client";

import { rupiah } from "../shared/format";
import { SaldoKasCard } from "./SaldoKasCard";
import { StatCard } from "./StatCard";
import type { PemasukanPengeluaran } from "../shared/types";

type KpiGridProps = {
  saldoKas: number | null;
  pp: PemasukanPengeluaran | null;
};

export function KpiGrid({ saldoKas, pp }: KpiGridProps) {
  const GRID = "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-[1.35fr_1fr_1fr_1fr]";

  if (saldoKas === null) {
    return (
      <div className={GRID}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-shimmer min-h-[168px] rounded-card shadow-card" />
        ))}
      </div>
    );
  }

  const hari = pp ? pp.daily.length : 0;
  const laba = pp ? pp.totals.laba : 0;

  return (
    <div className={GRID}>
      <SaldoKasCard amount={saldoKas} note="Kas utama" hint="Update real-time" />
      <StatCard
        label="Total Pemasukan"
        value={pp ? rupiah(pp.totals.pemasukan) : "—"}
        sub="periode ini"
        change={pp && pp.totals.pemasukan > 0 ? `${hari} hari data` : ""}
        icon="trend"
        tone="ok"
      />
      <StatCard
        label="Total Pengeluaran"
        value={pp ? rupiah(pp.totals.pengeluaran) : "—"}
        sub="periode ini"
        change={pp && pp.totals.pengeluaran > 0 ? `${hari} hari data` : ""}
        icon="bag"
        tone="bad"
      />
      <StatCard
        label="Laba / Rugi"
        value={pp ? rupiah(Math.abs(laba)) : "—"}
        sub={pp ? (laba >= 0 ? "laba bersih" : "rugi bersih") : "periode ini"}
        change={pp ? (laba >= 0 ? "POSITIF" : "NEGATIF") : ""}
        icon={laba >= 0 ? "trend" : "trendDown"}
        tone={!pp ? "brand" : laba >= 0 ? "ok" : "bad"}
      />
    </div>
  );
}
