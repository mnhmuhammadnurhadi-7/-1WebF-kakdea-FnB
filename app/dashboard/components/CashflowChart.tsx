"use client";

import { useMemo } from "react";
import { rupiah, shortDate } from "./format";
import { CashflowPlot } from "./CashflowPlot";
import type { CashflowPoint, PeriodeKey } from "./types";

type CashflowChartProps = {
  data: CashflowPoint[];
  periode: PeriodeKey;
  onPeriode: (p: PeriodeKey) => void;
};

export function CashflowChart({ data, periode, onPeriode }: CashflowChartProps) {
  const totals = useMemo(() => data.reduce((sum, day) => ({
    pemasukan: sum.pemasukan + day.pemasukan,
    pengeluaran: sum.pengeluaran + day.pengeluaran,
  }), { pemasukan: 0, pengeluaran: 0 }), [data]);
  const transactionCount = data.reduce((sum, day) => sum + day.transaksi.length, 0);

  return (
    <section className="min-w-0 rounded-panel border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-[-.03em]">Grafik Kas</h2>
          <p className="mt-1 text-[13px] text-muted">
            {data.length ? `Pemasukan dan pengeluaran dari ${transactionCount} transaksi · ${shortDate(data[0].tanggal)} – ${shortDate(data[data.length - 1].tanggal)}` : "Belum ada transaksi pada periode ini."}
          </p>
          <div className="mt-3 inline-flex items-center gap-1 rounded-xl bg-app p-1">
            {(["semua", "mingguan", "bulanan"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onPeriode(value)}
                aria-pressed={periode === value}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${periode === value ? "bg-brand text-white shadow-blue" : "text-body hover:text-ink"}`}
              >
                {value === "semua" ? "Semua" : value === "mingguan" ? "Mingguan" : "Bulanan"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-xl bg-[#EAF7EF] px-4 py-2.5">
            <p className="text-[10px] font-extrabold tracking-[.08em] text-[#167442]">PEMASUKAN</p>
            <p className="tabular text-base font-extrabold text-[#167442]">{rupiah(totals.pemasukan)}</p>
          </div>
          <div className="rounded-xl bg-[#FDEEEE] px-4 py-2.5">
            <p className="text-[10px] font-extrabold tracking-[.08em] text-[#B42318]">PENGELUARAN</p>
            <p className="tabular text-base font-extrabold text-[#B42318]">{rupiah(totals.pengeluaran)}</p>
          </div>
        </div>
      </div>

      {transactionCount === 0 ? (
        <div className="flex items-center justify-center py-14 text-sm text-muted">Belum ada transaksi untuk ditampilkan.</div>
      ) : (
        <CashflowPlot key={`${periode}:${data.length}`} data={data} />
      )}
    </section>
  );
}
