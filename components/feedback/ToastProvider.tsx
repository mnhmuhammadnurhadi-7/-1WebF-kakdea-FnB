"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { FeedbackIcon, type FeedbackIconName } from "./FeedbackIcon";

type Tone = "success" | "error" | "info";

export type ToastOptions = {
  description?: string;
  /** Label kecil di samping judul, mis. SUKSES / GAGAL / DIHAPUS */
  tag?: string;
  icon?: FeedbackIconName;
  actionLabel?: string;
  onAction?: () => void;
  /** milidetik; default 6000 */
  duration?: number;
};

type ToastItem = ToastOptions & { id: number; tone: Tone; title: string };

export type ToastApi = {
  success: (title: string, options?: ToastOptions) => void;
  error: (title: string, options?: ToastOptions) => void;
  info: (title: string, options?: ToastOptions) => void;
};

const NOOP: ToastApi = { success: () => {}, error: () => {}, info: () => {} };
const ToastContext = createContext<ToastApi>(NOOP);

/** Ambil fungsi toast. Aman dipakai di luar provider (tidak melakukan apa-apa). */
export function useToast(): ToastApi {
  return useContext(ToastContext);
}

const TONE = {
  success: { tile: "bg-ok-tint text-ok", tag: "bg-ok-tint text-ok-text", defaultTag: "SUKSES", icon: "check" as FeedbackIconName },
  error: { tile: "bg-bad-tint text-bad", tag: "bg-bad-tint text-bad-text", defaultTag: "GAGAL", icon: "error" as FeedbackIconName },
  info: { tile: "bg-navy text-white", tag: "bg-sky-tint text-navy", defaultTag: "INFO", icon: "info" as FeedbackIconName },
};

let nextId = 1;

/** Penampung toast di pojok kanan atas, tepat di bawah topbar (gaya Figma SOJU). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (tone: Tone, title: string, options: ToastOptions = {}) => {
      const id = nextId++;
      // Satu pesan yang sama tidak ditumpuk berkali-kali.
      setItems((list) => [...list.filter((t) => !(t.title === title && t.tone === tone)), { id, tone, title, ...options }].slice(-3));
      setTimeout(() => dismiss(id), options.duration ?? 6000);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (title, o) => push("success", title, o),
      error: (title, o) => push("error", title, o),
      info: (title, o) => push("info", title, o),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-6 top-[76px] z-[80] flex flex-col items-end gap-2.5 max-sm:inset-x-4 max-sm:right-4">
        {items.map((t) => {
          const tone = TONE[t.tone];
          return (
            <div
              key={t.id}
              role={t.tone === "error" ? "alert" : "status"}
              className="notice-enter pointer-events-auto flex w-[380px] max-w-full items-center gap-3 rounded-2xl bg-white p-3.5 pr-3 shadow-pop ring-1 ring-line-soft"
            >
              <span className={"flex size-10 shrink-0 items-center justify-center rounded-xl " + tone.tile}>
                <FeedbackIcon name={t.icon ?? tone.icon} size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13.5px] font-bold leading-tight text-ink">{t.title}</span>
                  <span className={"rounded-md px-1.5 py-0.5 text-[9.5px] font-extrabold tracking-[.06em] " + tone.tag}>{t.tag ?? tone.defaultTag}</span>
                </div>
                {t.description && <p className="mt-0.5 text-[12px] leading-snug text-body">{t.description}</p>}
              </div>
              {t.actionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    t.onAction?.();
                    dismiss(t.id);
                  }}
                  className="shrink-0 rounded-lg px-2 py-1 text-[12.5px] font-bold text-brand transition hover:bg-[#e8f0ff]"
                >
                  {t.actionLabel}
                </button>
              )}
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Tutup pesan" className="flex size-7 shrink-0 items-center justify-center rounded-lg text-faint transition hover:bg-app hover:text-ink">
                <FeedbackIcon name="close" size={15} stroke={2.2} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
