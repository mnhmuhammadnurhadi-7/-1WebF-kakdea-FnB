import Link from "next/link";
import { StateBanner } from "@/components/feedback/StateBanner";
import { Button } from "./Button";
import { Icon } from "./Icon";
import type { DraftCardData } from "./types";

export function DraftCard({ data }: { data: DraftCardData }) {
  const status = data.status;
  return (
    <div className="w-full overflow-hidden rounded-card bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-soft px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#e8f0ff] text-brand">
            <Icon name="doc" size={17} stroke={2} />
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold leading-tight tracking-[-.02em] text-ink">{data.title}</span>
            <span className="text-[11.5px] text-faint">Sheet: {data.sheet} · menunggu konfirmasi</span>
          </div>
        </div>
        {data.sourceBadge && (
          <span className="rounded-full bg-sky-tint px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[.08em] text-navy">{data.sourceBadge}</span>
        )}
      </div>

      <div className="flex flex-col px-5 py-3">
        {data.rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between gap-4 border-b border-dashed border-line py-2.5 last:border-b-0">
            <span className="text-[13px] text-body">{r.label}</span>
            <span className="text-right text-[13.5px] font-bold text-ink">{r.value}</span>
          </div>
        ))}
      </div>

      {data.total && (
        <div className="mx-4 mb-4 flex items-center justify-between rounded-xl bg-[#eef4ff] px-4 py-3">
          <span className="text-[13.5px] font-bold text-ink">Total</span>
          <span className="tabular text-[24px] font-extrabold tracking-[-.02em] text-brand">{data.total}</span>
        </div>
      )}

      {status && (
        <div className="px-4 pb-4">
          {status === "saved" && (
            <StateBanner tone="success" title="Tersimpan ke Master Transaksi">
              <Link href="/dashboard/data" className="font-bold text-brand hover:underline">Lihat di Data →</Link>
            </StateBanner>
          )}
          {status === "error" && (
            <StateBanner title="Transaksi belum tersimpan" code="ERR-A202">
              Terjadi gangguan saat menyimpan ke sistem pembukuan. Draf masih aman.
            </StateBanner>
          )}
          {status === "duplicate" && (
            <StateBanner tone="warn" title="Transaksi serupa sudah tercatat" code="ERR-A222">
              Ada transaksi dengan tanggal, nominal, dan pihak yang sama. Pastikan ini bukan catatan ganda.
            </StateBanner>
          )}
        </div>
      )}

      {status !== "saved" && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line-soft bg-cream px-5 py-3.5">
          {status === "duplicate" ? (
            <>
              <Button variant="secondary" size="sm">Batalkan</Button>
              <Button size="sm" icon="check">Tetap Simpan</Button>
            </>
          ) : status === "error" ? (
            <>
              <Button variant="secondary" size="sm">Edit Dulu</Button>
              <Button size="sm" icon="check">Coba simpan lagi</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="sm">Koreksi</Button>
              <Button variant="outline" size="sm">Simpan sebagai Draf</Button>
              <Button size="sm" icon="check">Simpan &amp; Posting</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
