"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { api } from "@/lib/api";

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

function formatCurrency(amount: number) {
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1).replace(".0", "")}jt`;
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}rb`;
  }
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [salesTrend, setSalesTrend] = useState<{ tanggal: string; total: number }[]>([]);
  const [periode, setPeriode] = useState<"7d" | "30d">("7d");
  const [productCount, setProductCount] = useState<number | null>(null);
  const [ppData, setPpData] = useState<{ daily: any[]; totals: { pemasukan: number; pengeluaran: number; laba: number } } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchData() {
      try {
        const [summaryRes, ordersRes, productsRes, trendRes] = await Promise.all([
          api.dashboard.getSummary("7d"),
          api.orders.getAll(),
          api.products.getAll(),
          api.dashboard.getSalesTrend(periode),
        ]);

        if (summaryRes.success) setSummaryData(summaryRes.data);

        if (ordersRes.success) {
          const recent = ordersRes.data.slice(0, 4).map((order: any) => ({
            id: order.id,
            customer: order.detail || order.kode || "Order",
            source: order.jenisOrder || order.sumberOrder || "-",
            amount: `Rp ${Number(order.totalInvoice ?? order.nominal ?? 0).toLocaleString("id-ID")}`,
            date: new Date(order.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
            tags: [order.sumberInput === "AI" ? "ai" : "manual"],
          }));
          setOrders(recent);
        }

        if (productsRes.success) {
          setProductCount(productsRes.data.length);
        }

        if (trendRes.success) {
          setSalesTrend(trendRes.data);
        }

        // Fetch pemasukan vs pengeluaran
        try {
          const ppRes = await api.dashboard.getPemasukanPengeluaran(periode);
          if (ppRes.success) setPpData(ppRes.data);
        } catch { /* endpoint may not exist yet */ }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      api.dashboard.getSalesTrend(periode).then((res) => {
        if (res.success) setSalesTrend(res.data);
      });
    }
  }, [periode]);

  const trendStats = useMemo(() => {
    if (salesTrend.length === 0) return null;
    const totals = salesTrend.map((d) => d.total);
    const sum = totals.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / totals.length);
    const max = Math.max(...totals);
    const min = Math.min(...totals);
    const maxDay = salesTrend.find((d) => d.total === max);
    const minDay = salesTrend.find((d) => d.total === min);
    return { sum, avg, max, min, maxDay, minDay };
  }, [salesTrend]);

  const displayCards = summaryData
    ? [
        {
          label: "Total Pemasukan",
          value: ppData ? formatCurrency(ppData.totals.pemasukan) : "—",
          sub: "periode ini",
          change: ppData && ppData.totals.pemasukan > 0 ? `${ppData.daily.length} hari data` : "",
          changeTone: "success" as const,
          icon: TrendingUp,
          iconBg: "bg-teal-success-bg",
          iconColor: "text-teal-success",
        },
        {
          label: "Total Pengeluaran",
          value: ppData ? formatCurrency(ppData.totals.pengeluaran) : "—",
          sub: "periode ini",
          change: ppData && ppData.totals.pengeluaran > 0 ? `${ppData.daily.length} hari data` : "",
          changeTone: "danger" as const,
          icon: CartIcon,
          iconBg: "bg-danger-bg",
          iconColor: "text-danger",
        },
        {
          label: "Saldo Kas",
          value: formatCurrency(summaryData.saldo_kas || 0),
          sub: "kas utama",
          change: "update real-time",
          changeTone: "neutral" as const,
          icon: WalletIcon,
          iconBg: "bg-yellow-tag-bg",
          iconColor: "text-yellow-tag-ink",
        },
        {
          label: "Laba / Rugi",
          value: ppData ? formatCurrency(Math.abs(ppData.totals.laba)) : "—",
          sub: ppData ? (ppData.totals.laba >= 0 ? "laba bersih" : "rugi bersih") : "periode ini",
          change: ppData ? (ppData.totals.laba >= 0 ? "positif" : "negatif") : "",
          changeTone: ppData ? (ppData.totals.laba >= 0 ? ("success" as const) : ("danger" as const)) : ("neutral" as const),
          icon: WalletIcon,
          iconBg: ppData && ppData.totals.laba >= 0 ? "bg-teal-success-bg" : "bg-danger-bg",
          iconColor: ppData && ppData.totals.laba >= 0 ? "text-teal-success" : "text-danger",
        },
      ]
    : null;

  if (loading) {
    return (
      <AppLayout activeMenu="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted">Loading dashboard data...</div>
        </div>
      </AppLayout>
    );
  }

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
        {displayCards ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {displayCards.map((c) => (
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
                {c.change && (
                  <div
                    className={`text-[12px] font-semibold ${
                      c.changeTone === "success" ? "text-teal-success" : "text-muted"
                    }`}
                  >
                    {c.change}
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="flex flex-col gap-4 animate-pulse">
                <div className="h-8 w-8 rounded-lg bg-card-muted" />
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-20 rounded bg-card-muted" />
                  <div className="h-6 w-24 rounded bg-card-muted" />
                  <div className="h-3 w-28 rounded bg-card-muted" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Sales Trend Chart */}
        <Card className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-[20px] font-semibold text-ink">
                Tren Penjualan {periode === "7d" ? "7 Hari" : "30 Hari"} Terakhir
              </h3>
              <p className="text-[13px] text-muted">
                Total penjualan per hari dari data order aktual.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-lg bg-card-muted p-1">
              <button
                type="button"
                onClick={() => setPeriode("7d")}
                className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  periode === "7d"
                    ? "bg-card text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                7H
              </button>
              <button
                type="button"
                onClick={() => setPeriode("30d")}
                className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  periode === "30d"
                    ? "bg-card text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                30H
              </button>
            </div>
          </div>

          {salesTrend.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-muted">Belum ada data penjualan untuk periode ini</div>
            </div>
          ) : (
            <>
              {/* Bar Chart */}
              <div className="relative w-full overflow-x-auto">
                <svg
                  viewBox={`0 0 ${Math.max(salesTrend.length * 60, 360)} 260`}
                  className="h-[260px] w-full"
                  preserveAspectRatio="xMinYMid meet"
                >
                  {(() => {
                    const maxVal = Math.max(...salesTrend.map((d) => d.total), 1);
                    const chartLeft = 56;
                    const chartRight = salesTrend.length * 60;
                    const chartTop = 20;
                    const chartBottom = 220;
                    const chartHeight = chartBottom - chartTop;
                    const barWidth = 28;
                    const gap = (chartRight - chartLeft) / salesTrend.length;

                    const yTicks = 4;
                    const yLines = Array.from({ length: yTicks + 1 }, (_, i) => {
                      const val = (maxVal / yTicks) * i;
                      const y = chartBottom - (val / maxVal) * chartHeight;
                      return { val, y };
                    });

                    return (
                      <>
                        {/* Y-axis grid lines + labels */}
                        {yLines.map((tick, i) => (
                          <g key={i}>
                            <line
                              x1={chartLeft}
                              y1={tick.y}
                              x2={chartRight}
                              y2={tick.y}
                              stroke="#E6E2D3"
                              strokeWidth="1"
                              strokeDasharray={i === 0 ? undefined : "4 6"}
                            />
                            <text
                              x={chartLeft - 8}
                              y={tick.y}
                              textAnchor="end"
                              dominantBaseline="middle"
                              fill="#5B6A65"
                              fontSize="10"
                              fontFamily="Public Sans"
                              fontWeight="500"
                            >
                              {formatCurrency(tick.val)}
                            </text>
                          </g>
                        ))}

                        {/* Bars + value labels + x-axis labels */}
                        {salesTrend.map((d, i) => {
                          const x = chartLeft + i * gap + gap / 2;
                          const barH = (d.total / maxVal) * chartHeight;
                          const barY = chartBottom - barH;
                          return (
                            <g key={i}>
                              <rect
                                x={x - barWidth / 2}
                                y={barY}
                                width={barWidth}
                                height={barH}
                                rx="4"
                                fill="#1B4B49"
                                opacity="0.85"
                              />
                              <text
                                x={x}
                                y={barY - 8}
                                textAnchor="middle"
                                fill="#1E2A28"
                                fontSize="10"
                                fontFamily="Fraunces"
                                fontWeight="700"
                              >
                                {formatCurrency(d.total)}
                              </text>
                              <text
                                x={x}
                                y={chartBottom + 16}
                                textAnchor="middle"
                                fill="#5B6A65"
                                fontSize="10"
                                fontFamily="Public Sans"
                                fontWeight="500"
                              >
                                {formatDateLabel(d.tanggal)}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Stats row */}
              {trendStats && (
                <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-4">
                  <div className="flex flex-col gap-0.5 rounded-xl border border-border bg-card-alt px-3 py-2.5">
                    <span className="text-[11px] font-medium text-muted">Total periode ini</span>
                    <span className="font-heading text-[14px] font-bold text-ink">{formatCurrency(trendStats.sum)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 rounded-xl border border-border bg-card-alt px-3 py-2.5">
                    <span className="text-[11px] font-medium text-muted">Rata-rata / hari</span>
                    <span className="font-heading text-[14px] font-bold text-ink">{formatCurrency(trendStats.avg)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 rounded-xl border border-border bg-card-alt px-3 py-2.5">
                    <span className="text-[11px] font-medium text-muted">Hari tertinggi</span>
                    <span className="font-heading text-[14px] font-bold text-teal-success">
                      {formatCurrency(trendStats.max)} · {trendStats.maxDay ? formatDateLabel(trendStats.maxDay.tanggal) : ""}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 rounded-xl border border-border bg-card-alt px-3 py-2.5">
                    <span className="text-[11px] font-medium text-muted">Hari terendah</span>
                    <span className="font-heading text-[14px] font-bold text-muted">
                      {formatCurrency(trendStats.min)} · {trendStats.minDay ? formatDateLabel(trendStats.minDay.tanggal) : ""}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
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
                <p className="text-[13px] text-muted">
                  {orders.length > 0 ? `${orders.length} order terakhir masuk.` : "Belum ada order."}
                </p>
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
            {orders.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-[13px] text-muted">
                Belum ada data order dari backend.
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-card-alt transition-colors"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[14px] font-semibold text-ink">
                          {o.customer}
                        </span>
                        {o.tags.map((t: string) => (
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
                      <span className="text-[12px] font-semibold text-teal-success">
                        {o.source}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
