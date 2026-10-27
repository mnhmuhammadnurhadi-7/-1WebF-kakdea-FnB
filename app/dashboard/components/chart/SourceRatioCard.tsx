"use client";

export function SourceRatioCard() {
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
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-brand px-[9px] py-[3px] text-[10.5px] font-extrabold tracking-[.06em] text-white">AI</span>
              <span className="text-sm">Asisten AI otomatis</span>
            </div>
            <div className="text-right">
              <span className="tabular text-lg font-extrabold">72%</span>
              <span className="ml-2 text-[11px] text-muted">318 entri</span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-app">
            <div className="h-full rounded-full bg-brand" style={{ width: "72%" }} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-navy px-[9px] py-[3px] text-[10.5px] font-extrabold tracking-[.06em] text-white">MANUAL</span>
              <span className="text-sm">Input tombol +</span>
            </div>
            <div className="text-right">
              <span className="tabular text-lg font-extrabold">28%</span>
              <span className="ml-2 text-[11px] text-muted">124 entri</span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-app">
            <div className="h-full rounded-full bg-sky" style={{ width: "28%" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
