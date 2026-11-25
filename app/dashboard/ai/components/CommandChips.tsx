import { Icon } from "./Icon";
import type { ChipOption } from "./types";

type CommandChipsProps = { chips: ChipOption[]; activeChip: string; onPick: (id: string) => void };

export function CommandChips({ chips, activeChip, onPick }: CommandChipsProps) {
  return (
    <div
      role="group"
      aria-label="Pintasan perintah cepat"
      className="flex min-w-0 shrink-0 flex-nowrap items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {chips.map((opt) => {
        const active = activeChip === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onPick(opt.id)}
            aria-pressed={active}
            className={
              "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition " +
              (active ? "bg-brand text-white shadow-blue" : "bg-white text-ink shadow-btn hover:bg-app")
            }
          >
            <span className={active ? "text-white" : "text-brand"}>
              <Icon name="sparkle" size={13} stroke={2.1} />
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
