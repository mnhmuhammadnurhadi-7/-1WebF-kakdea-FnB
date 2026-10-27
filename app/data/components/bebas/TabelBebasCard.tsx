import { Icon } from "../shared/Icon";
import { Panel } from "../ui/Panel";
import type { FreeTable } from "../shared/types";

type TabelBebasCardProps = { table: FreeTable; onOpen: () => void; onDelete: () => void };

export function TabelBebasCard({ table: t, onOpen, onDelete }: TabelBebasCardProps) {
  return (
    <div onClick={onOpen} className="hover-lift cursor-pointer rounded-card">
      <Panel padding="md" className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[16px] font-bold tracking-[-.02em] text-ink">{t.namaTabel}</span>
          <button
            type="button"
            aria-label="Hapus tabel"
            className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-bad-tint text-bad transition hover:bg-bad/20"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <Icon name="trash" size={15} stroke={2} />
          </button>
        </div>
        {t.deskripsi && <p className="text-[12.5px] text-body">{t.deskripsi}</p>}
        <div className="flex items-center gap-3 text-[12.5px] font-semibold text-faint">
          <span>{t.kolom?.length || 0} kolom</span>
          <span>·</span>
          <span>{t._count?.baris ?? 0} baris</span>
        </div>
      </Panel>
    </div>
  );
}
