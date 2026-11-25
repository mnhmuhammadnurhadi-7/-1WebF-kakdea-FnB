import type { AiActionDraft, AiRoutePath } from "@/lib/api";
import { StateBanner } from "@/components/feedback/StateBanner";
import { AiNotice } from "./AiNotice";
import { CitationChips } from "./CitationChips";
import { DraftCard } from "./DraftCard";
import { Icon } from "./Icon";
import type { ChatMessage, DraftExecutionState } from "./types";

type ChatMessageItemProps = {
  message: ChatMessage;
  userInitials: string;
  copied: boolean;
  draftStates: Record<string, DraftExecutionState>;
  onCopy: (id: string, content: string) => void;
  onRetry: (text: string) => void;
  onEdit: (text: string) => void;
  onPickCommand: (cmd: string) => void;
  onConfirmDraft: (messageId: string, draft: AiActionDraft) => void;
  onCorrectDraft: (draft: AiActionDraft) => void;
};

function routeBadge(routePath: AiRoutePath | null | undefined): { label: string; className: string } | null {
  switch (routePath) {
    case "SQL_TOOL":
      return {
        label: "Data Operasional (SQL)",
        className: "bg-sky-tint text-navy",
      };
    case "VECTOR_RAG":
      return {
        label: "Basis Pengetahuan (RAG)",
        className: "bg-[#eef4ff] text-brand",
      };
    case "ACTION_DRAFT":
      return {
        label: "Draf Aksi (Perlu Konfirmasi)",
        className: "bg-ok-tint text-ok-text",
      };
    case "REFUSAL":
      return {
        label: "Di Luar Basis Pengetahuan",
        className: "bg-[#FFF8E6] text-[#92400E]",
      };
    default:
      return null;
  }
}

export function ChatMessageItem({
  message: m,
  userInitials,
  copied,
  draftStates,
  onCopy,
  onRetry,
  onEdit,
  onPickCommand,
  onConfirmDraft,
  onCorrectDraft,
}: ChatMessageItemProps) {
  const isUser = m.role === "user";
  const badge = !isUser ? routeBadge(m.routePath) : null;
  const isRefusal = !isUser && m.routePath === "REFUSAL";

  return (
    <div className={"flex gap-3 " + (isUser ? "flex-row-reverse" : "")}>
      {isUser ? (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-extrabold text-navy shadow-btn">
          {userInitials}
        </span>
      ) : (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-blue">
          <Icon name="bot" size={18} stroke={2} />
        </span>
      )}

      <div className={"flex max-w-[85%] flex-col gap-2 sm:max-w-[78%] " + (isUser ? "items-end" : "items-start")}>
        {badge && !m.notice && (
          <span className={"rounded-full px-2.5 py-0.5 text-[10.5px] font-extrabold tracking-[.03em] " + badge.className}>
            {badge.label}
          </span>
        )}

        {m.notice ? (
          <AiNotice notice={m.notice} onRetry={onRetry} onEdit={onEdit} onPickCommand={onPickCommand} />
        ) : isRefusal ? (
          <div className="w-full max-w-[560px]">
            <StateBanner tone="warn" title="Informasi Tidak Ditemukan di Basis Pengetahuan">
              <div className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink">{m.content}</div>
            </StateBanner>
          </div>
        ) : (
          <div
            className={
              "rounded-2xl px-4 py-3 " +
              (isUser
                ? "rounded-tr-md bg-gradient-to-br from-navy to-[#2a4fb0] text-white shadow-navy"
                : "rounded-tl-md bg-white text-ink shadow-card")
            }
          >
            <div className="whitespace-pre-wrap text-[14px] leading-relaxed">{m.content}</div>
          </div>
        )}

        {!isUser && m.citations && m.citations.length > 0 && (
          <CitationChips citations={m.citations} />
        )}

        {!isUser &&
          m.actions &&
          m.actions.length > 0 &&
          m.actions.map((draft) => {
            const draftKey = `${m.id}:${draft.id}`;
            return (
              <DraftCard
                key={draftKey}
                draft={draft}
                execution={draftStates[draftKey]}
                onConfirm={(d) => onConfirmDraft(m.id, d)}
                onCorrect={onCorrectDraft}
              />
            );
          })}

        <div className="flex items-center gap-2 px-1">
          <span className="text-[11px] text-faint">{m.timestamp}</span>
          {m.content && (
            <button
              type="button"
              onClick={() => onCopy(m.id, m.content)}
              className="inline-flex size-6 items-center justify-center rounded-md text-faint transition-colors hover:bg-white hover:text-ink"
              aria-label="Salin pesan"
            >
              {copied ? (
                <span className="text-ok">
                  <Icon name="check" size={14} stroke={2.4} />
                </span>
              ) : (
                <Icon name="copy" size={14} stroke={2} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
