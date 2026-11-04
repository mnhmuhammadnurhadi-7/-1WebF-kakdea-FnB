export type ChipOption = { id: string; label: string };

/** Pesan kondisi dari asisten (bukan jawaban biasa). */
export type AiNotice =
  | { kind: "gagal-memproses"; code: string; retryText: string }
  | { kind: "perintah-tidak-dikenali"; code: string; command: string };

export type DraftStatus = "error" | "duplicate" | "saved";

export interface DraftCardData {
  /** Kondisi kartu draf; kosong = draf biasa */
  status?: DraftStatus;
  title: string;
  sheet: string;
  rows: { label: string; value: string }[];
  total?: string;
  sourceBadge?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  draftCard?: DraftCardData;
  notice?: AiNotice;
}
