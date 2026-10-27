import { Button } from "../ui/Button";
import { Icon } from "../shared/Icon";

type VarianEditorProps = {
  varian: string[];
  draft: string;
  onDraft: (v: string) => void;
  onAdd: () => void;
  onRemove: (name: string) => void;
};

export function VarianEditor({ varian, draft, onDraft, onAdd, onRemove }: VarianEditorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor="cms-varian" className="text-[13px] font-bold text-ink">
          Varian <span className="font-normal text-faint">(opsional)</span>
        </label>
        {varian.length > 0 && <span className="text-[11.5px] text-faint">{varian.length} varian</span>}
      </div>
      {varian.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {varian.map((v) => (
            <li key={v} className="flex items-center gap-1.5 rounded-full bg-sky-tint py-1 pl-3 pr-1.5 text-[13px] font-semibold text-navy">
              <span>{v}</span>
              <button
                type="button"
                onClick={() => onRemove(v)}
                aria-label={`Hapus varian ${v}`}
                className="flex size-5 items-center justify-center rounded-full text-navy/70 hover:bg-white hover:text-navy"
              >
                <Icon name="close" size={12} stroke={2.6} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          id="cms-varian"
          value={draft}
          onChange={(e) => onDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          maxLength={60}
          placeholder="Contoh: Pakai sosis"
          className="h-11 w-full rounded-input border border-transparent bg-field px-4 text-[14px] text-ink transition placeholder:text-faint focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/15"
        />
        <Button variant="outline" onClick={onAdd} disabled={!draft.trim()}>Tambah</Button>
      </div>
      <p className="text-[12px] text-faint">Pelanggan memilih varian lewat dropdown saat memesan. Kosongkan kalau menu ini tidak punya varian.</p>
    </div>
  );
}
