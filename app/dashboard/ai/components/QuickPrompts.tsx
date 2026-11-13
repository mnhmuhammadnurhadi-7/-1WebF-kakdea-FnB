import { Icon } from "./Icon";

type QuickPromptsProps = { prompts: string[]; onPick: (p: string) => void };

export function QuickPrompts({ prompts, onPick }: QuickPromptsProps) {
  return (
    <div
      role="group"
      aria-label="Saran pesan"
      className="flex min-w-0 shrink-0 flex-nowrap items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {prompts.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPick(p)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-ink shadow-btn transition hover:bg-app"
        >
          <span className="text-brand"><Icon name="sparkle" size={14} stroke={2.1} /></span>
          {p}
        </button>
      ))}
    </div>
  );
}
