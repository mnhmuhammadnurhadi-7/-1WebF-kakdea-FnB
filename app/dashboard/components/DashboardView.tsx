"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AiCommandBox } from "./ai-command/AiCommandBox";
import { DashboardError } from "./state/DashboardError";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardSkeleton } from "./state/DashboardSkeleton";
import { longDate, shortDate } from "./shared/format";
import { KpiGrid } from "./kpi/KpiGrid";
import { RecentOrders } from "./orders/RecentOrders";
import { SAMPLE_ORDERS, SAMPLE_PP, SAMPLE_SALDO_KAS, TEST_TOKEN, sampleTrend } from "./shared/sampleData";
import { SalesTrendChart } from "./chart/SalesTrendChart";
import { SourceRatioCard } from "./chart/SourceRatioCard";
import { TestBanner } from "./state/TestBanner";
import { WelcomeHeader } from "./header/WelcomeHeader";
import type { PemasukanPengeluaran, PeriodeKey, RecentOrder, TrendPoint } from "./shared/types";

/** Logic (auth, fetch API, state) dari kode teman; tampilannya memakai komponen di atas. */
export function DashboardView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [summaryData, setSummaryData] = useState<any>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [salesTrend, setSalesTrend] = useState<TrendPoint[]>([]);
  const [periode, setPeriode] = useState<PeriodeKey>("7d");
  const [ppData, setPpData] = useState<PemasukanPengeluaran | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [incidentId, setIncidentId] = useState("INC-00000000-0000");
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    // Mode testing (hanya saat npm run dev): buka /dashboard?testing untuk melihat tampilan tanpa backend.
    if (process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).has("testing")) {
      localStorage.setItem("auth_token", TEST_TOKEN);
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (process.env.NODE_ENV !== "production" && token === TEST_TOKEN) {
      setTestMode(true);
      setSummaryData({ saldo_kas: SAMPLE_SALDO_KAS });
      setOrders(SAMPLE_ORDERS);
      setSalesTrend(sampleTrend("7d"));
      setPpData(SAMPLE_PP);
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const [summaryRes, ordersRes, , trendRes] = await Promise.all([
          api.dashboard.getSummary("7d"),
          api.orders.getAll(),
          api.products.getAll(),
          api.dashboard.getSalesTrend(periode),
        ]);

        if (summaryRes.success) setSummaryData(summaryRes.data);

        if (ordersRes.success) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const recent: RecentOrder[] = ordersRes.data.slice(0, 4).map((order: any) => ({
            id: order.id,
            title: order.detail || order.kode || "Order",
            date: new Date(order.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
            amount: Number(order.totalInvoice ?? order.nominal ?? 0),
            via: order.sumberInput === "AI" ? "AI" : "MANUAL",
            source: order.jenisOrder || order.sumberOrder || "-",
          }));
          setOrders(recent);
        }

        if (trendRes.success) setSalesTrend(trendRes.data);

        // Pemasukan vs pengeluaran
        try {
          const ppRes = await api.dashboard.getPemasukanPengeluaran(periode);
          if (ppRes.success) setPpData(ppRes.data);
        } catch {
          /* endpoint mungkin belum ada */
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        const d = new Date().toISOString().slice(0, 10).replaceAll("-", "");
        setIncidentId(`INC-${d}-${Math.floor(1000 + Math.random() * 9000)}`);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && testMode) {
      setSalesTrend(sampleTrend(periode));
      return;
    }
    if (!loading) {
      api.dashboard.getSalesTrend(periode).then((res) => {
        if (res.success) setSalesTrend(res.data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periode]);

  if (loading) return <AppLayout><DashboardSkeleton /></AppLayout>;

  if (loadError) {
    return (
      <AppLayout>
        <DashboardError incidentId={incidentId} onRetry={() => window.location.reload()} />
      </AppLayout>
    );
  }

  const period =
    salesTrend.length > 0
      ? `${shortDate(salesTrend[0].tanggal)} - ${longDate(salesTrend[salesTrend.length - 1].tanggal)}`
      : null;

  return (
    <AppLayout>
      {testMode && <TestBanner />}
      <div className="flex flex-col gap-6">
        <WelcomeHeader period={period} />
        <KpiGrid saldoKas={summaryData ? Number(summaryData.saldo_kas || 0) : null} pp={ppData} />
        <AiCommandBox />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <SalesTrendChart data={salesTrend} periode={periode} onPeriode={setPeriode} />
            <SourceRatioCard />
          </div>
          <RecentOrders orders={orders} />
        </div>
      </div>
    </AppLayout>
  );
}
