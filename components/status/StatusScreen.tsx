import { StatusScene } from "./mascot/scenes";
import { StatusActions } from "./StatusActions";
import { StatusExtras } from "./StatusExtras";
import { StatusFooter } from "./StatusFooter";
import { StatusHeader } from "./StatusHeader";
import { PRESETS, type StatusKind } from "./presets";

type StatusScreenProps = {
  kind: StatusKind;
  onRetry?: () => void;
  /** Hanya untuk 500: kode kejadian dari Next (error.digest) */
  incidentId?: string;
};

/** Layar status satu halaman (404, 500, 503, 504, 429, offline, maintenance, online) bergaya Figma SOJU. */
export function StatusScreen({ kind, onRetry, incidentId }: StatusScreenProps) {
  const p = PRESETS[kind];
  const { w, alt } = p.scene;

  const chip = (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[10.5px] font-extrabold tracking-[.08em] text-navy shadow-btn">
      <span className={"size-1.5 rounded-full " + p.dot} />
      {p.chip}
      <span className="font-mono text-faint">· {p.code}</span>
    </span>
  );

  const title = (
    <h1 className="text-[52px] font-extrabold leading-none tracking-[-.03em] sm:text-[76px]">
      <span className={p.toneA}>{p.titleA}</span>
      {p.titleB && <span className={p.toneB}> {p.titleB}</span>}
    </h1>
  );

  const mascot = <StatusScene kind={kind} width={w} title={alt} />;

  const text = (align: "center" | "left") => (
    <div className={"flex flex-col gap-4 " + (align === "center" ? "items-center text-center" : "items-start text-left")}>
      <h2 className="max-w-[640px] text-[22px] font-bold leading-snug tracking-[-.02em] text-navy sm:text-[26px]">{p.heading}</h2>
      <p className="max-w-[560px] text-[14px] leading-relaxed text-body">{p.body}</p>
      <StatusExtras extra={p.extra} incidentId={incidentId} />
      <StatusActions primary={p.primary} secondary={p.secondary} onRetry={onRetry} />
    </div>
  );

  return (
    <div className={"relative flex min-h-screen flex-col overflow-hidden " + p.bg} style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}>
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none text-[320px] font-black leading-none tracking-[-.05em] text-black/[.035]">SOJU</span>
      <StatusHeader />

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-6 sm:px-10">
        {p.layout === "center" ? (
          <div className="flex flex-col items-center gap-5 text-center">
            {chip}
            {title}
            {mascot}
            {text("center")}
          </div>
        ) : (
          <div className={"grid w-full max-w-[1100px] items-center gap-10 lg:grid-cols-2 " + (p.layout === "imageLeft" ? "rounded-[28px] bg-white p-8 shadow-card" : "")}>
            {p.layout === "imageLeft" && <div className="flex justify-center">{mascot}</div>}
            <div className="flex flex-col gap-5">
              <div>{chip}</div>
              {title}
              {text("left")}
            </div>
            {p.layout === "textLeft" && <div className="flex justify-center">{mascot}</div>}
          </div>
        )}
      </main>

      <StatusFooter status={p.footerStatus} />
    </div>
  );
}
