import { Icon } from "../shared/Icon";
import { TIPE_DATA_OPTIONS, emptyColumn } from "../shared/constants";
import { Field } from "../ui/Field";
import type { ColumnDraft } from "../shared/types";

type ColumnBuilderProps = { columns: ColumnDraft[]; onChange: (cols: ColumnDraft[]) => void };

// Builder kolom custom dipakai bareng di "Buat Jenis Baru" & "Buat Tabel Bebas"
export function ColumnBuilder({ columns, onChange }: ColumnBuilderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <span className="text-[13px] font-bold text-ink">Kolom Tabel (Opsional)</span>
        <span className="text-[11.5px] text-faint">Bisa ditambah sesuai kebutuhan</span>
      </div>

      {columns.map((c, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Field
              label="Nama Kolom"
              hideLabel
              placeholder="Nama Kolom"
              className="min-w-0 flex-1"
              value={c.namaKolom}
              onChange={(v) => onChange(columns.map((col, i) => (i === idx ? { ...col, namaKolom: v } : col)))}
            />
            <Field
              label="Tipe"
              hideLabel
              type="select"
              className="w-[150px] shrink-0"
              value={c.tipeData}
              onChange={(v) => onChange(columns.map((col, i) => (i === idx ? { ...col, tipeData: v } : col)))}
              options={TIPE_DATA_OPTIONS}
            />
            {columns.length > 1 && (
              <button
                type="button"
                aria-label="Hapus kolom ini"
                className="flex size-9 shrink-0 items-center justify-center rounded-xl text-faint transition hover:bg-bad-tint hover:text-bad"
                onClick={() => onChange(columns.filter((_, i) => i !== idx))}
              >
                <Icon name="trash" size={16} stroke={2} />
              </button>
            )}
          </div>
          {c.tipeData === "DROPDOWN" && (
            <Field
              label="Opsi Dropdown (pisah koma)"
              hideLabel
              placeholder="Opsi Dropdown (pisah koma)"
              value={c.opsiDropdown}
              onChange={(v) => onChange(columns.map((col, i) => (i === idx ? { ...col, opsiDropdown: v } : col)))}
            />
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...columns, emptyColumn()])}
        className="flex h-11 items-center justify-center gap-2 rounded-input border border-dashed border-brand/40 text-[13px] font-bold text-brand transition hover:bg-brand/5"
      >
        <Icon name="plus" size={16} stroke={2.2} />
        Tambah Kolom
      </button>
    </div>
  );
}
