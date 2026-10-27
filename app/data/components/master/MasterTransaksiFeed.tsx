"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ArahIcon } from "../jenis/ArahIcon";
import { TH } from "../shared/constants";
import { formatRupiah } from "../shared/format";
import { JenisBadge } from "./JenisBadge";
import { Panel } from "../ui/Panel";
import { TanggalCell } from "./TanggalCell";
import type { Entry } from "../shared/types";

type MasterTransaksiFeedProps = { refreshKey: number; onOpenJenis: (jenisId: number) => void };

// MASTER TRANSAKSI — feed gabungan semua entri, kolom default saja
export function MasterTransaksiFeed({ refreshKey, onOpenJenis }: MasterTransaksiFeedProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    api.transactions.getAll().then((res) => {
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
        setEntries(list);
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [refreshKey]);

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
            <tr><td colSpan={5} className="px-5 py-10 text-center text-faint">Belum ada transaksi. Tambah lewat tombol &quot;Tambah Transaksi&quot; di atas.</td></tr>
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
    </Panel>
  );
}
