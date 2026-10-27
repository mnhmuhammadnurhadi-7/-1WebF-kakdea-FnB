import { DraftCard } from "./DraftCard";
import { Icon } from "../shared/Icon";
import type { ChatMessage } from "../shared/types";

type ChatMessageItemProps = { message: ChatMessage; copied: boolean; onCopy: (id: string, content: string) => void };

export function ChatMessageItem({ message: m, copied, onCopy }: ChatMessageItemProps) {
  const isUser = m.role === "user";
  return (
    <div className={"flex gap-3 " + (isUser ? "flex-row-reverse" : "")}>
      {isUser ? (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-extrabold text-navy shadow-btn">BP</span>
      ) : (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-blue">
          <Icon name="bot" size={18} stroke={2} />
        </span>
      )}

      <div className={"flex max-w-[78%] flex-col gap-2 " + (isUser ? "items-end" : "items-start")}>
        <div
          className={
            "rounded-2xl px-4 py-3 " +
            (isUser ? "rounded-tr-md bg-gradient-to-br from-navy to-[#2a4fb0] text-white shadow-navy" : "rounded-tl-md bg-white text-ink shadow-card")
          }
        >
          <div className="whitespace-pre-wrap text-[14px] leading-relaxed">{m.content}</div>
        </div>

        {m.draftCard && <DraftCard data={m.draftCard} />}

        <div className="flex items-center gap-2 px-1">
          <span className="text-[11px] text-faint">{m.timestamp}</span>
          <button
            type="button"
            onClick={() => onCopy(m.id, m.content)}
            className="inline-flex size-6 items-center justify-center rounded-md text-faint transition-colors hover:bg-white hover:text-ink"
            aria-label="Salin pesan"
          >
            {copied ? (
              <span className="text-ok"><Icon name="check" size={14} stroke={2.4} /></span>
            ) : (
              <Icon name="copy" size={14} stroke={2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
