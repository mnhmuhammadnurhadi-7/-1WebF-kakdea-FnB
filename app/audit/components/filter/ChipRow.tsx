import type { ChipOption } from "../shared/types";

type ChipRowProps = { options: ChipOption[]; value: string; onChange: (id: string) => void };

export function ChipRow({ options, value, onChange }: ChipRowProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={active}
            className={
              "inline-flex h-9 items-center rounded-full px-4 text-[12.5px] font-bold transition " +
              (active ? "bg-brand text-white shadow-blue" : "bg-white text-ink shadow-btn hover:bg-app")
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
