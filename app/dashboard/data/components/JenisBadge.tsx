import { Icon } from "./Icon";

/** Badge dua tingkat seperti di Figma: atas = arah (Pemasukan/Pengeluaran), bawah = nama jenis. */
export function JenisBadge({ arah, nama }: { arah?: string; nama: string }) {
  const masuk = arah === "PEMASUKAN";
  return (
    <span className="inline-flex min-w-[150px] flex-col items-center gap-1 text-center">
      <span className={"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[.06em] " + (masuk ? "bg-ok-tint text-ok-text" : "bg-bad-tint text-bad-text")}>
        <Icon name={masuk ? "arrowDown" : "arrowUp"} size={11} stroke={2.6} />
        {masuk ? "Pemasukan" : "Pengeluaran"}
      </span>
      <span className="max-w-36 truncate text-xs font-semibold text-body">{nama}</span>
    </span>
  );
}
