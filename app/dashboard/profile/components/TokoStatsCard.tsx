import { Button } from "./Button";
import { Icon } from "./Icon";
import { Panel } from "./Panel";
import { SectionTitle } from "./SectionTitle";

const STATS = [
  { l: "Bergabung Sejak", v: "Jan 2025", tone: "muted" },
  { l: "Total Produk", v: "12 varian", tone: "brand" },
  { l: "Total Customer", v: "47 orang", tone: "brand" },
  { l: "Total Supplier", v: "6 mitra", tone: "brand" },
  { l: "Order Selesai", v: "1.284", tone: "success" },
  { l: "Rating Customer", v: "4.9 ⭐", tone: "success" },
];

const VALUE_TONE: Record<string, string> = { success: "text-ok-text", brand: "text-brand", muted: "text-ink" };

export function TokoStatsCard() {
  return (
    <Panel padding="md" className="flex flex-col gap-5 lg:col-span-2">
      <SectionTitle icon="table" tone="bg-sky-tint text-navy">Statistik Toko</SectionTitle>

      <div className="grid grid-cols-2 gap-3">
        {STATS.map((s) => (
          <div key={s.l} className="flex flex-col gap-1 rounded-2xl bg-app px-4 py-3">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[.08em] text-faint">{s.l}</span>
            <span className={"text-[17px] font-extrabold tracking-[-.01em] " + VALUE_TONE[s.tone]}>{s.v}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-brand/15 bg-[#eef4ff] p-4">
        <div className="flex items-center gap-2 text-brand">
          <Icon name="shield" size={17} />
          <span className="text-[13px] font-extrabold">Status Langganan</span>
        </div>
        <div className="flex flex-col gap-0.5 pl-7">
          <span className="text-[16px] font-extrabold text-ink">SOJU — Plan UMKM</span>
          <span className="text-[12px] text-body">Aktif sampai 31 Des 2026 · Auto-renew: ON</span>
        </div>
        <div className="pl-7 pt-1">
          <Button variant="secondary" size="sm">Kelola Langganan</Button>
        </div>
      </div>
    </Panel>
  );
}
