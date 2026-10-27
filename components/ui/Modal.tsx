"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 480,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="modal-backdrop-enter fixed inset-0 z-50 flex items-end justify-center bg-ink/50 backdrop-blur-[1px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div onClick={onClose} aria-hidden="true" className="absolute inset-0" />
      <div
        className="modal-surface relative z-10 flex max-h-[min(92dvh,48rem)] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-card-hover sm:rounded-3xl"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={subtitle ? "modal-subtitle" : undefined}
        style={{
          width: `100%`,
          maxWidth: `${width}px`,
        }}
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between gap-4 px-4 pb-4 pt-5 sm:px-6 sm:pt-6">
            <div className="flex flex-col gap-1">
              {title && (
                <h2 id="modal-title" className="font-heading text-[22px] font-semibold text-ink">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p id="modal-subtitle" className="text-[13px] text-muted">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-border/60 hover:text-ink transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-4 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
