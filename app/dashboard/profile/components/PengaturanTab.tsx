import { NotifikasiCard } from "./NotifikasiCard";
import { PreferensiCard } from "./PreferensiCard";
import type { Pengaturan } from "./types";

type PengaturanTabProps = { pengaturan: Pengaturan; onPengaturan: (p: Pengaturan) => void; onSave: () => void };

export function PengaturanTab({ pengaturan, onPengaturan, onSave }: PengaturanTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <NotifikasiCard pengaturan={pengaturan} onPengaturan={onPengaturan} />
      <PreferensiCard pengaturan={pengaturan} onPengaturan={onPengaturan} onSave={onSave} />
    </div>
  );
}
