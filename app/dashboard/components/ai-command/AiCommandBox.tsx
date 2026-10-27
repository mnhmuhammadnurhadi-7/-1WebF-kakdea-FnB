"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "../shared/Icon";

const AI_COMMANDS = [
  { cmd: "/add", label: "Catat Cepat", tone: "brand" },
  { cmd: "/ask", label: "Cek Laba", tone: "brand" },
  { cmd: "/edit", label: "Koreksi", tone: "bad" },
  { cmd: "/stock", label: "Stok", tone: "bad" },
] as const;

const CORNER = "absolute size-3 border-brand/40";

export function AiCommandBox() {
  const router = useRouter();
  const [text, setText] = useState("");

  function insertCommand(cmd: string) {
    setText((t) => (t.startsWith("/") ? cmd + " " : cmd + " " + t));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    // Perintah dilanjutkan di halaman Asisten AI.
    router.push("/ai");
  }

  return (
    <section className="relative rounded-[24px] bg-white px-[22px] py-5 shadow-card">
      {/* Siku pojok dekoratif */}
      <span className={CORNER + " left-2.5 top-2.5 rounded-tl-md border-l-2 border-t-2"} />
      <span className={CORNER + " right-2.5 top-2.5 rounded-tr-md border-r-2 border-t-2"} />
      <span className={CORNER + " bottom-2.5 left-2.5 rounded-bl-md border-b-2 border-l-2"} />
      <span className={CORNER + " bottom-2.5 right-2.5 rounded-br-md border-b-2 border-r-2"} />

      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-white shadow-blue">
          <Icon name="bot" size={20} />
        </span>
        <div>
          <h2 className="flex items-center gap-2 text-[19px] font-bold tracking-[-.03em]">
            BukuKita AI - Pencatat Suara, Chat &amp; Stok Dapur
            <span className="size-2 rounded-full bg-ok shadow-[0_0_0_3px_rgba(5,150,105,.18)]" />
          </h2>
          <p className="text-[13px] text-body">Kecerdasan otomatis input pembukuan dan stok harian frozen food.</p>
        </div>
      </div>

      <div className="my-3.5 flex flex-wrap gap-2.5">
        {AI_COMMANDS.map((c) => (
          <button
            key={c.cmd}
            type="button"
            onClick={() => insertCommand(c.cmd)}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-app px-3.5 py-[7px] text-[13px] font-semibold transition hover:border-brand/40 hover:bg-white"
          >
            <b className={c.tone === "brand" ? "text-brand" : "text-bad"}>{c.cmd}</b>
            {c.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="flex h-[50px] items-center gap-3 rounded-btn border border-[#eeebe3] bg-cream pl-3.5 pr-1.5 shadow-inset focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15"
      >
        <Icon name="filter" size={17} stroke={2} className="text-faint" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ketik perintah atau tempel chat pesanan WhatsApp di sini..."
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
        <button
          type="button"
          aria-label="Rekam suara"
          className="flex size-[38px] items-center justify-center rounded-[11px] bg-white text-brand shadow-btn"
        >
          <Icon name="mic" size={17} stroke={2} />
        </button>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-[13px] bg-brand px-5 text-sm font-bold text-white shadow-blue transition hover:bg-brand-hover active:translate-y-px active:bg-brand-press"
        >
          Kirim
          <Icon name="send" size={15} stroke={2.2} />
        </button>
      </form>
    </section>
  );
}
