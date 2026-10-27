import type { ChipOption } from "../shared/types";

type DataTabsProps = { loading: boolean; tabs: ChipOption[]; value: string; onChange: (id: string) => void };

export function DataTabs({ loading, tabs, value, onChange }: DataTabsProps) {
  return (
    <div className="flex flex-wrap gap-2.5 border-b border-line pb-4">
      {loading ? (
        <span className="px-2 py-1 text-[13px] text-faint">Memuat tab...</span>
      ) : (
        tabs.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-pressed={active}
              className={
                "inline-flex h-11 items-center rounded-full px-5 text-[13.5px] font-bold transition " +
                (active ? "bg-brand text-white shadow-blue" : "bg-white text-ink shadow-btn hover:bg-app")
              }
            >
              {t.label}
            </button>
          );
        })
      )}
    </div>
  );
}
