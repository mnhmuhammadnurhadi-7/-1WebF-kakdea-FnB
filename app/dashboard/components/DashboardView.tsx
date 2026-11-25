"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AiCommandBox } from "./AiCommandBox";
import { DashboardError } from "./DashboardError";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { KpiGrid } from "./KpiGrid";
import { CashflowChart } from "./CashflowChart";
import { SourceRatioCard } from "./SourceRatioCard";
import { WelcomeHeader } from "./WelcomeHeader";
import type { CashflowPoint, InputSourceStats, PemasukanPengeluaran, PeriodeKey } from "./types";

/** Logic (auth, fetch API, state) dari kode teman; tampilannya memakai komponen di atas. */
export function DashboardView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [summaryData, setSummaryData] = useState<any>(null);
  const [cashflow, setCashflow] = useState<CashflowPoint[]>([]);
  const [inputSources, setInputSources] = useState<InputSourceStats | null>(null);
  const [periode, setPeriode] = useState<PeriodeKey>("mingguan");
  const [ppData, setPpData] = useState<PemasukanPengeluaran | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [incidentId, setIncidentId] = useState("INC-00000000-0000");
  const [ownerName, setOwnerName] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
  });

  useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      router.push("/login");
      return;
    }

    async function fetchData() {
      try {
        const dashboardPeriod = periode === "bulanan" ? "30d" : periode === "semua" ? "semua" : "7d";
        const [profileRes, summaryRes, trendRes, sourcesRes] = await Promise.all([
          api.auth.getMe(),
          api.dashboard.getSummary(dashboardPeriod, selectedDate),
          api.dashboard.getCashflowTrend(periode, selectedDate),
          api.dashboard.getInputSources(dashboardPeriod, selectedDate),
        ]);

        if (profileRes.success) {
          setOwnerName(profileRes.data?.nama || "");
        }

        if (summaryRes.success) setSummaryData(summaryRes.data);

        if (trendRes.success) setCashflow(trendRes.data);
        if (sourcesRes.success) setInputSources(sourcesRes.data);

        // Pemasukan vs pengeluaran
        try {
          const ppRes = await api.dashboard.getPemasukanPengeluaran(dashboardPeriod, selectedDate);
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
  }, [router, periode, selectedDate]);

  if (loading) return <><DashboardSkeleton /></>;

  if (loadError) {
    return (
      <>
        <DashboardError incidentId={incidentId} onRetry={() => window.location.reload()} />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <WelcomeHeader ownerName={ownerName} selectedDate={selectedDate} onSelectedDateChange={setSelectedDate} />
        <KpiGrid saldoKas={summaryData ? Number(summaryData.saldo_kas || 0) : null} pp={ppData} />
        <AiCommandBox />
        <div className="flex min-w-0 flex-col gap-5">
          <CashflowChart data={cashflow} periode={periode} onPeriode={setPeriode} />
          <SourceRatioCard data={inputSources} />
        </div>
      </div>
    </>
  );
}
