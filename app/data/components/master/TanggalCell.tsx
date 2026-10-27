export function TanggalCell({ tanggal }: { tanggal: string | number | Date | null | undefined }) {
  if (!tanggal) return <span>-</span>;
  const d = new Date(tanggal);
  const bulan = d.toLocaleDateString("id-ID", { month: "short" });
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="tabular text-[17px] font-extrabold text-ink">{d.getDate()}</span>
      <span className="text-[12px] text-faint">
        {bulan} {d.getFullYear()}
      </span>
    </div>
  );
}
