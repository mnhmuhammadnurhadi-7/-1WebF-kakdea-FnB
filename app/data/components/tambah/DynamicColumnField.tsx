import { Field } from "../ui/Field";
import type { Kolom } from "../shared/types";

type DynamicColumnFieldProps = { kolom: Kolom; value: string; onChange: (v: string) => void };

// Field dinamis satu kolom custom - dipakai form Tambah Transaksi, Edit, & baris Tabel Bebas
export function DynamicColumnField({ kolom, value, onChange }: DynamicColumnFieldProps) {
  const type = kolom.tipeData === "ANGKA" ? "number" : kolom.tipeData === "TANGGAL" ? "date" : kolom.tipeData === "DROPDOWN" ? "select" : "text";
  return (
    <Field
      label={kolom.namaKolom}
      type={type}
      value={value}
      onChange={onChange}
      options={kolom.tipeData === "DROPDOWN" ? (kolom.opsiDropdown || []).map((o: string) => ({ value: o, label: o })) : undefined}
    />
  );
}
