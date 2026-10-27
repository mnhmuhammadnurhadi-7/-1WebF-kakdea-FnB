import { Icon } from "../shared/Icon";

type RowActionsProps = { onEdit?: () => void; onDelete: () => void };

/** Tombol edit (biru) dan hapus (merah) di kolom Aksi. stopPropagation supaya klik baris tidak ikut terpicu. */
export function RowActions({ onEdit, onDelete }: RowActionsProps) {
  const base = "flex size-8 items-center justify-center rounded-[10px] transition";
  return (
    <div className="flex items-center justify-end gap-1.5">
      {onEdit && (
        <button type="button" aria-label="Edit" className={base + " bg-[#e8f0ff] text-brand hover:bg-brand/20"} onClick={(ev) => { ev.stopPropagation(); onEdit(); }}>
          <Icon name="pencil" size={15} stroke={2} />
        </button>
      )}
      <button type="button" aria-label="Hapus" className={base + " bg-bad-tint text-bad hover:bg-bad/20"} onClick={(ev) => { ev.stopPropagation(); onDelete(); }}>
        <Icon name="trash" size={15} stroke={2} />
      </button>
    </div>
  );
}
