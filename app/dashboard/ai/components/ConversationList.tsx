"use client";

import type { AiConversationSummary } from "@/lib/api";
import { Button } from "./Button";
import { Icon } from "./Icon";

function formatRelativeDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type ConversationListProps = {
  conversations: AiConversationSummary[];
  activeConversationId: number | null;
  loading: boolean;
  error: string | null;
  disabled?: boolean;
  onSelect: (id: number) => void;
  onNewChat: () => void;
  onRetry: () => void;
  onCloseMobile?: () => void;
};

/** Daftar riwayat percakapan AI yang tersimpan di server. */
export function ConversationList({
  conversations,
  activeConversationId,
  loading,
  error,
  disabled = false,
  onSelect,
  onNewChat,
  onRetry,
  onCloseMobile,
}: ConversationListProps) {
  return (
    <aside
      aria-label="Riwayat percakapan AI"
      className="flex h-full min-h-0 flex-col rounded-2xl border border-white/80 bg-white/85 p-3 shadow-card backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-2 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-sky-tint text-navy">
            <Icon name="history" size={15} stroke={2.1} />
          </span>
          <h2 className="text-[13.5px] font-bold tracking-[-.01em] text-ink">Riwayat Chat</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onNewChat}
            disabled={disabled}
            className="inline-flex h-8 items-center gap-1 rounded-xl bg-brand px-2.5 text-[11.5px] font-bold text-white shadow-blue transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="plus" size={13} stroke={2.4} />
            Baru
          </button>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Tutup riwayat chat"
              className="flex size-8 items-center justify-center rounded-xl text-faint transition hover:bg-app hover:text-ink lg:hidden"
            >
              <Icon name="close" size={16} stroke={2.2} />
            </button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
        {loading ? (
          <div className="space-y-2 py-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-14 animate-pulse rounded-xl bg-field" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-bad/20 bg-bad-tint p-3 text-center">
            <p className="text-[12px] font-semibold text-bad-text">{error}</p>
            <div className="mt-2">
              <Button size="sm" variant="secondary" onClick={onRetry}>
                Muat Ulang
              </Button>
            </div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-field/70 px-3 py-6 text-center">
            <p className="text-[12.5px] font-bold text-ink">Belum ada percakapan</p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-faint">
              Kirim pertanyaan atau perintah pertama Anda untuk memulai riwayat chat.
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const active = conv.id === activeConversationId;
            return (
              <button
                key={conv.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(conv.id)}
                className={
                  "flex w-full flex-col gap-1 rounded-xl border px-3 py-2.5 text-left transition disabled:opacity-60 " +
                  (active
                    ? "border-brand/30 bg-[#eef4ff] text-navy shadow-btn"
                    : "border-transparent bg-transparent text-ink hover:border-line hover:bg-app")
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[12.5px] font-bold leading-snug">{conv.title}</span>
                  <span className="shrink-0 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-faint">
                    {conv.messageCount}
                  </span>
                </div>
                {conv.lastMessagePreview && (
                  <p className="line-clamp-1 text-[11.5px] text-body">{conv.lastMessagePreview}</p>
                )}
                <span className="text-[10.5px] text-faint">{formatRelativeDate(conv.updatedAt)}</span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
