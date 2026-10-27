import { Icon } from "../shared/Icon";
import type { ChipOption } from "../shared/types";

type CommandChipsProps = { chips: ChipOption[]; activeChip: string; onPick: (id: string) => void };

export function CommandChips({ chips, activeChip, onPick }: CommandChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="mr-1 text-[11px] font-extrabold uppercase tracking-[.1em] text-faint">Pintasan perintah cepat</span>
      {chips.map((opt) => {
        const active = activeChip === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onPick(opt.id)}
            aria-pressed={active}
            className={
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-bold transition " +
              (active ? "bg-brand text-white shadow-blue" : "bg-white text-ink shadow-btn hover:bg-app")
            }
          >
            <span className={active ? "text-white" : "text-brand"}>
              <Icon name="sparkle" size={15} stroke={2.1} />
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
