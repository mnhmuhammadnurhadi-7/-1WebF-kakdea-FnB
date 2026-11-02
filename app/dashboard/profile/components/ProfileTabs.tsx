import type { ProfileTab } from "./types";

const TABS: { id: ProfileTab; label: string }[] = [
  { id: "profil", label: "Profil Toko" },
  { id: "akun", label: "Akun Pengguna" },
  { id: "pengaturan", label: "Pengaturan" },
];

export function ProfileTabs({ value, onChange }: { value: string; onChange: (id: ProfileTab) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 border-b border-line pb-4">
      {TABS.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            aria-pressed={active}
            className={"inline-flex h-11 items-center rounded-full px-5 text-[13.5px] font-bold transition " + (active ? "bg-brand text-white shadow-blue" : "bg-white text-ink shadow-btn hover:bg-app")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
