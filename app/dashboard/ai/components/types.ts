import type {
  AiActionDraft,
  AiCitation,
  AiRoutePath,
} from "@/lib/api";

export type ChipOption = { id: string; label: string };

/** Pesan kondisi dari asisten (bukan jawaban biasa). */
export type AiNotice =
  | { kind: "gagal-memproses"; code: string; retryText: string; detail?: string }
  | { kind: "perintah-tidak-dikenali"; code: string; command: string };

export type DraftStatus = "idle" | "saving" | "saved" | "error";

export interface DraftExecutionState {
  status: DraftStatus;
  errorMessage?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  routePath?: AiRoutePath | null;
  citations?: AiCitation[];
  actions?: AiActionDraft[];
  notice?: AiNotice;
}
