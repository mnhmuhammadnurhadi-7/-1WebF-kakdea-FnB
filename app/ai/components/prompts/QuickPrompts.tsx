import { Icon } from "../shared/Icon";

type QuickPromptsProps = { prompts: string[]; onPick: (p: string) => void };

export function QuickPrompts({ prompts, onPick }: QuickPromptsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {prompts.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPick(p)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[12.5px] font-semibold text-ink shadow-btn transition hover:bg-app"
        >
          <span className="text-brand"><Icon name="sparkle" size={14} stroke={2.1} /></span>
          {p}
        </button>
      ))}
    </div>
  );
}
