import { Button } from "../ui/Button";

type DataHeaderProps = {
  showActions: boolean;
  hasSelectedJenis: boolean;
  onEditTable: () => void;
  onExport: () => void;
  onAdd: () => void;
};

export function DataHeader({ showActions, hasSelectedJenis, onEditTable, onExport, onAdd }: DataHeaderProps) {
  return (
    <section className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[34px] font-bold leading-[1.15] tracking-[-.03em]">Data transaksi</h1>
        <p className="mt-1.5 max-w-[420px] text-[15px] text-body">Semua catatan keuangan usaha dalam satu tempat.</p>
      </div>
      {showActions && (
        <div className="flex flex-wrap items-center gap-2.5">
          {hasSelectedJenis && (
            <Button variant="outline" onClick={onEditTable}>Edit Table</Button>
          )}
          <Button variant="secondary" icon="download" onClick={onExport}>Export ke Excel</Button>
          <Button icon="plus" onClick={onAdd}>Tambah Transaksi</Button>
        </div>
      )}
    </section>
  );
}
