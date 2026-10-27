"use client";

import { useCallback, useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { DataHeader } from "./header/DataHeader";
import { DataTabs } from "./tabs/DataTabs";
import { EditJenisModal } from "./jenis/EditJenisModal";
import { ErrorBanner } from "./state/ErrorBanner";
import { JenisEntriesTable } from "./jenis/JenisEntriesTable";
import { MasterTransaksiFeed } from "./master/MasterTransaksiFeed";
import { TabelBebasTab } from "./bebas/TabelBebasTab";
import { TambahTransaksiModal } from "./tambah/TambahTransaksiModal";
import { errMsg } from "./shared/format";
import type { ChipOption, Jenis } from "./shared/types";
import { useTambahTransaksi } from "./tambah/useTambahTransaksi";

/** Logic (fetch jenis, tab aktif, refresh, export) dari kode teman; tampilannya memakai komponen di atas. */
export function DataView() {
  const [jenisList, setJenisList] = useState<Jenis[]>([]);
  const [activeTab, setActiveTab] = useState("master");
  const [loadingTabs, setLoadingTabs] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((k) => k + 1);

  const [editJenisTarget, setEditJenisTarget] = useState<Jenis | null>(null);

  const loadJenisList = useCallback(async () => {
    try {
      const res = await api.transactionTypes.getAll();
      if (res.success) {
        setJenisList(res.data);
        setLoadError(false);
      }
    } catch (e) {
      console.error(e);
      setLoadError(true);
    } finally {
      setLoadingTabs(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadJenisList();
  }, [loadJenisList]);

  const tabs: ChipOption[] = [
    { id: "master", label: "Master Transaksi" },
    ...jenisList.map((j) => ({ id: String(j.id), label: j.namaTransaksi })),
    { id: "tabel_bebas", label: "Tabel Bebas" },
  ];

  const selectedJenis = jenisList.find((j) => String(j.id) === activeTab) || null;

  // Modal Tambah Transaksi (shared, dipakai dari tab manapun)
  const tambah = useTambahTransaksi({ loadJenisList, refresh, setActiveTab });

  const handleExportTransactions = async (jenisId?: number) => {
    try {
      await api.reports.exportTransactions({ jenis_transaksi_id: jenisId });
    } catch (e) {
      alert(errMsg(e, "Export gagal"));
    }
  };

  return (
    <AppLayout>
      {loadError && (
        <div className="mb-6">
          <ErrorBanner title="Jenis transaksi belum berhasil dimuat" description="Periksa koneksi atau sesi masuk Anda. Data sebelumnya tetap aman." onRetry={loadJenisList} />
        </div>
      )}

      <div className="flex flex-col gap-6">
        <DataHeader
          showActions={activeTab !== "tabel_bebas"}
          hasSelectedJenis={!!selectedJenis}
          onEditTable={() => setEditJenisTarget(selectedJenis)}
          onExport={() => handleExportTransactions(selectedJenis?.id)}
          onAdd={() => tambah.openTambahTransaksi(selectedJenis?.id)}
        />

        <DataTabs loading={loadingTabs} tabs={tabs} value={activeTab} onChange={setActiveTab} />

        {activeTab === "master" ? (
          <MasterTransaksiFeed refreshKey={tick} onOpenJenis={(id) => setActiveTab(String(id))} />
        ) : activeTab === "tabel_bebas" ? (
          <TabelBebasTab />
        ) : selectedJenis ? (
          <JenisEntriesTable jenis={selectedJenis} refreshKey={tick} onChanged={refresh} />
        ) : null}
      </div>

      <TambahTransaksiModal ctrl={tambah} jenisList={jenisList} />

      {editJenisTarget && (
        <EditJenisModal
          key={editJenisTarget.id}
          jenis={editJenisTarget}
          onClose={() => setEditJenisTarget(null)}
          onSaved={() => { loadJenisList(); setEditJenisTarget(null); }}
          onDeleted={() => { loadJenisList(); setEditJenisTarget(null); setActiveTab("master"); }}
        />
      )}
    </AppLayout>
  );
}
