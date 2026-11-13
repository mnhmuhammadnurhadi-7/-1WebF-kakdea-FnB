import type { RefObject } from "react";
import { ChatMessageItem } from "./ChatMessageItem";
import type { ChatMessage } from "./types";

type ChatThreadProps = {
  messages: ChatMessage[];
  copiedId: string | null;
  onCopy: (id: string, content: string) => void;
  onRetry: (text: string) => void;
  onEdit: (text: string) => void;
  onPickCommand: (cmd: string) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
};

export function ChatThread({ messages, copiedId, onCopy, onRetry, onEdit, onPickCommand, scrollRef }: ChatThreadProps) {
  return (
    <div
      ref={scrollRef}
      role="log"
      aria-label="Percakapan chat"
      className="min-h-0 flex flex-1 flex-col gap-5 overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border border-white/70 bg-white/50 p-4 shadow-card"
    >
      {messages.map((m) => (
        <ChatMessageItem key={m.id} message={m} copied={copiedId === m.id} onCopy={onCopy} onRetry={onRetry} onEdit={onEdit} onPickCommand={onPickCommand} />
      ))}
    </div>
  );
}
