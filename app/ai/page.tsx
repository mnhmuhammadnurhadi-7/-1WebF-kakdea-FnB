"use client";

import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChipSelector, type ChipOption } from "@/components/ui/ChipSelector";

const SendIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const SparkleIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
    <path d="M12 8a4 4 0 0 0-4 4c0 1.5.5 2.5 2 3.5s2 2 2 4" />
    <path d="M12 8a4 4 0 0 1 4 4c0 1.5-.5 2.5-2 3.5s-2 2-2 4" />
  </svg>
);

const CopyIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const quickPrompts = [
  "/add jual nugget 2 pcs ke Bu Siti WA, 240rb",
  "/add beli daging ayam 10kg 320rb ke Pak Hadi",
  "/add order GF-1044 nugget 1, siomay 1, total 92rb",
  "ringkasan penjualan minggu ini",
  "stok mana yang mau habis?",
];

const suggestionChips: ChipOption[] = [
  { id: "jual", label: "Catat Penjualan" },
  { id: "beli", label: "Catat Pengeluaran" },
  { id: "order", label: "Buat Order Baru" },
  { id: "restock", label: "Restock Stok" },
  { id: "laporan", label: "Lihat Laporan" },
];

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  draftCard?: DraftCardData;
}

interface DraftCardData {
  title: string;
  sheet: string;
  rows: { label: string; value: string }[];
  total?: string;
  sourceBadge?: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Halo Bu Pemilik 👋 Saya Asisten AI Buku Dapur. Kirimkan chat WA/DM struk belanja, atau ketik `/add` diikuti deskripsi transaksi/order. Contoh: `/add jual 2 nugget ke Bu Siti, 240rb`",
    timestamp: "Baru saja",
  },
];

export default function AIPage() {
  const [input, setInput] = useState("");
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

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: text,
      timestamp: nowTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const isAddCommand = text.startsWith("/add") || text.toLowerCase().includes("jual") || text.toLowerCase().includes("beli") || text.toLowerCase().includes("order");
      let aiMessage: ChatMessage;

      if (isAddCommand) {
        const lower = text.toLowerCase();
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
    <AppLayout activeMenu="ai">
      <div className="flex h-[calc(100vh-64px)] min-h-[640px] flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-[28px] font-semibold text-ink leading-tight">
                Asisten AI
              </h1>
              <Badge variant="ai">ONLINE</Badge>
            </div>
            <p className="text-[14px] text-muted">
              Chat seperti biasa, atau pakai <span className="font-mono text-[13px] bg-accent-tag text-accent px-1.5 py-0.5 rounded-md">/add</span> untuk input data cepat.
            </p>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap items-center gap-2">
          {suggestionChips.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleChipClick(opt.id)}
              className={`
                inline-flex h-9 items-center gap-2 rounded-[10px] px-4
                text-[13px] font-semibold transition-colors
                ${activeChip === opt.id
                  ? "bg-teal-active text-white"
                  : "bg-card text-ink border border-border hover:bg-card-alt"
                }
              `}
            >
              <span className={activeChip === opt.id ? "text-white" : "text-accent"}>
                {SparkleIcon}
              </span>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <Card className="flex flex-1 flex-col p-0 overflow-hidden" padding="none">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {m.role === "ai" ? (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-active text-white">
                    {SparkleIcon}
                  </div>
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-bg text-[12px] font-bold text-teal-deep">
                    BP
                  </div>
                )}

                <div className={`flex max-w-[78%] flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      m.role === "user"
                        ? "bg-teal-active text-white rounded-tr-sm"
                        : "bg-card-alt text-ink rounded-tl-sm border border-border"
                    }`}
                  >
                    <div className="text-[14px] whitespace-pre-wrap leading-relaxed">
                      {m.content}
                    </div>
                  </div>

                  {m.draftCard && <DraftCard data={m.draftCard} />}

                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[11px] text-muted-light">{m.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(m.id, m.content)}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted hover:bg-card-muted transition-colors"
                      aria-label="Salin pesan"
                    >
                      {copiedId === m.id ? (
                        <span className="text-teal-success">{CheckIcon}</span>
                      ) : (
                        CopyIcon
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick prompts */}
          <div className="border-t border-border px-6 py-3 flex flex-wrap items-center gap-2">
            {quickPrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleQuickPrompt(p)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card-alt px-3 py-1.5 text-[12px] font-medium text-muted hover:bg-border/40 hover:text-ink transition-colors"
              >
                <span className="text-accent">{SparkleIcon}</span>
                {p}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div className="border-t border-border px-6 py-4">
            <div className="flex items-end gap-3 rounded-[14px] border border-border bg-card-alt p-3 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Ketik pesan / perintah... (Enter kirim, Shift+Enter baris baru)`}
                rows={1}
                className="flex-1 resize-none bg-transparent px-2 py-2 text-[14px] text-ink placeholder:text-muted-light focus:outline-none max-h-40"
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleSend}
                leftIcon={SendIcon}
                disabled={!input.trim()}
              >
                Kirim
              </Button>
            </div>
            <p className="mt-2 px-1 text-[11px] text-muted-light">
              💡 Data dari AI tetap perlu dicek & dikonfirmasi sebelum disimpan (double-entry wajib balance).
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

function DraftCard({ data }: { data: DraftCardData }) {
  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-b border-border bg-card-alt">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-bg text-accent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-[15px] font-semibold text-ink leading-tight">
              {data.title}
            </span>
            <span className="text-[11px] text-muted">Sheet: {data.sheet} · menunggu konfirmasi</span>
          </div>
        </div>
        {data.sourceBadge && <Badge variant="ai">{data.sourceBadge}</Badge>}
      </div>

      <div className="px-5 py-4 flex flex-col divide-y divide-border">
        {data.rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
            <span className="text-[13px] text-muted">{r.label}</span>
            <span className="text-[13px] font-semibold text-ink text-right">{r.value}</span>
          </div>
        ))}
      </div>

      {data.total && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-teal-mint/40">
          <span className="font-heading text-[14px] font-bold text-teal-active">Total</span>
          <span className="font-heading text-[18px] font-bold text-teal-active">{data.total}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border">
        <Button variant="ghost" size="sm">
          Koreksi
        </Button>
        <Button variant="outline" size="sm">
          Simpan sebagai Draf
        </Button>
        <Button variant="primary" size="sm" leftIcon={CheckIcon}>
          Simpan & Posting
        </Button>
      </div>
    </div>
  );
}
