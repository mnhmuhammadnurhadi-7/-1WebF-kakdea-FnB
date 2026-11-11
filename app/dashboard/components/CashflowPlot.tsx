"use client";

import { useId, useState } from "react";
import { longDate, rupiah, shortDate } from "./format";
import type { CashflowPoint } from "./types";

const W = 780;
const TOP = 36;
const BOTTOM = 205;

export function CashflowPlot({ data }: { data: CashflowPoint[] }) {
  const gradientId = useId();
  const [activeIndex, setActiveIndex] = useState(data.length - 1);
  const max = Math.max(1, ...data.flatMap((day) => [day.pemasukan, day.pengeluaran]));
  const xFor = (index: number) => data.length === 1 ? W / 2 : index * W / (data.length - 1);
  const yFor = (amount: number) => BOTTOM - (amount / max) * (BOTTOM - TOP);
  const incomePoints = data.map((day, index) => `${xFor(index)},${yFor(day.pemasukan)}`).join(" ");
  const expensePoints = data.map((day, index) => `${xFor(index)},${yFor(day.pengeluaran)}`).join(" ");
  const active = data[Math.min(Math.max(activeIndex, 0), data.length - 1)];
  const activeX = xFor(Math.min(Math.max(activeIndex, 0), data.length - 1));
  const activeY = Math.min(yFor(active.pemasukan), yFor(active.pengeluaran));
  const step = data.length <= 8 ? 1 : data.length <= 16 ? 2 : Math.ceil(data.length / 8);
  const hitWidth = data.length === 1 ? W : W / (data.length - 1);
  const entries = active.transaksi;

  return (
    <div className="relative mt-5">
      <div className="mb-2 flex flex-wrap gap-4 text-xs font-semibold">
        <span className="flex items-center gap-2 text-[#167442]"><i className="h-2.5 w-2.5 rounded-full bg-[#159447]" />Pemasukan</span>
        <span className="flex items-center gap-2 text-[#B42318]"><i className="h-2.5 w-2.5 rounded-full bg-[#DC2626]" />Pengeluaran</span>
      </div>
      <svg viewBox="-20 0 840 240" className="block w-full" role="img" aria-label={`Grafik kas, ${data.length} hari`}>
        <defs>
          <linearGradient id={`${gradientId}-income`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#159447" stopOpacity=".2" />
            <stop offset="1" stopColor="#159447" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${gradientId}-expense`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#DC2626" stopOpacity=".15" />
            <stop offset="1" stopColor="#DC2626" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[36, 92, 148].map((y) => <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="#E8EEFB" strokeDasharray="4 6" />)}
        <line x1="0" x2={W} y1={BOTTOM} y2={BOTTOM} stroke="#E4E9F5" />
        {data.length > 1 && <polygon points={`${incomePoints} ${xFor(data.length - 1)},${BOTTOM} ${xFor(0)},${BOTTOM}`} fill={`url(#${gradientId}-income)`} />}
        {data.length > 1 && <polygon points={`${expensePoints} ${xFor(data.length - 1)},${BOTTOM} ${xFor(0)},${BOTTOM}`} fill={`url(#${gradientId}-expense)`} />}
        {data.length > 1 && <polyline points={incomePoints} fill="none" stroke="#159447" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" />}
        {data.length > 1 && <polyline points={expensePoints} fill="none" stroke="#DC2626" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" />}
        <line x1={activeX} x2={activeX} y1={activeY} y2={BOTTOM} stroke="#64748B" strokeDasharray="3 4" opacity=".55" />
        {data.map((day, index) => (
          <g key={day.tanggal}>
            <circle cx={xFor(index)} cy={yFor(day.pemasukan)} r={index === activeIndex ? 5 : 3} fill="#fff" stroke="#159447" strokeWidth="2" />
            <circle cx={xFor(index)} cy={yFor(day.pengeluaran)} r={index === activeIndex ? 5 : 3} fill="#fff" stroke="#DC2626" strokeWidth="2" />
            {(index === data.length - 1 || (index % step === 0 && data.length - 1 - index >= Math.ceil(step / 2))) && (
              <text x={xFor(index)} y="230" fontSize="11" fontWeight="700" textAnchor="middle" fill={index === activeIndex ? "#1969FF" : "#8A909C"}>{shortDate(day.tanggal)}</text>
            )}
          </g>
        ))}
        {data.map((day, index) => (
          <rect key={`hit-${day.tanggal}`} x={Math.max(-10, xFor(index) - hitWidth / 2)} y="0" width={Math.min(hitWidth, W)} height="240" fill="transparent" onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onClick={() => setActiveIndex(index)} />
        ))}
      </svg>

      <div className="pointer-events-none absolute z-10 max-h-64 w-[min(320px,85vw)] -translate-x-1/2 -translate-y-full overflow-hidden rounded-[14px] bg-[#0f1f4d] p-3.5 text-white shadow-[0_12px_24px_rgba(11,27,74,.3)]" style={{ left: `${Math.min(Math.max(((activeX + 20) / 840) * 100, 18), 82)}%`, top: `${Math.max((activeY / 240) * 100, 25)}%` }}>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[.06em] text-sky">{longDate(active.tanggal)}</p>
        <div className="mb-2 flex justify-between gap-3 text-xs"><span className="text-[#86E0A6]">Pemasukan</span><b className="tabular">{rupiah(active.pemasukan)}</b></div>
        <div className="mb-2 flex justify-between gap-3 text-xs"><span className="text-[#FF9A9A]">Pengeluaran</span><b className="tabular">{rupiah(active.pengeluaran)}</b></div>
        <div className="border-t border-white/15 pt-2">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[.06em] text-slate-300">Transaksi</p>
          {entries.length ? (
            <ul className="space-y-1.5">
              {entries.slice(0, 7).map((entry) => (
                <li key={entry.id} className="flex items-start justify-between gap-3 text-xs">
                  <span className="min-w-0"><span className={entry.arah === "PEMASUKAN" ? "text-[#86E0A6]" : "text-[#FF9A9A]"}>{entry.arah === "PEMASUKAN" ? "+" : "−"}</span> {entry.detail}<small className="block truncate pl-3 text-[10px] text-slate-300">{entry.jenis}</small></span>
                  <b className="tabular shrink-0">{rupiah(entry.nominal)}</b>
                </li>
              ))}
              {entries.length > 7 && <li className="text-[10px] text-slate-300">+{entries.length - 7} transaksi lainnya</li>}
            </ul>
          ) : <p className="text-xs text-slate-300">Tidak ada transaksi pada tanggal ini.</p>}
        </div>
      </div>
    </div>
  );
}
