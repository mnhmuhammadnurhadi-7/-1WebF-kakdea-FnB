"use client";

import { Icon } from "../shared/Icon";

type ToastProps = { message: string; onDismiss: () => void };

/** Pesan kesalahan singkat di pojok kanan atas (pengganti Notice global). */
export function Toast({ message, onDismiss }: ToastProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="notice-enter fixed inset-x-4 top-4 z-[70] mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-bad/15 bg-white p-4 text-sm text-ink shadow-pop sm:left-auto sm:right-6 sm:top-6"
    >
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-bad-tint text-bad" aria-hidden="true">
        <Icon name="warn" size={17} />
      </span>
      <p className="flex-1 leading-5">{message}</p>
      <button type="button" onClick={onDismiss} aria-label="Tutup pesan" className="grid size-8 shrink-0 place-items-center rounded-lg text-faint transition-colors hover:bg-app hover:text-ink">
        <Icon name="close" size={16} stroke={2.2} />
      </button>
    </div>
  );
}
