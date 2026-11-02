"use client";

import Link from "next/link";
import type { StatusAction } from "./presets";

type StatusActionsProps = {
  primary: StatusAction;
  secondary?: StatusAction;
  onRetry?: () => void;
};

const PRIMARY = "inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-[13.5px] font-bold text-white shadow-blue transition hover:brightness-110";
const SECONDARY = "inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-[13.5px] font-bold text-ink shadow-btn transition hover:bg-app";

function Action({ action, className, onRetry }: { action: StatusAction; className: string; onRetry?: () => void }) {
  if (action.kind === "link") {
    return <Link href={action.href} className={className}>{action.label}</Link>;
  }
  if (action.kind === "back") {
    return <button type="button" className={className} onClick={() => window.history.back()}>{action.label}</button>;
  }
  return (
    <button type="button" className={className} onClick={() => (onRetry ? onRetry() : window.location.reload())}>
      {action.label}
    </button>
  );
}

export function StatusActions({ primary, secondary, onRetry }: StatusActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Action action={primary} className={PRIMARY} onRetry={onRetry} />
      {secondary && <Action action={secondary} className={SECONDARY} onRetry={onRetry} />}
    </div>
  );
}
