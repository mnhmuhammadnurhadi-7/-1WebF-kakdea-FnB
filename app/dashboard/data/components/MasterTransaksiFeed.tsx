"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ArahIcon } from "./ArahIcon";
import { TH, TH_CENTER } from "./constants";
import { formatRupiah } from "./format";
import { JenisBadge } from "./JenisBadge";
import { Panel } from "./Panel";
import { TanggalCell } from "./TanggalCell";
import { DataSearch } from "./DataSearch";
import type { Entry } from "./types";
import { InlineState } from "@/components/status/InlineState";
import { Pagination } from "./Pagination";

type MasterTransaksiFeedProps = {
  refreshKey: number;
  onOpenJenis: (jenisId: number) => void;
};

// MASTER TRANSAKSI — feed gabungan semua entri, kolom default saja
export function MasterTransaksiFeed({ refreshKey, onOpenJenis }: MasterTransaksiFeedProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    api.transactions.getAll({ page, limit: pageSize, search: debouncedSearch || undefined }).then((res) => {
      if (res.success) {
        const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        setEntries(list);
        setTotal(res.data?.pagination?.total ?? list.length);
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [refreshKey, page, pageSize, debouncedSearch]);

  const hasSearch = searchTerm.trim().length > 0;

  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-line-soft p-4 sm:px-5">
        <DataSearch
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setPage(1);
          }}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13.5px]">
          <thead className="bg-app">
            <tr>
              <th className="w-[68px]" />
              <th className={TH}>Tanggal</th>
              <th className={TH}>Keterangan</th>
              <th className={TH_CENTER}>Jenis Transaksi</th>
              <th className={TH}>Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-faint">Memuat...</td></tr>
            ) : !Array.isArray(entries) || entries.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <InlineState
                    kind="kosong"
                    compact
                    title={hasSearch ? "Tidak ada hasil pencarian" : "Belum ada transaksi"}
                    description={hasSearch ? "Coba kata kunci lain." : "Tambah lewat tombol “Tambah Transaksi” di atas."}
                  />
                </td>
              </tr>
            ) : (
              entries.map((e) => {
                const masuk = e.jenisTransaksi?.arah === "PEMASUKAN";
                return (
                  <tr
                    key={e.id}
                    className="cursor-pointer transition-colors hover:bg-app/70"
                    onClick={() => onOpenJenis(e.jenisTransaksiId)}
                  >
                    <td className="py-3 pl-4"><ArahIcon arah={e.jenisTransaksi?.arah} /></td>
                    <td className="whitespace-nowrap px-4 py-3"><TanggalCell tanggal={e.tanggal} /></td>
                    <td className="max-w-[280px] px-4 py-3 font-semibold text-ink">{e.detail || "-"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-center"><JenisBadge arah={e.jenisTransaksi?.arah} nama={e.namaTransaksi} /></td>
                    <td className={"tabular whitespace-nowrap px-4 py-3 text-left text-[14.5px] font-extrabold " + (masuk ? "text-ok-text" : "text-bad")}>
                      {masuk ? "+" : "-"} {formatRupiah(e.nominal)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={Math.ceil(total / pageSize)} total={total} pageSize={pageSize} onPage={setPage} onPageSize={(size) => { setPageSize(size); setPage(1); }} />
    </Panel>
  );
}
