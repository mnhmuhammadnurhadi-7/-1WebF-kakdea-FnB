"use client";

import { useMemo } from "react";
import { rupiah, shortDate } from "../shared/format";
import { TrendPlot } from "./TrendPlot";
import type { PeriodeKey, TrendPoint } from "../shared/types";

type SalesTrendChartProps = {
  data: TrendPoint[];
  periode: PeriodeKey;
  onPeriode: (p: PeriodeKey) => void;
};

export function SalesTrendChart({ data, periode, onPeriode }: SalesTrendChartProps) {
  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const totals = data.map((d) => d.total);
    const sum = totals.reduce((a, b) => a + b, 0);
    const max = Math.max(...totals);
    const min = Math.min(...totals);
    return {
      sum,
      avg: Math.round(sum / totals.length),
      max,
      min,
      maxDay: data.find((d) => d.total === max),
      minDay: data.find((d) => d.total === min),
    };
  }, [data]);

  return (
    <section className="rounded-panel bg-white p-6 shadow-card">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="max-w-[300px] text-xl font-bold leading-tight tracking-[-.03em]">
            Tren Penjualan {periode === "7d" ? "7 Hari" : "30 Hari"} Terakhir
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            {data.length > 0
              ? `Periode ${shortDate(data[0].tanggal)} - ${shortDate(data[data.length - 1].tanggal)} (${data.length} hari)`
              : "Total penjualan per hari dari data order aktual."}
          </p>

          <div className="mt-3 inline-flex items-center gap-1 rounded-xl bg-app p-1">
            {(["7d", "30d"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPeriode(p)}
                aria-pressed={periode === p}
                className={
                  "rounded-lg px-3.5 py-1.5 text-xs font-bold transition " +
                  (periode === p ? "bg-brand text-white shadow-blue" : "text-body hover:text-ink")
                }
              >
                {p === "7d" ? "7H" : "30H"}
              </button>
            ))}
          </div>
        </div>

        {stats && (
          <div className="flex gap-5 rounded-2xl bg-plate px-[18px] py-3">
            <div>
              <p className="text-[10.5px] font-extrabold tracking-[.08em] text-label">TOTAL PENJUALAN</p>
              <p className="tabular text-lg font-extrabold">{rupiah(stats.sum)}</p>
            </div>
            <div>
              <p className="text-[10.5px] font-extrabold tracking-[.08em] text-label">RATA-RATA HARIAN</p>
              <p className="tabular text-sm font-bold text-brand">{rupiah(stats.avg)} / hari</p>
            </div>
          </div>
        )}
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-sm text-muted">
          Belum ada data penjualan untuk periode ini
        </div>
      ) : (
        <>
          <TrendPlot key={periode + ":" + data.length} data={data} />

          {stats && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-plate px-4 py-3">
                <p className="text-[10.5px] font-extrabold tracking-[.08em] text-label">HARI TERTINGGI</p>
                <p className="tabular text-sm font-extrabold text-ok-text">
                  {rupiah(stats.max)} · {stats.maxDay ? shortDate(stats.maxDay.tanggal) : ""}
                </p>
              </div>
              <div className="rounded-2xl bg-plate px-4 py-3">
                <p className="text-[10.5px] font-extrabold tracking-[.08em] text-label">HARI TERENDAH</p>
                <p className="tabular text-sm font-extrabold text-bad-text">
                  {rupiah(stats.min)} · {stats.minDay ? shortDate(stats.minDay.tanggal) : ""}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
