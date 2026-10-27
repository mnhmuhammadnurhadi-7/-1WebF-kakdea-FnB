export type ChipOption = { id: string; label: string };

export interface DraftCardData {
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
}
