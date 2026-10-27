import { Icon } from "../shared/Icon";

/** Badge dua tingkat seperti di Figma: atas = arah (Pemasukan/Pengeluaran), bawah = nama jenis. */
export function JenisBadge({ arah, nama }: { arah?: string; nama: string }) {
  const masuk = arah === "PEMASUKAN";
  return (
    <span className="inline-flex w-[172px] flex-col overflow-hidden rounded-xl text-center shadow-btn">
      <span className={"flex items-center justify-center gap-1 py-1 text-[10px] font-extrabold uppercase tracking-[.08em] text-white " + (masuk ? "bg-navy" : "bg-bad")}>
        <Icon name={masuk ? "arrowDown" : "arrowUp"} size={11} stroke={2.6} />
        {masuk ? "Pemasukan" : "Pengeluaran"}
      </span>
      <span className={"truncate px-2 py-1.5 text-[10px] font-extrabold uppercase tracking-[.04em] " + (masuk ? "bg-sky-tint text-navy" : "bg-bad-tint text-bad-text")}>{nama}</span>
    </span>
  );
}
