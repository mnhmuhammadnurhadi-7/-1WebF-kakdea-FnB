"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ArahIcon } from "./ArahIcon";
import { TH } from "./constants";
import { formatRupiah } from "./format";
import { JenisBadge } from "./JenisBadge";
import { Panel } from "./Panel";
import { TanggalCell } from "./TanggalCell";
import type { Entry } from "./types";
import { InlineState } from "@/components/status/InlineState";
import { Pagination } from "./Pagination";

type MasterTransaksiFeedProps = { refreshKey: number; onOpenJenis: (jenisId: number) => void };

// MASTER TRANSAKSI — feed gabungan semua entri, kolom default saja
export function MasterTransaksiFeed({ refreshKey, onOpenJenis }: MasterTransaksiFeedProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    api.transactions.getAll({ page, limit: pageSize }).then((res) => {
      if (res.success) {
        const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        setEntries(list);
        setTotal(res.data?.pagination?.total ?? list.length);
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [refreshKey, page, pageSize]);

  return (
    <Panel className="overflow-x-auto">
      <table className="w-full text-[13.5px]">
        <thead className="bg-cream">
          <tr>
            <th className="w-[68px]" />
            <th className={TH}>Tanggal</th>
            <th className={TH}>Keterangan</th>
            <th className={TH}>Jenis Transaksi</th>
            <th className={TH + " text-right"}>Nominal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft">
          {loading ? (
            <tr><td colSpan={5} className="px-5 py-10 text-center text-faint">Memuat...</td></tr>
          ) : !Array.isArray(entries) || entries.length === 0 ? (
            <tr><td colSpan={5}><InlineState kind="kosong" compact title="Belum ada transaksi" description="Tambah lewat tombol “Tambah Transaksi” di atas." /></td></tr>
          ) : (
            entries.map((e) => {
              const masuk = e.jenisTransaksi?.arah === "PEMASUKAN";
              return (
                <tr key={e.id} className="cursor-pointer transition-colors hover:bg-app/70" onClick={() => onOpenJenis(e.jenisTransaksiId)}>
                  <td className="py-4 pl-5"><ArahIcon arah={e.jenisTransaksi?.arah} /></td>
                  <td className="whitespace-nowrap px-5 py-4"><TanggalCell tanggal={e.tanggal} /></td>
                  <td className="max-w-[280px] px-5 py-4 font-semibold text-ink">{e.detail || "-"}</td>
                  <td className="whitespace-nowrap px-5 py-4"><JenisBadge arah={e.jenisTransaksi?.arah} nama={e.namaTransaksi} /></td>
                  <td className={"tabular whitespace-nowrap px-5 py-4 text-right text-[14.5px] font-extrabold " + (masuk ? "text-ok-text" : "text-bad")}>
                    {masuk ? "+" : "-"} {formatRupiah(e.nominal)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <Pagination page={page} totalPages={Math.ceil(total / pageSize)} total={total} pageSize={pageSize} onPage={setPage} onPageSize={(size) => { setPageSize(size); setPage(1); }} />
    </Panel>
  );
}
