"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  api,
  type AiActionDraft,
  type AiConversationSummary,
  type AiMessageDto,
  type AiUploadDocumentPayload,
} from "@/lib/api";
import { useToast } from "@/components/feedback/ToastProvider";
import { AiHeader } from "./AiHeader";
import { ChatComposer } from "./ChatComposer";
import { ChatThread } from "./ChatThread";
import { CommandChips } from "./CommandChips";
import { ConversationList } from "./ConversationList";
import { DocumentUploadModal } from "./DocumentUploadModal";
import { QuickPrompts } from "./QuickPrompts";
import { quickPrompts, suggestionChips } from "./constants";
import type { ChatMessage, DraftExecutionState } from "./types";

function formatMessageTime(iso?: string): string {
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

function getInitials(name?: string | null): string {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function mapDtoToChatMessage(dto: AiMessageDto): ChatMessage {
  return {
    id: String(dto.id),
    role: dto.role === "USER" ? "user" : "ai",
    content: dto.content,
    timestamp: formatMessageTime(dto.createdAt),
    routePath: dto.routePath,
    citations: Array.isArray(dto.citations) ? dto.citations : [],
    actions: Array.isArray(dto.actions) ? dto.actions : [],
  };
}

export function AiView({ initialInput = "" }: { initialInput?: string }) {
  const toast = useToast();

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userInitials, setUserInitials] = useState("AD");

  const [conversations, setConversations] = useState<AiConversationSummary[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  const [input, setInput] = useState(initialInput);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeChip, setActiveChip] = useState<string>("");
  const [draftStates, setDraftStates] = useState<Record<string, DraftExecutionState>>({});

  const [isReindexing, setIsReindexing] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const loadConversationDetail = useCallback(
    async (conversationId: number) => {
      setLoadingConversation(true);
      try {
        const res = await api.ai.getConversation(conversationId);
        const detail = res.data;
        setActiveConversationId(detail.id);
        setMessages((detail.messages ?? []).map(mapDtoToChatMessage));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Gagal memuat detail percakapan AI.";
        toast.error("Gagal memuat percakapan", { description: message });
      } finally {
        setLoadingConversation(false);
      }
    },
    [toast]
  );

  const loadConversations = useCallback(
    async (autoSelectLatest = false) => {
      setLoadingConversations(true);
      setConversationsError(null);
      try {
        const res = await api.ai.getConversations(30);
        const list = Array.isArray(res.data) ? res.data : [];
        setConversations(list);
        if (autoSelectLatest && list.length > 0 && !initialInput) {
          await loadConversationDetail(list[0].id);
        }
      } catch (err) {
        setConversationsError(
          err instanceof Error ? err.message : "Gagal memuat riwayat percakapan."
        );
      } finally {
        setLoadingConversations(false);
      }
    },
    [initialInput, loadConversationDetail]
  );

  useEffect(() => {
    let active = true;
    api.auth
      .getMe()
      .then((res) => {
        if (!active) return;
        const role = String(res.data?.peran || "ADMIN");
        setIsSuperAdmin(role === "SUPER_ADMIN");
        setUserInitials(getInitials(res.data?.nama));
      })
      .catch(() => {
        if (!active) return;
        setIsSuperAdmin(false);
      });

    api.ai
      .getConversations(30)
      .then(async (res) => {
        if (!active) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setConversations(list);
        setConversationsError(null);
        if (list.length > 0 && !initialInput) {
          setLoadingConversation(true);
          try {
            const detailRes = await api.ai.getConversation(list[0].id);
            if (!active) return;
            setActiveConversationId(detailRes.data.id);
            setMessages((detailRes.data.messages ?? []).map(mapDtoToChatMessage));
          } catch (err) {
            if (!active) return;
            const message =
              err instanceof Error ? err.message : "Gagal memuat detail percakapan AI.";
            toast.error("Gagal memuat percakapan", { description: message });
          } finally {
            if (active) setLoadingConversation(false);
          }
        }
      })
      .catch((err) => {
        if (!active) return;
        setConversationsError(
          err instanceof Error ? err.message : "Gagal memuat riwayat percakapan."
        );
      })
      .finally(() => {
        if (active) setLoadingConversations(false);
      });

    return () => {
      active = false;
    };
  }, [initialInput, toast]);

  const send = async (text: string, skipUserMessage = false) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setMessages((prev) => [
        ...prev,
        {
          id: `offline-${Date.now()}`,
          role: "ai",
          content: "",
          timestamp: formatMessageTime(),
          notice: {
            kind: "gagal-memproses",
            code: "ERR-A201",
            retryText: trimmed,
            detail: "Perangkat sedang offline. Periksa koneksi internet lalu kirim ulang pesan Anda.",
          },
        },
      ]);
      return;
    }

    const tempUserId = `temp-user-${Date.now()}`;
    if (!skipUserMessage) {
      const optimisticUserMessage: ChatMessage = {
        id: tempUserId,
        role: "user",
        content: trimmed,
        timestamp: formatMessageTime(),
      };
      setMessages((prev) => [...prev, optimisticUserMessage]);
      setInput("");
    }

    setIsSending(true);
    try {
      const res = await api.ai.chat({
        message: trimmed,
        conversationId: activeConversationId ?? undefined,
      });

      const chatData = res.data;
      const persistedUser = mapDtoToChatMessage(chatData.userMessage);
      const persistedAssistant = mapDtoToChatMessage(chatData.assistantMessage);

      setActiveConversationId(chatData.conversationId);
      setMessages((prev) => {
        if (skipUserMessage) {
          return [...prev, persistedAssistant];
        }
        const withoutTemp = prev.filter((item) => item.id !== tempUserId);
        return [...withoutTemp, persistedUser, persistedAssistant];
      });

      void loadConversations(false);
    } catch (err) {
      const detail =
        err instanceof Error
          ? err.message
          : "Layanan Asisten AI sedang sibuk atau terjadi kesalahan jaringan.";
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "ai",
          content: "",
          timestamp: formatMessageTime(),
          notice: {
            kind: "gagal-memproses",
            code: "ERR-A201",
            retryText: trimmed,
            detail,
          },
        },
      ]);
      toast.error("Pesan gagal diproses", { description: detail });
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = () => {
    void send(input);
  };

  const handleRetry = (text: string) => {
    void send(text, true);
  };

  const handleEditMessage = (text: string) => setInput(text);
  const handlePickCommand = (cmd: string) => setInput(`${cmd} `);

  const handleChipClick = (chip: string) => {
    setActiveChip(chip);
    if (chip === "laporan") setInput("Berapa total penjualan dan pengeluaran 7 hari terakhir?");
    else if (chip === "sop") setInput("Bagaimana SOP pencatatan transaksi di SOJU?");
    else if (chip === "jual") setInput("/add jual ");
    else if (chip === "beli") setInput("/add beli ");
    else if (chip === "order") setInput("Berapa jumlah pesanan pelanggan terbaru beserta statusnya?");
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleCopy = (id: string, content: string) => {
    if (!content) return;
    navigator.clipboard?.writeText(content);
    setCopiedId(id);
    toast.info("Pesan disalin ke papan klip");
  };

  const handleSelectConversation = (id: number) => {
    if (id === activeConversationId) {
      setMobileHistoryOpen(false);
      return;
    }
    setMobileHistoryOpen(false);
    void loadConversationDetail(id);
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setMobileHistoryOpen(false);
  };

  const handleConfirmDraft = async (messageId: string, draft: AiActionDraft) => {
    const draftKey = `${messageId}:${draft.id}`;
    const current = draftStates[draftKey]?.status ?? "idle";
    if (!draft.isReadyToConfirm || current === "saving" || current === "saved") {
      return;
    }

    setDraftStates((prev) => ({
      ...prev,
      [draftKey]: { status: "saving" },
    }));

    try {
      const transactionPayload = {
        ...draft.payload,
        sumberInput: "AI",
        sumber_input: "AI",
      };
      await api.transactions.create(transactionPayload);

      setDraftStates((prev) => ({
        ...prev,
        [draftKey]: { status: "saved" },
      }));
      toast.success("Transaksi berhasil disimpan", {
        description: `${draft.title} (${draft.total}) telah tercatat dengan sumber AI.`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Gagal menyimpan draf transaksi ke Master Transaksi.";
      setDraftStates((prev) => ({
        ...prev,
        [draftKey]: { status: "error", errorMessage },
      }));
      toast.error("Gagal menyimpan transaksi", { description: errorMessage });
    }
  };

  const handleCorrectDraft = (draft: AiActionDraft) => {
    setInput(`Koreksi draf "${draft.title}": `);
  };

  const handleReindex = async () => {
    if (!isSuperAdmin || isReindexing) return;
    setIsReindexing(true);
    try {
      const res = await api.ai.reindex();
      const summary = res.data;
      toast.success("Reindex pengetahuan AI selesai", {
        description: `${summary.documentsProcessed} dokumen diproses menjadi ${summary.chunksCreated} potongan indeks.`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menjalankan reindex basis pengetahuan AI.";
      toast.error("Reindex gagal", { description: message });
    } finally {
      setIsReindexing(false);
    }
  };

  const handleUploadDocument = async (payload: AiUploadDocumentPayload) => {
    if (!isSuperAdmin || isUploadingDoc) return;
    setIsUploadingDoc(true);
    try {
      const res = await api.ai.uploadDocument(payload);
      toast.success("Dokumen berhasil diindeks", {
        description: `"${res.data.document.title}" ditambahkan (${res.data.indexing.chunksCreated} potongan indeks).`,
      });
      setUploadModalOpen(false);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  return (
    <>
      <div className="-mb-11 flex h-[calc(100dvh-6rem)] min-h-0 flex-col gap-2 overflow-hidden">
        <AiHeader
          isSuperAdmin={isSuperAdmin}
          isReindexing={isReindexing}
          conversationCount={conversations.length}
          onReindex={() => void handleReindex()}
          onOpenUploadModal={() => setUploadModalOpen(true)}
          onToggleHistory={() => setMobileHistoryOpen((prev) => !prev)}
        />

        <div className="flex min-h-0 flex-1 gap-3 overflow-hidden">
          <div className="hidden w-[268px] shrink-0 lg:block">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              loading={loadingConversations}
              error={conversationsError}
              disabled={isSending || loadingConversation}
              onSelect={handleSelectConversation}
              onNewChat={handleNewChat}
              onRetry={() => void loadConversations(false)}
            />
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1.5 overflow-hidden">
            <CommandChips chips={suggestionChips} activeChip={activeChip} onPick={handleChipClick} />
            <ChatThread
              messages={messages}
              userInitials={userInitials}
              copiedId={copiedId}
              loadingConversation={loadingConversation}
              isSending={isSending}
              draftStates={draftStates}
              onCopy={handleCopy}
              onRetry={handleRetry}
              onEdit={handleEditMessage}
              onPickCommand={handlePickCommand}
              onConfirmDraft={(msgId, draft) => void handleConfirmDraft(msgId, draft)}
              onCorrectDraft={handleCorrectDraft}
              scrollRef={scrollRef}
            />
            <QuickPrompts prompts={quickPrompts} onPick={handleQuickPrompt} />
            <ChatComposer
              value={input}
              disabled={isSending || loadingConversation}
              isSending={isSending}
              onChange={setInput}
              onSend={handleSend}
            />
          </div>
        </div>
      </div>

      {mobileHistoryOpen && (
        <div
          className="fixed inset-0 z-[85] flex bg-navy/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileHistoryOpen(false)}
        >
          <div
            className="h-full w-[300px] max-w-[85vw] p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              loading={loadingConversations}
              error={conversationsError}
              disabled={isSending || loadingConversation}
              onSelect={handleSelectConversation}
              onNewChat={handleNewChat}
              onRetry={() => void loadConversations(false)}
              onCloseMobile={() => setMobileHistoryOpen(false)}
            />
          </div>
        </div>
      )}

      {isSuperAdmin && uploadModalOpen && (
        <DocumentUploadModal
          submitting={isUploadingDoc}
          onClose={() => setUploadModalOpen(false)}
          onSubmit={handleUploadDocument}
        />
      )}
    </>
  );
}
