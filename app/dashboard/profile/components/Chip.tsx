const TONES = {
  brand: "bg-[#e8f0ff] text-brand",
  sky: "bg-sky-tint text-navy",
  ok: "bg-ok-tint text-ok-text",
  neutral: "bg-field text-body",
};

export function Chip({ tone = "neutral", children }: { tone?: keyof typeof TONES; children: React.ReactNode }) {
  return <span className={"inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[.05em] " + TONES[tone]}>{children}</span>;
}
