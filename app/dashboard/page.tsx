import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const SearchIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ArrowUpRight = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const PackageIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const CartIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const TrendingUp = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const WalletIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </svg>
);

const summaryCards = [
  {
    label: "Total Produk",
    value: "12",
    sub: "varian frozen & siap saji",
    change: "+2 baru bulan ini",
    changeTone: "success" as const,
    icon: PackageIcon,
    iconBg: "bg-teal-mint",
    iconColor: "text-teal-active",
  },
  {
    label: "Order Hari Ini",
    value: "18",
    sub: "order masuk",
    change: "2 sedang diproses",
    changeTone: "neutral" as const,
    icon: CartIcon,
    iconBg: "bg-accent-bg",
    iconColor: "text-accent",
  },
  {
    label: "Pemasukan Bulan Ini",
    value: "Rp 8.425.000",
    sub: "dari total penjualan",
    change: "+18% vs bulan lalu",
    changeTone: "success" as const,
    icon: TrendingUp,
    iconBg: "bg-teal-success-bg",
    iconColor: "text-teal-success",
  },
  {
    label: "Saldo Kas",
    value: "Rp 2.180.000",
    sub: "per 5 Sept 2026",
    change: "selisih oke ✅",
    changeTone: "neutral" as const,
    icon: WalletIcon,
    iconBg: "bg-yellow-tag-bg",
    iconColor: "text-yellow-tag-ink",
  },
];

const recentOrders = [
  {
    id: 1,
    customer: "DM Instagram — Toko Barokah",
    source: "DM IG",
    amount: "Rp 185.000",
    status: "Baru",
    date: "Hari ini, 10:32",
    tags: ["ai"],
  },
  {
    id: 2,
    customer: "GrabFood #GF-1044",
    source: "GrabFood",
    amount: "Rp 92.000",
    status: "Diproses",
    date: "Hari ini, 09:15",
    tags: ["source"],
  },
  {
    id: 3,
    customer: "Bu Siti — WA",
    source: "WA",
    amount: "Rp 240.000",
    status: "Selesai",
    date: "Kemarin, 18:44",
    tags: ["manual"],
  },
  {
    id: 4,
    customer: "Warung Makmur — COD",
    source: "Manual",
    amount: "Rp 65.000",
    status: "Selesai",
    date: "Kemarin, 14:20",
    tags: ["manual"],
  },
];

export default function DashboardPage() {
  return (
    <AppLayout activeMenu="dashboard">
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4 pb-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-[28px] font-semibold text-ink leading-tight">
              Dashboard
            </h1>
            <p className="text-[14px] text-muted">
              Ringkasan operasional Buku Dapur hari ini.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2.5 text-muted">
            {SearchIcon}
            <input
              type="text"
              placeholder="Cari order, produk, transaksi…"
              className="w-56 bg-transparent text-[13px] text-ink placeholder:text-muted-light focus:outline-none"
            />
          </div>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((c) => (
            <Card key={c.label} className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.iconBg} ${c.iconColor}`}
                >
                  {c.icon}
                </div>
                <span className="text-muted">{ArrowUpRight}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-medium text-muted">{c.label}</span>
                <span className="font-heading text-[24px] font-bold text-ink leading-tight">
                  {c.value}
                </span>
                <span className="text-[12px] text-muted">{c.sub}</span>
              </div>
              <div
                className={`text-[12px] font-semibold ${
                  c.changeTone === "success" ? "text-teal-success" : "text-muted"
                }`}
              >
                {c.change}
              </div>
            </Card>
          ))}
        </div>

        <Card className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-[20px] font-semibold text-ink">
                Tren Penjualan 7 Hari Terakhir
              </h3>
              <p className="text-[13px] text-muted">
                Perbandingan aktual vs target penjualan per hari.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-lg bg-card-muted p-1">
                <button type="button" className="rounded-md bg-card px-3 py-1.5 text-[12px] font-semibold text-ink shadow-sm">
                  7H
                </button>
                <button type="button" className="rounded-md px-3 py-1.5 text-[12px] font-medium text-muted hover:text-ink">
                  30H
                </button>
                <button type="button" className="rounded-md px-3 py-1.5 text-[12px] font-medium text-muted hover:text-ink">
                  90H
                </button>
              </div>
              <div className="flex w-[260px] flex-col items-end gap-0.5 rounded-xl border border-border bg-card-alt px-4 py-2.5">
                <span className="text-[11px] font-medium text-muted">Capaian target 7 hari</span>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-[18px] font-bold text-teal-success">96%</span>
                  <span className="rounded-full bg-teal-success-bg px-2 py-0.5 text-[10px] font-bold text-teal-success">Rp 5,42jt / 5,60jt</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pb-1">
            <div className="flex items-center gap-2">
              <span className="inline-block h-[3px] w-6 rounded-full bg-teal-active" />
              <span className="text-[12px] font-medium text-muted">
                Aktual
                <span className="ml-2 font-semibold text-teal-success">+12% vs 7 hari lalu</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-[3px] w-6 rounded-full" style={{ borderStyle: "dashed", borderTopWidth: 3, borderColor: "#B8791E", opacity: 0.8 }} />
              <span className="text-[12px] font-medium text-muted">Target harian</span>
            </div>
          </div>

          <div className="relative w-full">
            <svg viewBox="0 0 720 260" className="h-[260px] w-full">
              <defs>
                <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2B6E41" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#2B6E41" stopOpacity="0" />
                </linearGradient>
              </defs>

              <g>
                <line x1="56" y1="49.71" x2="696" y2="49.71" stroke="#E6E2D3" strokeWidth="1" strokeDasharray="4 6" />
                <text x="48" y="49.71" textAnchor="end" dominantBaseline="middle" fill="#5B6A65" fontSize="10" fontFamily="Public Sans" fontWeight="500">1,2jt</text>

                <line x1="56" y1="101.14" x2="696" y2="101.14" stroke="#E6E2D3" strokeWidth="1" strokeDasharray="4 6" />
                <text x="48" y="101.14" textAnchor="end" dominantBaseline="middle" fill="#5B6A65" fontSize="10" fontFamily="Public Sans" fontWeight="500">800rb</text>

                <line x1="56" y1="152.57" x2="696" y2="152.57" stroke="#E6E2D3" strokeWidth="1" strokeDasharray="4 6" />
                <text x="48" y="152.57" textAnchor="end" dominantBaseline="middle" fill="#5B6A65" fontSize="10" fontFamily="Public Sans" fontWeight="500">400rb</text>

                <line x1="56" y1="204" x2="696" y2="204" stroke="#E6E2D3" strokeWidth="1" />
                <text x="48" y="204" textAnchor="end" dominantBaseline="middle" fill="#5B6A65" fontSize="10" fontFamily="Public Sans" fontWeight="500">0</text>
              </g>

              <path
                d="M 56 150 C 98.67 139.97, 119.99 118.88, 162.66 116.57 C 205.33 114.26, 226.66 143.83, 269.33 138.43 C 312 133.03, 333.33 95.74, 376 89.57 C 418.67 83.4, 439.99 116.57, 482.66 107.57 C 525.33 98.57, 546.66 49.07, 589.33 44.57 C 632 40.07, 653.33 72.92, 696 85.07 L 696 204 L 56 204 Z"
                fill="url(#chartFill)"
              />

              <path
                d="M 56 139.71 L 162.66 114 L 269.33 126.86 L 376 101.14 L 482.66 88.29 L 589.33 62.57 L 696 75.43"
                fill="none"
                stroke="#B8791E"
                strokeWidth="2"
                strokeDasharray="6 5"
                strokeLinecap="round"
                opacity="0.85"
              />

              <path
                d="M 56 150 C 98.67 139.97, 119.99 118.88, 162.66 116.57 C 205.33 114.26, 226.66 143.83, 269.33 138.43 C 312 133.03, 333.33 95.74, 376 89.57 C 418.67 83.4, 439.99 116.57, 482.66 107.57 C 525.33 98.57, 546.66 49.07, 589.33 44.57 C 632 40.07, 653.33 72.92, 696 85.07"
                fill="none"
                stroke="#1B4B49"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {[
                { x: 56, y: 150, v: "420rb" },
                { x: 162.66, y: 116.57, v: "680rb" },
                { x: 269.33, y: 138.43, v: "510rb" },
                { x: 376, y: 89.57, v: "890rb" },
                { x: 482.66, y: 107.57, v: "750rb" },
                { x: 589.33, y: 44.57, v: "1,24jt" },
                { x: 696, y: 85.07, v: "925rb" },
              ].map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill="#FFFFFF" stroke="#1B4B49" strokeWidth="2.2" />
                  <circle cx={p.x} cy={p.y} r="2.2" fill="#1B4B49" />
                  <text x={p.x} y={p.y - 12} textAnchor="middle" fill="#1E2A28" fontSize="10.5" fontFamily="Fraunces" fontWeight="700">{p.v}</text>
                </g>
              ))}

              {[
                { x: 56, t: "30 Agt" },
                { x: 162.66, t: "31 Agt" },
                { x: 269.33, t: "1 Sep" },
                { x: 376, t: "2 Sep" },
                { x: 482.66, t: "3 Sep" },
                { x: 589.33, t: "4 Sep" },
                { x: 696, t: "5 Sep" },
              ].map((p, i) => (
                <text key={i} x={p.x} y="236" textAnchor="middle" fill="#5B6A65" fontSize="11" fontFamily="Public Sans" fontWeight="500">{p.t}</text>
              ))}
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-4">
            {[
              { l: "Rata-rata / hari", v: "Rp 774rb", tone: "text-ink" },
              { l: "Penjualan tertinggi", v: "1,24jt · 4 Sep", tone: "text-teal-success" },
              { l: "Order terbesar", v: "240rb · Bu Siti", tone: "text-accent" },
              { l: "Hari ter-sepi", v: "420rb · 30 Agt", tone: "text-muted" },
            ].map((s) => (
              <div key={s.l} className="flex flex-col gap-0.5 rounded-xl border border-border bg-card-alt px-3 py-2.5">
                <span className="text-[11px] font-medium text-muted">{s.l}</span>
                <span className={`font-heading text-[14px] font-bold ${s.tone}`}>{s.v}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Row: AI/Manual ratio + Recent */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-success-bg text-teal-active">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="M4.93 4.93l1.41 1.41" />
                  <path d="M17.66 17.66l1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="M6.34 17.66l-1.41 1.41" />
                  <path d="M19.07 4.93l-1.41 1.41" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[12px] font-medium text-muted">30 hari terakhir</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-[20px] font-semibold text-ink">
                Sumber Input Data
              </h3>
              <p className="text-[13px] text-muted">
                Perbandingan entri via AI vs Manual.
              </p>
            </div>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Badge variant="ai">AI</Badge>
                  <span className="text-[14px] text-ink">Asisten AI otomatis</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-heading text-[18px] font-bold text-ink">72%</span>
                  <span className="text-[11px] text-muted">318 entri</span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-card-muted">
                <div
                  className="h-full rounded-full bg-teal-success"
                  style={{ width: "72%" }}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Badge variant="manual">Manual</Badge>
                  <span className="text-[14px] text-ink">Input tombol +</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-heading text-[18px] font-bold text-ink">28%</span>
                  <span className="text-[11px] text-muted">124 entri</span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-card-muted">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: "28%" }}
                />
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="font-heading text-[20px] font-semibold text-ink">
                  Order Terbaru
                </h3>
                <p className="text-[13px] text-muted">4 order terakhir masuk.</p>
              </div>
              <Link
                href="/data"
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-semibold text-accent hover:bg-accent-tag"
              >
                Lihat semua
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
              {recentOrders.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-card-alt transition-colors"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[14px] font-semibold text-ink">
                        {o.customer}
                      </span>
                      {o.tags.map((t) => (
                        <Badge key={t} variant={t as "ai" | "manual" | "source"}>
                          {t === "ai" ? "AI" : t === "manual" ? "MANUAL" : o.source}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-[12px] text-muted">{o.date}</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="font-heading text-[15px] font-bold text-ink">
                      {o.amount}
                    </span>
                    <span
                      className={`text-[12px] font-semibold ${
                        o.status === "Baru"
                          ? "text-teal-success"
                          : o.status === "Diproses"
                          ? "text-accent"
                          : "text-muted"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
