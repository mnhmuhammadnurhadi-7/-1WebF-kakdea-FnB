import type { ReactNode } from "react";

type PanelProps = { children: ReactNode; className?: string; padding?: "none" | "md" };

export function Panel({ children, className = "", padding = "none" }: PanelProps) {
  return <div className={`rounded-card bg-white shadow-card ${padding === "md" ? "p-5" : ""} ${className}`}>{children}</div>;
}
