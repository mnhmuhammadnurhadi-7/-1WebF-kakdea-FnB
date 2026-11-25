import type { ChipOption } from "./types";

type DataTabsProps = {
  loading: boolean;
  tabs: ChipOption[];
  value: string;
  onChange: (id: string) => void;
};

export function DataTabs({ loading, tabs, value, onChange }: DataTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[20px] border border-line bg-white p-2 shadow-card">
      {loading ? (
        <span className="px-3 py-2 text-[13px] font-medium text-faint">Memuat tab...</span>
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
                "inline-flex min-h-10 items-center rounded-xl px-4 text-[13px] font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20 " +
                (active ? "bg-brand text-white shadow-blue" : "text-muted hover:bg-app hover:text-navy")
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
