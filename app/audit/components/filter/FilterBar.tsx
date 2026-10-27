import { Button } from "../shared/Button";
import { ChipRow } from "./ChipRow";
import { Icon } from "../shared/Icon";
import { Panel } from "../shared/Panel";
import { sheetTabs, sourceTabs } from "../shared/constants";

type FilterBarProps = { sheet: string; onSheet: (id: string) => void; source: string; onSource: (id: string) => void };

export function FilterBar({ sheet, onSheet, source, onSource }: FilterBarProps) {
  return (
    <Panel padding="md" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-full bg-app px-4 py-2.5 text-faint">
          <Icon name="search" size={16} />
          <input
            type="text"
            placeholder="Cari ID audit, deskripsi, nama record, actor…"
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-faint"
          />
        </div>
        <Button variant="outline" icon="calendar">Rentang Tanggal</Button>
        <Button variant="secondary" icon="download">Export Audit</Button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[.1em] text-faint">
            <Icon name="table" size={15} />
            Sheet
          </span>
          <ChipRow options={sheetTabs} value={sheet} onChange={onSheet} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[.1em] text-faint">
            <Icon name="bot" size={15} />
            Sumber
          </span>
          <ChipRow options={sourceTabs} value={source} onChange={onSource} />
        </div>
      </div>
    </Panel>
  );
}
