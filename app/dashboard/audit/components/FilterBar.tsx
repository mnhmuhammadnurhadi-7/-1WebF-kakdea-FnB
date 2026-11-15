"use client";

import { useState } from "react";
import { Button } from "./Button";
import { ChipRow } from "./ChipRow";
import { Icon } from "./Icon";
import { Panel } from "./Panel";
import { sheetTabs, sourceTabs } from "./constants";

type FilterBarProps = {
  sheet: string;
  onSheet: (id: string) => void;
  source: string;
  onSource: (id: string) => void;
  search: string;
  onSearch: (value: string) => void;
  dateFrom: string;
  onDateFrom: (value: string) => void;
  dateTo: string;
  onDateTo: (value: string) => void;
  activeDateFrom: string;
  activeDateTo: string;
  onApplyDates: () => void;
  onClearDates: () => void;
  dateRangeActive: boolean;
};

export function FilterBar({ sheet, onSheet, source, onSource, search, onSearch, dateFrom, onDateFrom, dateTo, onDateTo, activeDateFrom, activeDateTo, onApplyDates, onClearDates, dateRangeActive }: FilterBarProps) {
  const [dateFormOpen, setDateFormOpen] = useState(false);
  const formatDate = (value: string) => value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "Tanpa batas";
  return (
    <Panel padding="md" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-full bg-app px-4 py-2.5 text-faint">
          <Icon name="search" size={16} />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            aria-label="Cari riwayat audit"
            type="text"
            placeholder="Cari ID audit, deskripsi, nama record, actor…"
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-faint"
          />
        </div>
        <Button variant="outline" icon="calendar" onClick={() => setDateFormOpen((open) => !open)}>Rentang Tanggal</Button>
      </div>

      {dateRangeActive && (
        <div className="flex flex-wrap items-center gap-2 text-xs" aria-live="polite">
          <span className="rounded-full bg-[#e8f0ff] px-3 py-1.5 font-extrabold text-brand">Rentang aktif</span>
          <span className="font-semibold text-body">{formatDate(activeDateFrom)} – {formatDate(activeDateTo)}</span>
        </div>
      )}

      {dateFormOpen && (
        <form onSubmit={(event) => { event.preventDefault(); onApplyDates(); setDateFormOpen(false); }} className="flex flex-wrap items-end gap-3 rounded-xl border border-line-soft bg-app p-4">
          <label className="flex flex-col gap-1 text-xs font-bold text-label">
            Tanggal mulai
            <input type="date" value={dateFrom} max={dateTo || undefined} onChange={(event) => onDateFrom(event.target.value)} className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink" />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold text-label">
            Tanggal akhir
            <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(event) => onDateTo(event.target.value)} className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink" />
          </label>
          <Button type="submit" variant="secondary">Terapkan</Button>
          {dateRangeActive && <Button type="button" variant="outline" onClick={() => { onClearDates(); setDateFormOpen(false); }}>Hapus rentang</Button>}
        </form>
      )}

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
