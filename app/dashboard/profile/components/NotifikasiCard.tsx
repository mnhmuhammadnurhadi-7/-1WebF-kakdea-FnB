import { Panel } from "./Panel";
import { SectionTitle } from "./SectionTitle";
import { ToggleSwitch } from "./ToggleSwitch";
import type { Pengaturan } from "./types";

type NotifikasiCardProps = { pengaturan: Pengaturan; onPengaturan: (p: Pengaturan) => void };

export function NotifikasiCard({ pengaturan, onPengaturan }: NotifikasiCardProps) {
  const rows = [
    { key: "notifOrder", label: "Notifikasi Order Masuk", desc: "Pemberitahuan ketika ada order baru dari WA/DM/GrabFood.", val: pengaturan.notifOrder },
    { key: "notifStok", label: "Peringatan Stok Menipis", desc: "Alert ketika stok produk ≤ batas minimum yang ditentukan.", val: pengaturan.notifStok },
    { key: "notifWa", label: "Kirim Notifikasi via WhatsApp", desc: "Ringkasan harian & alert penting dikirim ke nomor WA toko.", val: pengaturan.notifWa },
    { key: "notifEmail", label: "Kirim Notifikasi via Email", desc: "Laporan bulanan & invoice langganan dikirim ke email.", val: pengaturan.notifEmail },
  ];

  return (
    <Panel padding="md" className="flex flex-col gap-5 lg:col-span-3">
      <SectionTitle icon="bell" tone="bg-[#FFF4D6] text-[#92400E]">Notifikasi</SectionTitle>

      <div className="flex flex-col divide-y divide-line-soft overflow-hidden rounded-2xl border border-line">
        {rows.map((row) => (
          <div key={row.key} className="flex items-start justify-between gap-4 px-4 py-4">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[14px] font-bold text-ink">{row.label}</span>
              <span className="text-[12px] text-body">{row.desc}</span>
            </div>
            <ToggleSwitch checked={row.val} onChange={(v) => onPengaturan({ ...pengaturan, [row.key as keyof Pengaturan]: v } as Pengaturan)} />
          </div>
        ))}
      </div>
    </Panel>
  );
}
