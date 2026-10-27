"use client";

import { useId, useState } from "react";
import { longDate, rupiah, shortDate } from "../shared/format";
import type { TrendPoint } from "../shared/types";

const W = 780; // lebar area plot
const TOP = 40;
const BOTTOM = 200;

/** Grafik garis + area. Dipisah supaya state titik aktif ikut reset saat periode berganti (lewat key). */
export function TrendPlot({ data }: { data: TrendPoint[] }) {
  const gradId = useId();
  const n = data.length;
  const [active, setActive] = useState(n - 1);

  const values = data.map((d) => d.total);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || max || 1;
  const lo = Math.max(0, min - span * 0.25);
  const hi = max + span * 0.15;

  const points = data.map((d, i) => ({
    ...d,
    x: n === 1 ? W / 2 : (i * W) / (n - 1),
    y: BOTTOM - ((d.total - lo) / (hi - lo || 1)) * (BOTTOM - TOP),
  }));

  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${line} ${points[n - 1].x},${BOTTOM} ${points[0].x},${BOTTOM}`;
  const a = points[Math.min(active, n - 1)];

  const step = n <= 8 ? 1 : n <= 16 ? 2 : 5;
  const showLabel = (i: number) => i === n - 1 || (i % step === 0 && n - 1 - i >= Math.ceil(step / 2));
  const hit = n === 1 ? W : W / (n - 1);

  return (
    <div className="relative mt-6">
      <svg viewBox="-20 0 840 240" className="block w-full" role="img" aria-label={`Grafik tren penjualan ${n} hari`}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1969FF" stopOpacity=".28" />
            <stop offset="1" stopColor="#1969FF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[40, 100, 160].map((y) => (
          <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="#E8EEFB" strokeDasharray="4 6" />
        ))}
        <line x1="0" x2={W} y1={BOTTOM} y2={BOTTOM} stroke="#E4E9F5" />

        {n > 1 && <polygon points={area} fill={`url(#${gradId})`} />}
        {n > 1 && (
          <polyline
            points={line}
            fill="none"
            stroke="#1969FF"
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        <line x1={a.x} x2={a.x} y1={a.y} y2={BOTTOM} stroke="#1969FF" strokeDasharray="3 4" opacity=".5" />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === active ? 7 : n > 16 ? 3 : 4}
            fill={i === active ? "#1969FF" : "#fff"}
            stroke={i === active ? "#fff" : "#1969FF"}
            strokeWidth={i === active ? 3 : 2}
          />
        ))}

        {points.map((p, i) =>
          showLabel(i) ? (
            <text
              key={i}
              x={p.x}
              y="226"
              fontSize="11"
              fontWeight="700"
              letterSpacing=".05em"
              textAnchor="middle"
              fill={i === active ? "#1969FF" : "#8A909C"}
            >
              {shortDate(p.tanggal)}
            </text>
          ) : null,
        )}

        {/* Area sentuh tak terlihat untuk hover / tap */}
        {points.map((p, i) => (
          <rect
            key={i}
            x={p.x - hit / 2}
            y="0"
            width={hit}
            height="240"
            fill="transparent"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          />
        ))}
      </svg>

      <div
        className="pointer-events-none absolute whitespace-nowrap rounded-[14px] bg-[#0f1f4d] px-3.5 py-2.5 text-white shadow-[0_12px_24px_rgba(11,27,74,.3)]"
        style={{
          left: `${Math.min(Math.max(((a.x + 20) / 840) * 100, 10), 90)}%`,
          top: `${(a.y / 240) * 100}%`,
          transform: "translate(-50%, calc(-100% - 14px))",
        }}
      >
        <p className="text-[11px] font-bold uppercase tracking-[.06em] text-sky">{longDate(a.tanggal)}</p>
        <p className="tabular text-base font-extrabold">{rupiah(a.total)}</p>
      </div>
    </div>
  );
}
