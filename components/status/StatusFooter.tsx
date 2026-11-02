export function StatusFooter({ status }: { status: string }) {
  return (
    <footer className="relative z-10 flex flex-wrap items-center justify-between gap-2 px-6 py-4 text-[10px] font-semibold tracking-[.04em] text-faint sm:px-10">
      <span className="font-mono">
        <span className="text-bad">{status}</span> &nbsp; NODE: ID-JKT-SRV04
      </span>
      <span>© 2026 SOJU Indonesia Logistics &amp; Frozen Supply. Hak Cipta Dilindungi.</span>
    </footer>
  );
}
