"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { SojuFigure } from "@/components/status/mascot/SojuMascot";
import { FeedbackIcon } from "./FeedbackIcon";

export type ConfirmOptions = {
  title: string;
  description?: string;
  /** Kotak ringkasan item yang akan dihapus */
  detail?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "brand";
};

type DialogProps = ConfirmOptions & { onConfirm: () => void; onCancel: () => void };

export function ConfirmDialog({ title, description, detail, confirmLabel = "Ya, hapus", cancelLabel = "Batal", tone = "danger", onConfirm, onCancel }: DialogProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onCancel]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="modal-backdrop-enter fixed inset-0 z-[90] flex items-center justify-center bg-navy/45 p-4 backdrop-blur-[3px]" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}>
      <div className="absolute inset-0" onClick={onCancel} aria-hidden="true" />
      <div className="modal-surface relative w-full max-w-[400px] rounded-[26px] bg-white p-6 shadow-[0_30px_80px_rgba(30,58,138,.35)]">
        {/* maskot mengintip dari pojok kanan atas */}
        <div className="pointer-events-none absolute -top-12 right-5 rotate-6">
          <SojuFigure mood="bingung" size={64} />
        </div>

        <span className={"flex size-12 items-center justify-center rounded-2xl " + (tone === "danger" ? "bg-bad-tint text-bad" : "bg-[#e8f0ff] text-brand")}>
          <FeedbackIcon name={tone === "danger" ? "trash" : "info"} size={22} />
        </span>
        <h2 id="confirm-title" className="mt-4 text-[20px] font-bold leading-tight tracking-[-.02em] text-ink">{title}</h2>

        {detail && <div className="mt-3 rounded-xl bg-app px-3.5 py-2.5 text-[12.5px] font-semibold text-ink">{detail}</div>}
        {description && <p className="mt-3 text-[13px] leading-relaxed text-body">{description}</p>}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" autoFocus onClick={onCancel} className="h-11 rounded-xl bg-white text-[13.5px] font-bold text-ink shadow-btn ring-1 ring-line transition hover:bg-app">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={"h-11 rounded-xl text-[13.5px] font-bold text-white transition hover:brightness-110 " + (tone === "danger" ? "bg-bad shadow-[0_8px_20px_rgba(220,38,38,.3)]" : "bg-brand shadow-blue")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Pengganti `window.confirm`: `const { confirm, dialog } = useConfirm();`
 * lalu `if (!(await confirm({ title: "…" }))) return;` dan render `{dialog}` di komponen.
 */
export function useConfirm() {
  const [state, setState] = useState<{ options: ConfirmOptions; resolve: (v: boolean) => void } | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => new Promise<boolean>((resolve) => setState({ options, resolve })), []);

  const finish = (value: boolean) => {
    state?.resolve(value);
    setState(null);
  };

  const dialog = state ? <ConfirmDialog {...state.options} onConfirm={() => finish(true)} onCancel={() => finish(false)} /> : null;

  return { confirm, dialog };
}
