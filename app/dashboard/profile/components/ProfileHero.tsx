import { Button } from "./Button";
import { Chip } from "./Chip";
import { Panel } from "./Panel";
import type { TokoData, UserData } from "./types";

type ProfileHeroProps = { toko: TokoData; user: UserData; onSave: () => void };

export function ProfileHero({ toko, user, onSave }: ProfileHeroProps) {
  return (
    <Panel className="overflow-hidden">
      <div className="relative h-28 bg-[linear-gradient(110deg,#1E3A8A,#2a52b8_55%,#1E3A8A)]">
        <svg aria-hidden="true" viewBox="0 0 600 120" className="absolute inset-0 h-full w-full opacity-40">
          <ellipse cx="470" cy="60" rx="190" ry="70" transform="rotate(-12 470 60)" fill="none" stroke="#8ED1E4" strokeWidth="1.2" strokeDasharray="8 8" />
        </svg>
      </div>
      <div className="-mt-10 flex flex-wrap items-end justify-between gap-4 px-6 pb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex size-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-[#FBBF24] to-[#F97316] shadow-card">
            <span className="text-[28px] font-extrabold text-white">{toko.nama ? toko.nama.slice(0, 2).toUpperCase() : "BD"}</span>
          </div>
          <div className="flex flex-col gap-1.5 pb-1">
            <h2 className="text-[22px] font-bold leading-tight tracking-[-.02em] text-ink">{toko.nama}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Chip>{user.jabatan}</Chip>
              <Chip tone="sky">{user.nama}</Chip>
              <Chip tone="ok">Aktif</Chip>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 pb-1">
          <Button variant="secondary">Bagikan Toko</Button>
          <Button icon="check" onClick={onSave}>Simpan Semua</Button>
        </div>
      </div>
    </Panel>
  );
}
