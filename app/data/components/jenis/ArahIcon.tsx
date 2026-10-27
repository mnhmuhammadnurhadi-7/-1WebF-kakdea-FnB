import { Icon } from "../shared/Icon";

/** Kotak ikon panah di kolom pertama tabel: hijau turun = pemasukan, merah naik = pengeluaran. */
export function ArahIcon({ arah }: { arah?: string }) {
  const masuk = arah === "PEMASUKAN";
  return (
    <span className={"flex size-9 items-center justify-center rounded-xl " + (masuk ? "bg-ok-tint text-ok" : "bg-bad-tint text-bad")}>
      <Icon name={masuk ? "arrowDown" : "arrowUp"} size={16} stroke={2.4} />
    </span>
  );
}
