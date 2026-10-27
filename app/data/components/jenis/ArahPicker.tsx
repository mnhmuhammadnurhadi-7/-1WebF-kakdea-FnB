import { ARAH_OPTIONS } from "../shared/constants";

type ArahPickerProps = { value: string; onChange: (v: string) => void };

/** Pilihan "Penanda": Pemasukan / Pengeluaran / Pendataan biasa. */
export function ArahPicker({ value, onChange }: ArahPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold text-ink">
        Penanda <span className="text-bad">*</span>
      </span>
      <div className="flex gap-2">
        {ARAH_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={
              "flex-1 rounded-input border px-3 py-2.5 text-[13px] font-bold transition-colors " +
              (value === o.value ? "border-brand bg-brand/10 text-brand" : "border-line bg-white text-faint hover:text-ink")
            }
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="text-[11.5px] text-faint">
        Pemasukan/Pengeluaran masuk Master Transaksi. Pendataan cuma tersimpan biasa (tanpa nominal/debit/kredit).
      </p>
    </div>
  );
}
