import type { ReactNode } from "react";
import { FeedbackIcon, type FeedbackIconName } from "./FeedbackIcon";

type Tone = "error" | "warn" | "success" | "info";

const TONES: Record<Tone, { wrap: string; tile: string; title: string; icon: FeedbackIconName }> = {
  error: { wrap: "border-bad/20 bg-bad-tint", tile: "text-bad", title: "text-bad-text", icon: "error" },
  warn: { wrap: "border-[#F2D388] bg-[#FFF8E6]", tile: "text-[#B45309]", title: "text-[#92400E]", icon: "warn" },
  success: { wrap: "border-ok/25 bg-ok-tint", tile: "text-ok", title: "text-ok-text", icon: "check" },
  info: { wrap: "border-sky/50 bg-sky-tint", tile: "text-navy", title: "text-navy", icon: "info" },
};

type StateBannerProps = {
  tone?: Tone;
  title: string;
  /** Kode kondisi, mis. ERR-S201 */
  code?: string;
  children?: ReactNode;
  actions?: ReactNode;
};

/** Banner di dalam modal/kartu untuk gagal menyimpan, peringatan duplikat, atau info berhasil. */
export function StateBanner({ tone = "error", title, code, children, actions }: StateBannerProps) {
  const t = TONES[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={"flex gap-3 rounded-2xl border p-3.5 " + t.wrap}>
      <span className={"flex size-9 shrink-0 items-center justify-center rounded-xl bg-white " + t.tile}>
        <FeedbackIcon name={t.icon} size={19} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={"text-[13px] font-bold " + t.title}>{title}</span>
          {code && <span className="rounded-md bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-body">{code}</span>}
        </div>
        {children && <div className="mt-0.5 text-[12.5px] leading-snug text-body">{children}</div>}
        {actions && <div className="mt-2.5 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
