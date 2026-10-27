import type { ReactNode } from "react";

type ContentFieldProps = { label: string; children: ReactNode; strong?: boolean };

/** Satu baris label + nilai, dipisah garis putus-putus. */
export function ContentField({ label, children, strong = true }: ContentFieldProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-dashed border-line py-3.5 last:border-b-0 last:pb-0">
      <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-label">{label}</span>
      <div className={"whitespace-pre-wrap " + (strong ? "text-[15px] font-bold text-ink" : "text-[14.5px] text-ink")}>{children}</div>
    </div>
  );
}
