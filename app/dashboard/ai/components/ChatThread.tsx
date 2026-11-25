import type { RefObject } from "react";
import type { AiActionDraft } from "@/lib/api";
import { ChatMessageItem } from "./ChatMessageItem";
import { Icon } from "./Icon";
import type { ChatMessage, DraftExecutionState } from "./types";

type ChatThreadProps = {
  messages: ChatMessage[];
  userInitials: string;
  copiedId: string | null;
  loadingConversation: boolean;
  isSending: boolean;
  draftStates: Record<string, DraftExecutionState>;
  onCopy: (id: string, content: string) => void;
  onRetry: (text: string) => void;
  onEdit: (text: string) => void;
  onPickCommand: (cmd: string) => void;
  onConfirmDraft: (messageId: string, draft: AiActionDraft) => void;
  onCorrectDraft: (draft: AiActionDraft) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
};

export function ChatThread({
  messages,
  userInitials,
  copiedId,
  loadingConversation,
  isSending,
  draftStates,
  onCopy,
  onRetry,
  onEdit,
  onPickCommand,
  onConfirmDraft,
  onCorrectDraft,
  scrollRef,
}: ChatThreadProps) {
  return (
    <div
      ref={scrollRef}
      role="log"
      aria-label="Percakapan chat"
      className="min-h-0 flex flex-1 flex-col gap-5 overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border border-white/70 bg-white/50 p-4 shadow-card"
    >
      {loadingConversation ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
          <div className="size-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-[13px] font-semibold text-body">Memuat riwayat percakapan...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-brand text-white shadow-blue">
            <Icon name="bot" size={28} stroke={2} />
          </span>
          <h2 className="mt-4 text-[18px] font-bold tracking-[-.02em] text-ink">
            Halo! Saya Asisten AI SOJU
          </h2>
          <p className="mt-1.5 max-w-[460px] text-[13.5px] leading-relaxed text-body">
            Saya dapat membantu cek ringkasan penjualan &amp; pesanan secara langsung, menjawab pertanyaan SOP/produk
            beserta sitasi sumber, serta menyiapkan draf transaksi lewat perintah{" "}
            <span className="rounded-md bg-sky-tint px-1.5 py-0.5 font-mono text-[12.5px] font-bold text-navy">
              /add
            </span>
            .
          </p>
        </div>
      ) : (
        messages.map((m) => (
          <ChatMessageItem
            key={m.id}
            message={m}
            userInitials={userInitials}
            copied={copiedId === m.id}
            draftStates={draftStates}
            onCopy={onCopy}
            onRetry={onRetry}
            onEdit={onEdit}
            onPickCommand={onPickCommand}
            onConfirmDraft={onConfirmDraft}
            onCorrectDraft={onCorrectDraft}
          />
        ))
      )}

      {isSending && (
        <div className="flex gap-3" aria-live="polite">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-blue">
            <Icon name="bot" size={18} stroke={2} />
          </span>
          <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[13.5px] text-body shadow-card">
            <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            Asisten AI sedang menganalisis data &amp; sumber...
          </div>
        </div>
      )}
    </div>
  );
}
