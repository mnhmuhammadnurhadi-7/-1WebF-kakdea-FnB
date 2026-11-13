import { Icon } from "./Icon";

type DataSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DataSearch({ value, onChange }: DataSearchProps) {
  return (
    <div className="relative block w-full max-w-md">
      <Icon name="search" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
      <input
        type="text"
        role="searchbox"
        aria-label="Cari transaksi di Data"
        placeholder="Cari keterangan, jenis, tanggal, atau nominal..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-line bg-field pl-10 pr-10 text-sm text-ink shadow-inset placeholder:text-faint focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
      />
      {value && (
        <button
          type="button"
          aria-label="Hapus pencarian"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-faint hover:bg-app hover:text-navy"
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
}
