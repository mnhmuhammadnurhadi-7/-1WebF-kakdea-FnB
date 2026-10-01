"use client";

import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChipSelector, type ChipOption } from "@/components/ui/ChipSelector";
import { InputField } from "@/components/ui/InputField";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/lib/api";

const PlusIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3.33v9.34M3.33 8h9.34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const PencilIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M11.3 2.3a1.5 1.5 0 0 1 2.1 2.1L5.8 12l-3 .7.7-3 7.8-7.4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);
const TrashIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5 5 13a1 1 0 0 0 1 .9h4a1 1 0 0 0 1-.9l.5-8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SearchIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="m13 13-2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const DownloadIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2v8m0 0-3-3m3 3 3-3M3 13.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TIPE_DATA_OPTIONS = [
  { value: "TEKS", label: "Teks" },
  { value: "ANGKA", label: "Angka" },
  { value: "TANGGAL", label: "Tanggal" },
  { value: "DROPDOWN", label: "Dropdown" },
];

const ARAH_OPTIONS = [
  { value: "PEMASUKAN", label: "Pemasukan" },
  { value: "PENGELUARAN", label: "Pengeluaran" },
  { value: "PENDATAAN", label: "Pendataan biasa" },
];

function formatRupiah(n: any) {
  const num = Number(n || 0);
  return `Rp ${num.toLocaleString("id-ID")}`;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function fmtTanggal(d: any) {
  return d ? new Date(d).toLocaleDateString("id-ID") : "-";
}

// Field dinamis satu kolom custom - dipakai form Tambah Transaksi & baris Tabel Bebas
function DynamicColumnField({
  kolom,
  value,
  onChange,
}: {
  kolom: { id: number; namaKolom: string; tipeData: string; opsiDropdown?: string[] | null };
  value: string;
  onChange: (v: string) => void;
}) {
  const type =
    kolom.tipeData === "ANGKA" ? "number" : kolom.tipeData === "TANGGAL" ? "date" : kolom.tipeData === "DROPDOWN" ? "select" : "text";
  return (
    <InputField
      label={kolom.namaKolom}
      type={type as any}
      value={value}
      onChange={onChange}
      options={kolom.tipeData === "DROPDOWN" ? (kolom.opsiDropdown || []).map((o: string) => ({ value: o, label: o })) : undefined}
    />
  );
}

// Builder kolom custom dipakai bareng di "Buat Jenis Baru" & "Buat Tabel Bebas"
function ColumnBuilder({
  columns,
  onChange,
}: {
  columns: Array<{ namaKolom: string; tipeData: string; opsiDropdown: string }>;
  onChange: (cols: Array<{ namaKolom: string; tipeData: string; opsiDropdown: string }>) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] font-semibold text-muted uppercase tracking-wide">Kolom Tabel (opsional)</span>
      {columns.map((c, idx) => (
        <div key={idx} className="flex flex-col gap-2 rounded-[10px] border border-border p-3">
          <div className="flex gap-2">
            <InputField
              label="Nama Kolom"
              className="flex-1"
              value={c.namaKolom}
              onChange={(v) => onChange(columns.map((col, i) => (i === idx ? { ...col, namaKolom: v } : col)))}
            />
            <InputField
              label="Tipe"
              type="select"
              className="w-[140px]"
              value={c.tipeData}
              onChange={(v) => onChange(columns.map((col, i) => (i === idx ? { ...col, tipeData: v } : col)))}
              options={TIPE_DATA_OPTIONS}
            />
          </div>
          {c.tipeData === "DROPDOWN" && (
            <InputField
              label="Opsi Dropdown (pisah koma)"
              value={c.opsiDropdown}
              onChange={(v) => onChange(columns.map((col, i) => (i === idx ? { ...col, opsiDropdown: v } : col)))}
            />
          )}
          {columns.length > 1 && (
            <button className="self-end text-[12px] font-semibold text-danger" onClick={() => onChange(columns.filter((_, i) => i !== idx))}>
              Hapus kolom ini
            </button>
          )}
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...columns, { namaKolom: "", tipeData: "TEKS", opsiDropdown: "" }])}>
        + Tambah Kolom
      </Button>
    </div>
  );
}

export default function DataPage() {
  const [jenisList, setJenisList] = useState<any[]>([]);
  const [accountSuggestions, setAccountSuggestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("master");
  const [loadingTabs, setLoadingTabs] = useState(true);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((k) => k + 1);

  const [editJenisTarget, setEditJenisTarget] = useState<any | null>(null);

  const loadJenisList = useCallback(async () => {
    try {
      const res = await api.transactionTypes.getAll();
      if (res.success) setJenisList(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTabs(false);
    }
  }, []);

  useEffect(() => {
    loadJenisList();
    api.accounts.getAll().then((res: any) => { if (res.success) setAccountSuggestions(res.data); }).catch(() => {});
  }, [loadJenisList]);

  const tabs: ChipOption[] = [
    { id: "master", label: "Master Transaksi" },
    ...jenisList.map((j) => ({ id: String(j.id), label: j.namaTransaksi })),
    { id: "tabel_bebas", label: "Tabel Bebas" },
  ];

  const selectedJenis = jenisList.find((j) => String(j.id) === activeTab) || null;

  // ---- Tambah Transaksi modal (shared, dipakai dari tab manapun) ----
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txForm, setTxForm] = useState<any>({ tanggal: todayStr(), detail: "", jenisTransaksiId: "", nominal: "", debit: "", kredit: "" });
  const [txCustomValues, setTxCustomValues] = useState<Record<string, string>>({});
  const [txColumns, setTxColumns] = useState<any[]>([]);
  const [txError, setTxError] = useState("");
  const [savingTx, setSavingTx] = useState(false);

  const [creatingNewJenis, setCreatingNewJenis] = useState(false);
  const [newJenisForm, setNewJenisForm] = useState({ namaTabel: "", jenisAkun: "", arah: "" });
  const [newJenisColumns, setNewJenisColumns] = useState([{ namaKolom: "", tipeData: "TEKS", opsiDropdown: "" }]);
  const [newJenisError, setNewJenisError] = useState("");
  const [savingNewJenis, setSavingNewJenis] = useState(false);

  const openTambahTransaksi = async (presetJenisId?: number) => {
    setTxForm({ tanggal: todayStr(), detail: "", jenisTransaksiId: presetJenisId ? String(presetJenisId) : "", nominal: "", debit: "", kredit: "" });
    setTxCustomValues({});
    setTxError("");
    setCreatingNewJenis(false);
    setNewJenisForm({ namaTabel: "", jenisAkun: "", arah: "" });
    setNewJenisColumns([{ namaKolom: "", tipeData: "TEKS", opsiDropdown: "" }]);
    setNewJenisError("");
    if (presetJenisId) {
      try {
        const res = await api.transactionTypes.getColumns(presetJenisId);
        if (res.success) setTxColumns(res.data);
      } catch { setTxColumns([]); }
    } else {
      setTxColumns([]);
    }
    setTxModalOpen(true);
  };

  const onJenisPicked = async (val: string) => {
    if (val === "__new__") {
      setCreatingNewJenis(true);
      return;
    }
    setTxForm((f: any) => ({ ...f, jenisTransaksiId: val }));
    setTxCustomValues({});
    if (val) {
      try {
        const res = await api.transactionTypes.getColumns(parseInt(val));
        if (res.success) setTxColumns(res.data);
      } catch { setTxColumns([]); }
    } else {
      setTxColumns([]);
    }
  };

  const submitNewJenis = async () => {
    if (!newJenisForm.namaTabel.trim() || !newJenisForm.arah) {
      setNewJenisError("Nama tabel dan penanda (Pemasukan/Pengeluaran/Pendataan) wajib diisi.");
      return;
    }
    const validCols = newJenisColumns.filter((c) => c.namaKolom.trim());
    for (const c of validCols) {
      if (c.tipeData === "DROPDOWN" && !c.opsiDropdown.trim()) {
        setNewJenisError(`Kolom "${c.namaKolom}" bertipe Dropdown wajib punya opsi.`);
        return;
      }
    }
    setSavingNewJenis(true);
    setNewJenisError("");
    try {
      if (newJenisForm.arah === "PENDATAAN") {
        await api.freeTables.create({
          nama_tabel: newJenisForm.namaTabel,
          kolom: validCols.map((c) => ({
            nama_kolom: c.namaKolom,
            tipe_data: c.tipeData,
            opsi_dropdown: c.tipeData === "DROPDOWN" ? c.opsiDropdown.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
          })),
        });
        setTxModalOpen(false);
        setActiveTab("tabel_bebas");
      } else {
        const kodeAuto = newJenisForm.namaTabel.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "JT";
        const jenisRes: any = await api.transactionTypes.create({
          kode: `${kodeAuto}${Date.now().toString().slice(-4)}`,
          nama_transaksi: newJenisForm.namaTabel,
          arah: newJenisForm.arah,
          jenis_akun: newJenisForm.jenisAkun || undefined,
        });
        const newJenis = jenisRes.data;
        for (const c of validCols) {
          await api.transactionTypes.createColumn(newJenis.id, {
            nama_kolom: c.namaKolom,
            tipe_data: c.tipeData,
            opsi_dropdown: c.tipeData === "DROPDOWN" ? c.opsiDropdown.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
          });
        }
        await loadJenisList();
        setCreatingNewJenis(false);
        setTxForm((f: any) => ({ ...f, jenisTransaksiId: String(newJenis.id) }));
        const colsRes = await api.transactionTypes.getColumns(newJenis.id);
        if (colsRes.success) setTxColumns(colsRes.data);
      }
    } catch (e: any) {
      setNewJenisError(e.message || "Gagal membuat jenis/tabel baru.");
    } finally {
      setSavingNewJenis(false);
    }
  };

  const submitTransaksi = async () => {
    if (!txForm.tanggal || !txForm.jenisTransaksiId || !txForm.nominal || Number(txForm.nominal) <= 0) {
      setTxError("Tanggal, Jenis Transaksi, dan Nominal wajib diisi (nominal harus > 0).");
      return;
    }
    setSavingTx(true);
    setTxError("");
    try {
      await api.transactions.create({
        tanggal: txForm.tanggal,
        jenis_transaksi_id: parseInt(txForm.jenisTransaksiId),
        detail: txForm.detail,
        nominal: Number(txForm.nominal),
        debit: txForm.debit || undefined,
        kredit: txForm.kredit || undefined,
        custom_data: txCustomValues,
      });
      setTxModalOpen(false);
      refresh();
    } catch (e: any) {
      setTxError(e.message || "Gagal menyimpan transaksi.");
    } finally {
      setSavingTx(false);
    }
  };

  return (
    <AppLayout activeMenu="data">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="font-heading text-[28px] font-semibold text-ink leading-tight">Data</h1>
              <p className="text-[14px] text-muted">Semua catatan keuangan dan operasional usaha.</p>
            </div>
            {activeTab !== "tabel_bebas" && (
              <div className="flex items-center gap-2">
                {selectedJenis && (
                  <Button variant="outline" size="md" onClick={() => setEditJenisTarget(selectedJenis)}>Edit Table</Button>
                )}
                <Button variant="secondary" size="md" leftIcon={DownloadIcon}>Export ke Excel</Button>
                <Button variant="primary" size="md" leftIcon={PlusIcon} onClick={() => openTambahTransaksi(selectedJenis?.id)}>
                  Tambah Transaksi
                </Button>
              </div>
            )}
          </div>

          {activeTab !== "tabel_bebas" && (
            <div className="flex items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2.5 text-muted max-w-[420px]">
              {SearchIcon}
              <input type="text" placeholder="Cari transaksi..." className="w-full bg-transparent text-[14px] text-ink placeholder:text-muted-light focus:outline-none" />
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-b border-border pb-1">
            {loadingTabs ? (
              <span className="text-[13px] text-muted px-2 py-1">Memuat tab...</span>
            ) : (
              <ChipSelector options={tabs} value={activeTab} onChange={setActiveTab} />
            )}
          </div>
        </div>

        {activeTab === "master" ? (
          <MasterTransaksiFeed refreshKey={tick} onOpenJenis={(id) => setActiveTab(String(id))} />
        ) : activeTab === "tabel_bebas" ? (
          <TabelBebasTab />
        ) : selectedJenis ? (
          <JenisEntriesTable jenis={selectedJenis} refreshKey={tick} onChanged={refresh} />
        ) : null}
      </div>

      <Modal
        open={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        title={creatingNewJenis ? "Buat Jenis / Tabel Baru" : "Tambah Transaksi Baru"}
        subtitle={creatingNewJenis ? undefined : "Isi tanggal, lalu tentukan jenisnya - kalau belum ada, bikin baru sekalian."}
        width={480}
        footer={
          creatingNewJenis ? (
            <>
              <Button variant="outline" size="md" onClick={() => setCreatingNewJenis(false)}>Batal</Button>
              <Button variant="primary" size="md" onClick={submitNewJenis} disabled={savingNewJenis}>
                {savingNewJenis ? "Menyimpan..." : "Tambahkan"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="md" onClick={() => setTxModalOpen(false)}>Batal</Button>
              <Button variant="primary" size="md" onClick={submitTransaksi} disabled={savingTx || !txForm.jenisTransaksiId}>
                {savingTx ? "Menyimpan..." : "Simpan"}
              </Button>
            </>
          )
        }
      >
        {creatingNewJenis ? (
          <div className="flex flex-col gap-4">
            <InputField label="Nama Tabel" placeholder="Contoh: Biaya Tak Langsung" value={newJenisForm.namaTabel} onChange={(v) => setNewJenisForm((f) => ({ ...f, namaTabel: v }))} required />
            <InputField
              label="Jenis Akun"
              placeholder="Contoh: Kas Utama (boleh ketik bebas)"
              value={newJenisForm.jenisAkun}
              onChange={(v) => setNewJenisForm((f) => ({ ...f, jenisAkun: v }))}
              helper={accountSuggestions.length ? `Saran: ${accountSuggestions.slice(0, 4).map((a: any) => a.namaAkun).join(", ")}...` : undefined}
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold text-muted">Penanda <span className="text-danger">*</span></span>
              <div className="flex gap-2">
                {ARAH_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setNewJenisForm((f) => ({ ...f, arah: o.value }))}
                    className={`flex-1 rounded-[10px] border px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                      newJenisForm.arah === o.value ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:text-ink"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted">Pemasukan/Pengeluaran masuk Master Transaksi. Pendataan cuma tersimpan biasa (tanpa nominal/debit/kredit).</p>
            </div>
            <div className="w-full h-px bg-border" />
            <ColumnBuilder columns={newJenisColumns} onChange={setNewJenisColumns} />
            {newJenisError && <p className="text-[12px] font-medium text-danger">{newJenisError}</p>}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <InputField label="Tanggal" type="date" required value={txForm.tanggal} onChange={(v) => setTxForm((f: any) => ({ ...f, tanggal: v }))} />
            <InputField label="Keterangan" placeholder="Contoh: Beli bahan spuit 5kg - Supplier Jaya" value={txForm.detail} onChange={(v) => setTxForm((f: any) => ({ ...f, detail: v }))} />
            <InputField
              label="Jenis Transaksi"
              type="select"
              required
              value={txForm.jenisTransaksiId}
              onChange={onJenisPicked}
              options={[
                ...jenisList.map((j) => ({ value: String(j.id), label: j.namaTransaksi })),
                { value: "__new__", label: "+ Tambahkan Jenis Transaksi Baru" },
              ]}
            />
            <InputField label="Nominal (Rp)" type="number" required value={txForm.nominal} onChange={(v) => setTxForm((f: any) => ({ ...f, nominal: v }))} />
            <div className="flex gap-3">
              <InputField label="Debit" className="flex-1" placeholder="Opsional" value={txForm.debit} onChange={(v) => setTxForm((f: any) => ({ ...f, debit: v }))} />
              <InputField label="Kredit" className="flex-1" placeholder="Opsional" value={txForm.kredit} onChange={(v) => setTxForm((f: any) => ({ ...f, kredit: v }))} />
            </div>
            {txColumns.map((c) => (
              <DynamicColumnField
                key={c.id}
                kolom={c}
                value={txCustomValues[String(c.id)] || ""}
                onChange={(v) => setTxCustomValues((prev) => ({ ...prev, [String(c.id)]: v }))}
              />
            ))}
            {txError && <p className="text-[12px] font-medium text-danger">{txError}</p>}
          </div>
        )}
      </Modal>

      <EditJenisModal
        jenis={editJenisTarget}
        onClose={() => setEditJenisTarget(null)}
        onSaved={() => { loadJenisList(); setEditJenisTarget(null); }}
        onDeleted={() => { loadJenisList(); setEditJenisTarget(null); setActiveTab("master"); }}
      />
    </AppLayout>
  );
}

// ============================================================
// MASTER TRANSAKSI — feed gabungan semua entri, kolom default saja
// ============================================================
function MasterTransaksiFeed({ refreshKey, onOpenJenis }: { refreshKey: number; onOpenJenis: (jenisId: number) => void }) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.transactions.getAll().then((res: any) => {
      if (res.success) setEntries(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <Card className="p-0 overflow-x-auto">
      <table className="w-full text-[13px] border-collapse border-spacing-0">
        <thead className="bg-card-alt text-muted">
          <tr>
            <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Tanggal</th>
            <th className="text-left px-5 py-3 font-semibold">Keterangan</th>
            <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Jenis Transaksi</th>
            <th className="text-right px-5 py-3 font-semibold whitespace-nowrap">Nominal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            <tr><td colSpan={4} className="px-5 py-8 text-center text-muted">Memuat...</td></tr>
          ) : entries.length === 0 ? (
            <tr><td colSpan={4} className="px-5 py-8 text-center text-muted">Belum ada transaksi. Tambah lewat tombol "Tambah Transaksi" di atas.</td></tr>
          ) : (
            entries.map((e) => (
              <tr key={e.id} className="hover:bg-card-alt/40 cursor-pointer" onClick={() => onOpenJenis(e.jenisTransaksiId)}>
                <td className="px-5 py-3 whitespace-nowrap">{fmtTanggal(e.tanggal)}</td>
                <td className="px-5 py-3">{e.detail || "-"}</td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <Badge variant={e.jenisTransaksi?.arah === "PEMASUKAN" ? "success" : "danger"}>{e.namaTransaksi}</Badge>
                </td>
                <td className="px-5 py-3 text-right font-semibold whitespace-nowrap">{formatRupiah(e.nominal)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}

// ============================================================
// Tabel entri per jenis — kolom lengkap + custom
// ============================================================
function JenisEntriesTable({ jenis, refreshKey, onChanged }: { jenis: any; refreshKey: number; onChanged: () => void }) {
  const [entries, setEntries] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [entriesRes, columnsRes] = await Promise.all([
        api.transactions.getAll({ jenis_transaksi_id: jenis.id }),
        api.transactionTypes.getColumns(jenis.id),
      ]);
      if (entriesRes.success) setEntries(entriesRes.data);
      if (columnsRes.success) setColumns(columnsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [jenis.id]);

  useEffect(() => { load(); }, [load, refreshKey]);

  const deleteEntry = async (entry: any) => {
    if (!confirm(`Hapus entri "${entry.kode}"?`)) return;
    try {
      await api.transactions.delete(entry.id);
      load();
      onChanged();
    } catch (e: any) {
      alert(e.message || "Gagal menghapus entri.");
    }
  };

  return (
    <Card className="p-0 overflow-x-auto">
      <table className="w-full text-[13px] border-collapse border-spacing-0">
        <thead className="bg-card-alt text-muted">
          <tr>
            <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Tanggal</th>
            <th className="text-left px-5 py-3 font-semibold">Keterangan</th>
            <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Jenis Transaksi</th>
            <th className="text-right px-5 py-3 font-semibold whitespace-nowrap">Nominal</th>
            <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Debit</th>
            <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Kredit</th>
            {columns.map((c) => (
              <th key={c.id} className="text-left px-5 py-3 font-semibold whitespace-nowrap">{c.namaKolom}</th>
            ))}
            <th className="text-right px-5 py-3 font-semibold w-[50px]">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            <tr><td colSpan={7 + columns.length} className="px-5 py-8 text-center text-muted">Memuat...</td></tr>
          ) : entries.length === 0 ? (
            <tr><td colSpan={7 + columns.length} className="px-5 py-8 text-center text-muted">Belum ada entri untuk jenis ini. Tambah lewat tombol "Tambah Transaksi" di atas.</td></tr>
          ) : (
            entries.map((e) => (
              <tr key={e.id} className="hover:bg-card-alt/40">
                <td className="px-5 py-3 whitespace-nowrap">{fmtTanggal(e.tanggal)}</td>
                <td className="px-5 py-3">{e.detail || "-"}</td>
                <td className="px-5 py-3 whitespace-nowrap">{e.namaTransaksi}</td>
                <td className="px-5 py-3 text-right font-semibold whitespace-nowrap">{formatRupiah(e.nominal)}</td>
                <td className="px-5 py-3 whitespace-nowrap">{e.debit || "-"}</td>
                <td className="px-5 py-3 whitespace-nowrap">{e.kredit || "-"}</td>
                {columns.map((c) => (
                  <td key={c.id} className="px-5 py-3 whitespace-nowrap">{e.customData?.[String(c.id)] ?? "-"}</td>
                ))}
                <td className="px-5 py-3">
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-danger-bg hover:text-danger" onClick={() => deleteEntry(e)}>
                    {TrashIcon}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}

// ============================================================
// Modal Edit Table — edit definisi jenis (kode/nama/arah/jenisAkun) + Hapus Table
// ============================================================
function EditJenisModal({ jenis, onClose, onSaved, onDeleted }: { jenis: any | null; onClose: () => void; onSaved: () => void; onDeleted: () => void }) {
  const [form, setForm] = useState({ namaTransaksi: "", arah: "PEMASUKAN", jenisAkun: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (jenis) {
      setForm({ namaTransaksi: jenis.namaTransaksi || "", arah: jenis.arah || "PEMASUKAN", jenisAkun: jenis.jenisAkun || "" });
      setError("");
    }
  }, [jenis]);

  if (!jenis) return null;

  const submit = async () => {
    if (!form.namaTransaksi.trim()) {
      setError("Nama transaksi wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.transactionTypes.update(jenis.id, {
        nama_transaksi: form.namaTransaksi,
        arah: form.arah,
        jenis_akun: form.jenisAkun || null,
      });
      onSaved();
    } catch (e: any) {
      setError(e.message || "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const hapus = async () => {
    if (!confirm(`Hapus jenis transaksi "${jenis.namaTransaksi}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeleting(true);
    setError("");
    try {
      await api.transactionTypes.delete(jenis.id);
      onDeleted();
    } catch (e: any) {
      setError(e.message || "Gagal menghapus - kemungkinan masih ada entri di jenis ini.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      open={!!jenis}
      onClose={onClose}
      title="Edit Table"
      subtitle={`Kode: ${jenis.kode}`}
      width={420}
      footer={
        <>
          <Button variant="outline" size="md" onClick={hapus} disabled={deleting || saving} className="!text-danger !border-danger hover:!bg-danger-bg">
            {deleting ? "Menghapus..." : "Hapus Table"}
          </Button>
          <Button variant="primary" size="md" onClick={submit} disabled={saving || deleting}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <InputField label="Nama Transaksi" value={form.namaTransaksi} onChange={(v) => setForm((f) => ({ ...f, namaTransaksi: v }))} required />
        <InputField
          label="Arah"
          type="select"
          value={form.arah}
          onChange={(v) => setForm((f) => ({ ...f, arah: v }))}
          options={[{ value: "PEMASUKAN", label: "Pemasukan" }, { value: "PENGELUARAN", label: "Pengeluaran" }]}
        />
        <InputField label="Jenis Akun (saran, opsional)" value={form.jenisAkun} onChange={(v) => setForm((f) => ({ ...f, jenisAkun: v }))} />
        {error && <p className="text-[12px] font-medium text-danger">{error}</p>}
      </div>
    </Modal>
  );
}

// ============================================================
// TABEL BEBAS — pendataan generik, terpisah total dari Master Transaksi
// ============================================================
function TabelBebasTab() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [namaTabel, setNamaTabel] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [newColumns, setNewColumns] = useState<Array<{ namaKolom: string; tipeData: string; opsiDropdown: string }>>([
    { namaKolom: "", tipeData: "TEKS", opsiDropdown: "" },
  ]);
  const [createError, setCreateError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.freeTables.getAll();
      if (res.success) setTables(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setNamaTabel("");
    setDeskripsi("");
    setNewColumns([{ namaKolom: "", tipeData: "TEKS", opsiDropdown: "" }]);
    setCreateError("");
    setCreateModalOpen(true);
  };

  const submitCreate = async () => {
    if (!namaTabel.trim()) {
      setCreateError("Nama tabel wajib diisi.");
      return;
    }
    const validCols = newColumns.filter((c) => c.namaKolom.trim());
    for (const c of validCols) {
      if (c.tipeData === "DROPDOWN" && !c.opsiDropdown.trim()) {
        setCreateError(`Kolom "${c.namaKolom}" bertipe Dropdown wajib punya opsi.`);
        return;
      }
    }
    setSaving(true);
    setCreateError("");
    try {
      await api.freeTables.create({
        nama_tabel: namaTabel,
        deskripsi,
        kolom: validCols.map((c) => ({
          nama_kolom: c.namaKolom,
          tipe_data: c.tipeData,
          opsi_dropdown: c.tipeData === "DROPDOWN" ? c.opsiDropdown.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
        })),
      });
      setCreateModalOpen(false);
      load();
    } catch (e: any) {
      setCreateError(e.message || "Gagal membuat tabel.");
    } finally {
      setSaving(false);
    }
  };

  const deleteTable = async (t: any) => {
    if (!confirm(`Hapus tabel "${t.namaTabel}" beserta seluruh isinya? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await api.freeTables.delete(t.id);
      load();
    } catch (e: any) {
      alert(e.message || "Gagal menghapus tabel.");
    }
  };

  if (selectedTable) {
    return <TabelBebasDetail table={selectedTable} onBack={() => { setSelectedTable(null); load(); }} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted">Pendataan bebas, terpisah dari Master Transaksi/akuntansi.</p>
        <Button variant="primary" size="md" onClick={openCreate} leftIcon={PlusIcon}>Buat Tabel</Button>
      </div>

      {loading ? (
        <Card className="flex items-center justify-center py-16"><div className="text-muted">Memuat...</div></Card>
      ) : tables.length === 0 ? (
        <Card className="flex items-center justify-center py-16"><div className="text-muted">Belum ada tabel bebas. Buat yang pertama lewat tombol di atas.</div></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((t) => (
            <div key={t.id} onClick={() => setSelectedTable(t)} className="cursor-pointer">
              <Card padding="md" className="flex flex-col gap-3 hover:shadow-card-hover">
                <div className="flex items-start justify-between">
                  <span className="font-heading text-[16px] font-semibold text-ink">{t.namaTabel}</span>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-danger-bg hover:text-danger"
                    onClick={(e) => { e.stopPropagation(); deleteTable(t); }}
                  >
                    {TrashIcon}
                  </button>
                </div>
                {t.deskripsi && <p className="text-[12px] text-muted">{t.deskripsi}</p>}
                <div className="flex items-center gap-3 text-[12px] text-muted">
                  <span>{t.kolom?.length || 0} kolom</span>
                  <span>·</span>
                  <span>{t._count?.baris ?? 0} baris</span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Buat Tabel Bebas"
        width={520}
        footer={
          <>
            <Button variant="outline" size="md" onClick={() => setCreateModalOpen(false)}>Batal</Button>
            <Button variant="primary" size="md" onClick={submitCreate} disabled={saving}>
              {saving ? "Menyimpan..." : "Buat Tabel"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <InputField label="Nama Tabel" placeholder="Contoh: Hutang Planning" value={namaTabel} onChange={setNamaTabel} required />
          <InputField label="Deskripsi" type="textarea" value={deskripsi} onChange={setDeskripsi} />
          <div className="w-full h-px bg-border" />
          <ColumnBuilder columns={newColumns} onChange={setNewColumns} />
          {createError && <p className="text-[12px] font-medium text-danger">{createError}</p>}
        </div>
      </Modal>
    </div>
  );
}

function TabelBebasDetail({ table, onBack }: { table: any; onBack: () => void }) {
  const [detail, setDetail] = useState<any>(table);
  const [loading, setLoading] = useState(true);

  const [rowModalOpen, setRowModalOpen] = useState(false);
  const [rowValues, setRowValues] = useState<Record<string, string>>({});
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [rowError, setRowError] = useState("");
  const [savingRow, setSavingRow] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.freeTables.getById(table.id);
      if (res.success) setDetail(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [table.id]);

  useEffect(() => { load(); }, [load]);

  const columns = detail.kolom || [];

  const openAddRow = () => {
    setEditingRow(null);
    setRowValues({});
    setRowError("");
    setRowModalOpen(true);
  };

  const openEditRow = (row: any) => {
    setEditingRow(row);
    setRowValues(row.data || {});
    setRowError("");
    setRowModalOpen(true);
  };

  const submitRow = async () => {
    setSavingRow(true);
    setRowError("");
    try {
      if (editingRow) {
        await api.freeTables.updateRow(table.id, editingRow.id, rowValues);
      } else {
        await api.freeTables.createRow(table.id, rowValues);
      }
      setRowModalOpen(false);
      load();
    } catch (e: any) {
      setRowError(e.message || "Gagal menyimpan baris.");
    } finally {
      setSavingRow(false);
    }
  };

  const deleteRow = async (row: any) => {
    if (!confirm("Hapus baris ini?")) return;
    try {
      await api.freeTables.deleteRow(table.id, row.id);
      load();
    } catch (e: any) {
      alert(e.message || "Gagal menghapus baris.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-[13px] font-semibold text-muted hover:text-ink">
          ← Kembali ke Tabel Bebas
        </button>
        <Button variant="primary" size="sm" onClick={openAddRow} leftIcon={PlusIcon} disabled={columns.length === 0}>
          Tambah Baris
        </Button>
      </div>

      <Card padding="md">
        <span className="font-heading text-[18px] font-semibold text-ink">{detail.namaTabel}</span>
        {detail.deskripsi && <p className="text-[12px] text-muted mt-1">{detail.deskripsi}</p>}
      </Card>

      {columns.length === 0 ? (
        <Card className="flex items-center justify-center py-16"><div className="text-muted">Tabel ini belum punya kolom.</div></Card>
      ) : (
        <Card className="p-0 overflow-x-auto">
          <table className="w-full text-[13px] border-collapse border-spacing-0">
            <thead className="bg-card-alt text-muted">
              <tr>
                {columns.map((c: any) => (
                  <th key={c.id} className="text-left px-5 py-3 font-semibold whitespace-nowrap">{c.namaKolom}</th>
                ))}
                <th className="text-right px-5 py-3 font-semibold w-[80px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={columns.length + 1} className="px-5 py-8 text-center text-muted">Memuat...</td></tr>
              ) : (detail.baris || []).length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="px-5 py-8 text-center text-muted">Belum ada baris. Tambah yang pertama lewat tombol di atas.</td></tr>
              ) : (
                (detail.baris || []).map((row: any) => (
                  <tr key={row.id} className="hover:bg-card-alt/40">
                    {columns.map((c: any) => (
                      <td key={c.id} className="px-5 py-3 whitespace-nowrap">{row.data?.[String(c.id)] ?? "-"}</td>
                    ))}
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-border/60 hover:text-ink" onClick={() => openEditRow(row)}>
                          {PencilIcon}
                        </button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-danger-bg hover:text-danger" onClick={() => deleteRow(row)}>
                          {TrashIcon}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        open={rowModalOpen}
        onClose={() => setRowModalOpen(false)}
        title={editingRow ? "Ubah Baris" : "Tambah Baris"}
        width={440}
        footer={
          <>
            <Button variant="outline" size="md" onClick={() => setRowModalOpen(false)}>Batal</Button>
            <Button variant="primary" size="md" onClick={submitRow} disabled={savingRow}>
              {savingRow ? "Menyimpan..." : "Simpan"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {columns.map((c: any) => (
            <DynamicColumnField
              key={c.id}
              kolom={c}
              value={rowValues[String(c.id)] || ""}
              onChange={(v) => setRowValues((prev) => ({ ...prev, [String(c.id)]: v }))}
            />
          ))}
          {rowError && <p className="text-[12px] font-medium text-danger">{rowError}</p>}
        </div>
      </Modal>
    </div>
  );
}
