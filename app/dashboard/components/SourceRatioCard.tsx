"use client";

import type { InputSourceStats } from "./types";

export function SourceRatioCard({ data }: { data: InputSourceStats | null }) {
  const rows = [
    { key: "AI", label: "Asisten AI otomatis", count: data?.ai ?? 0, percent: data?.aiPersen ?? 0, color: "bg-brand", badge: "bg-brand" },
    { key: "MANUAL", label: "Input tombol +", count: data?.manual ?? 0, percent: data?.manualPersen ?? 0, color: "bg-sky", badge: "bg-navy" },
  ];

  return (
    <section className="rounded-panel bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-[-.03em]">Sumber Input Data</h2>
          <p className="mt-1 text-[13px] text-muted">Perbandingan entri via AI vs Manual.</p>
        </div>
        <span className="text-xs font-semibold text-faint">30 hari terakhir</span>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {rows.map((row) => (
        <div key={row.key}>
          <div className="mb-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`rounded-full ${row.badge} px-[9px] py-[3px] text-[10.5px] font-extrabold tracking-[.06em] text-white`}>{row.key}</span>
              <span className="text-sm">{row.label}</span>
            </div>
            <div className="text-right">
              <span className="tabular text-lg font-extrabold">{row.percent}%</span>
              <span className="ml-2 text-[11px] text-muted">{row.count.toLocaleString("id-ID")} entri</span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-app">
            <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.percent}%` }} />
          </div>
        </div>
        ))}
      </div>
    </section>
  );
}
