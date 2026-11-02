"use client";

import { useEffect, useRef, useState } from "react";
import { AiHeader } from "./AiHeader";
import { ChatComposer } from "./ChatComposer";
import { ChatThread } from "./ChatThread";
import { CommandChips } from "./CommandChips";
import { QuickPrompts } from "./QuickPrompts";
import { AVAILABLE_COMMANDS, initialMessages, quickPrompts, suggestionChips } from "./constants";
import type { ChatMessage, DraftCardData } from "./types";

/** Logic chat (kirim, balasan AI simulasi, salin, chip) dari kode teman; tampilannya memakai komponen di atas. */
export function AiView({ initialInput = "" }: { initialInput?: string }) {
  const [input, setInput] = useState(initialInput);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeChip, setActiveChip] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const nowTime = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const send = (text: string, skipUserMessage = false) => {
    if (!text) return;
    if (!skipUserMessage) {
      const userMsg: ChatMessage = {
        id: String(Date.now()),
        role: "user",
        content: text,
        timestamp: nowTime(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
    }

    setTimeout(() => {
      // Kondisi 1: perangkat sedang offline → pesan gagal diproses (bisa dikirim ulang).
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setMessages((prev) => [
          ...prev,
          { id: String(Date.now() + 1), role: "ai", content: "", timestamp: nowTime(), notice: { kind: "gagal-memproses", code: "ERR-A201", retryText: text } },
        ]);
        return;
      }
      // Kondisi 2: perintah berawalan "/" yang tidak ada di daftar → perintah tidak dikenali.
      const slash = /^\/([a-z]+)/i.exec(text);
      if (slash && !AVAILABLE_COMMANDS.some((c) => c.cmd === "/" + slash[1].toLowerCase())) {
        setMessages((prev) => [
          ...prev,
          { id: String(Date.now() + 1), role: "ai", content: "", timestamp: nowTime(), notice: { kind: "perintah-tidak-dikenali", code: "ERR-A203", command: "/" + slash[1] } },
        ]);
        return;
      }
      const isAddCommand = text.startsWith("/add") || text.toLowerCase().includes("jual") || text.toLowerCase().includes("beli") || text.toLowerCase().includes("order");
      const lower = text.toLowerCase();
      let aiMessage: ChatMessage;

      if (isAddCommand) {
        let card: DraftCardData;
        if (lower.includes("jual")) {
          card = {
            title: "Draft Penjualan Produk",
            sheet: "Transaksi",
            rows: [
              { label: "Tanggal", value: "05 Sep 2026" },
              { label: "Jenis Transaksi", value: "Penjualan Produk" },
              { label: "Nominal", value: "Rp 240.000" },
              { label: "Deskripsi", value: "Penjualan 2 nugget ke Bu Siti (WA)" },
              { label: "Customer", value: "Bu Siti — WA" },
            ],
            total: "Rp 240.000",
            sourceBadge: "AI",
          };
        } else if (lower.includes("beli")) {
          card = {
            title: "Draft Pembelian Bahan Baku",
            sheet: "Transaksi",
            rows: [
              { label: "Tanggal", value: "05 Sep 2026" },
              { label: "Jenis Transaksi", value: "Pembelian Bahan Baku" },
              { label: "Nominal", value: "Rp 320.000" },
              { label: "Deskripsi", value: "Pembelian daging ayam 10kg" },
              { label: "Supplier", value: "Pak Hadi — Bahan Sejahtera" },
            ],
            total: "Rp 320.000",
            sourceBadge: "AI",
          };
        } else {
          card = {
            title: "Draft Order Baru",
            sheet: "Order",
            rows: [
              { label: "Tanggal", value: "05 Sep 2026" },
              { label: "Customer", value: "GrabFood — GF-1044" },
              { label: "Sumber", value: "GrabFood" },
              { label: "Item 1", value: "Nugget Ayam 500g × 1" },
              { label: "Item 2", value: "Siomay Ayam × 1" },
            ],
            total: "Rp 92.000",
            sourceBadge: "AI",
          };
        }

        aiMessage = {
          id: String(Date.now() + 1),
          role: "ai",
          content:
            "Saya sudah baca dan parse isinya. Berikut draftnya — dicek dulu Bu, kalau sudah oke klik **Simpan Draft** ya. Kalau ada yang salah, bilang saja biar saya koreksi.",
          timestamp: nowTime(),
          draftCard: card,
        };
      } else if (lower.includes("stok")) {
        aiMessage = {
          id: String(Date.now() + 1),
          role: "ai",
          content:
            "Yang stoknya menipis (≤ 5 pcs/pack) 📉:\n• Dimsum Udang Premium — sisa **3 pack**\n• Tempura Udang — sisa **4 pack**\n• Pempek Ikan Isi — sisa **2 pack**\n\nSaran: segera restock 3 item di atas ya Bu, sebelum benar-benar habis.",
          timestamp: nowTime(),
        };
      } else {
        aiMessage = {
          id: String(Date.now() + 1),
          role: "ai",
          content:
            "Baik Bu, berikut ringkasan 7 hari terakhir:\n• **Pemasukan:** Rp 3.180.000 (42 transaksi)\n• **Pengeluaran:** Rp 1.405.000 (18 transaksi)\n• **Laba kotor:** Rp 1.775.000\n• **Order selesai:** 58 order\n\nKalau mau rincian per sheet (transaksi/stok/cs) bilang saja ya.",
          timestamp: nowTime(),
        };
      }

      setMessages((prev) => [...prev, aiMessage]);
    }, 900);
  };

  const handleSend = () => send(input.trim());
  const handleRetry = (text: string) => send(text, true);
  const handleEditMessage = (text: string) => setInput(text);
  const handlePickCommand = (cmd: string) => setInput(cmd + " ");

  const handleChipClick = (chip: string) => {
    setActiveChip(chip);
    if (chip === "jual") setInput("/add jual ");
    else if (chip === "beli") setInput("/add beli ");
    else if (chip === "order") setInput("/add order ");
    else if (chip === "restock") setInput("/add restock ");
    else if (chip === "laporan") setInput("ringkasan penjualan minggu ini");
  };

  const handleQuickPrompt = (p: string) => {
    setInput(p);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard?.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <>
      <div className="flex h-[calc(100dvh-8.75rem)] min-h-[600px] flex-col gap-5">
        <AiHeader />
        <CommandChips chips={suggestionChips} activeChip={activeChip} onPick={handleChipClick} />
        <ChatThread messages={messages} copiedId={copiedId} onCopy={handleCopy} onRetry={handleRetry} onEdit={handleEditMessage} onPickCommand={handlePickCommand} scrollRef={scrollRef} />
        <QuickPrompts prompts={quickPrompts} onPick={handleQuickPrompt} />
        <ChatComposer value={input} onChange={setInput} onSend={handleSend} />
      </div>
    </>
  );
}
