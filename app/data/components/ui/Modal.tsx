"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon, type IconName } from "../shared/Icon";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  /** Teks kecil biru di atas judul, mis. "CATATAN BARU" */
  eyebrow?: string;
  icon?: IconName;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
};

export function Modal({ open, onClose, title, subtitle, eyebrow, icon, children, footer, width = 480 }: ModalProps) {
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
      className="modal-backdrop-enter fixed inset-0 z-50 flex items-end justify-center bg-navy/45 backdrop-blur-[3px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div onClick={onClose} aria-hidden="true" className="absolute inset-0" />
      <div
        className="modal-surface relative z-10 flex max-h-[min(92dvh,48rem)] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_30px_80px_rgba(30,58,138,.35)] sm:rounded-[28px]"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={subtitle ? "modal-subtitle" : undefined}
        style={{ width: "100%", maxWidth: `${width}px` }}
      >
        {(title || subtitle) && (
          <div className="relative flex items-start gap-4 border-b border-line-soft px-6 pb-5 pt-6">
            {icon && (
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-blue">
                <Icon name={icon} size={22} stroke={2} />
              </span>
            )}
            <div className="flex min-w-0 flex-col gap-0.5 pr-12">
              {eyebrow && <span className="text-[11px] font-extrabold uppercase tracking-[.12em] text-brand">{eyebrow}</span>}
              {title && (
                <h2 id="modal-title" className="text-[22px] font-bold leading-tight tracking-[-.03em] text-ink">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p id="modal-subtitle" className="text-[13px] text-body">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-xl bg-white text-ink shadow-btn transition hover:bg-app"
            >
              <Icon name="close" size={16} stroke={2.2} />
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">{children}</div>

        {footer && <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-line-soft px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
