export type CmsTab = "content" | "menu";

type CmsTabsProps = { value: CmsTab; onChange: (t: CmsTab) => void; menuCount: number };

export function CmsTabs({ value, onChange, menuCount }: CmsTabsProps) {
  const tabs: { id: CmsTab; label: string; count?: number }[] = [
    { id: "content", label: "Ubah Konten" },
    { id: "menu", label: "Menu Makanan", count: menuCount },
  ];
  return (
    <div className="flex flex-wrap gap-2.5">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            aria-pressed={active}
            className={
              "inline-flex h-11 items-center gap-2 rounded-full px-5 text-[13.5px] font-bold transition " +
              (active ? "bg-brand text-white shadow-blue" : "bg-white text-ink shadow-btn hover:bg-app")
            }
          >
            {t.label}
            {t.count !== undefined && (
              <span className={"rounded-full px-2 py-0.5 text-[10.5px] font-extrabold " + (active ? "bg-white/25 text-white" : "bg-app text-faint")}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
