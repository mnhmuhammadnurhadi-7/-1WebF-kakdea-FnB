"use client";

import { useState } from "react";
import type { AiCitation, AiDocumentCitation, AiSqlCitation } from "@/lib/api";
import { Icon } from "./Icon";

function isSqlCitation(citation: AiCitation): citation is AiSqlCitation {
  return citation.sourceType === "SQL_TOOL";
}

function formatCitationTag(id: string): string {
  const trimmed = id.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) return trimmed;
  return `[${trimmed}]`;
}

function sourceTypeLabel(sourceType: AiDocumentCitation["sourceType"]): string {
  switch (sourceType) {
    case "SOP":
      return "SOP";
    case "FAQ":
      return "FAQ";
    case "PRODUK":
      return "Katalog Produk";
    case "CMS":
      return "Konten CMS";
    case "MANUAL":
      return "Dokumen Manual";
    default:
      return sourceType;
  }
}

function formatExecutedAt(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type CitationChipsProps = {
  citations: AiCitation[];
};

/** Chip sitasi interaktif [D1]/[SQL-1] yang menampilkan kutipan sumber saat diklik. */
export function CitationChips({ citations }: CitationChipsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!citations || citations.length === 0) return null;

  const selectedCitation = citations.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Sumber sitasi jawaban AI">
        <span className="text-[11px] font-bold uppercase tracking-[.06em] text-faint">Sumber:</span>
        {citations.map((citation) => {
          const active = selectedId === citation.id;
          const sql = isSqlCitation(citation);
          const chipLabel = sql ? citation.label : citation.title;

          return (
            <button
              key={citation.id}
              type="button"
              onClick={() => setSelectedId((prev) => (prev === citation.id ? null : citation.id))}
              aria-expanded={active}
              className={
                "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-bold transition " +
                (active
                  ? sql
                    ? "border-navy bg-navy text-white shadow-btn"
                    : "border-brand bg-brand text-white shadow-blue"
                  : sql
                    ? "border-sky/60 bg-sky-tint text-navy hover:bg-sky-soft"
                    : "border-line bg-white text-ink shadow-btn hover:border-brand/40 hover:bg-app")
              }
            >
              <Icon name={sql ? "database" : "book"} size={12} stroke={2.2} />
              <span className="font-mono">{formatCitationTag(citation.id)}</span>
              <span className="max-w-[180px] truncate font-semibold">{chipLabel}</span>
            </button>
          );
        })}
      </div>

      {selectedCitation && (
        <div
          role="region"
          aria-label={`Detail sumber ${selectedCitation.id}`}
          className="rounded-2xl border border-line bg-white p-3.5 shadow-card"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-md bg-sky-tint px-1.5 py-0.5 font-mono text-[11px] font-extrabold text-navy">
                  {formatCitationTag(selectedCitation.id)}
                </span>
                {isSqlCitation(selectedCitation) ? (
                  <span className="rounded-md bg-ok-tint px-2 py-0.5 text-[10.5px] font-bold text-ok-text">
                    Data Operasional Langsung (SQL)
                  </span>
                ) : (
                  <>
                    <span className="rounded-md bg-[#eef4ff] px-2 py-0.5 text-[10.5px] font-bold text-brand">
                      {sourceTypeLabel(selectedCitation.sourceType)}
                    </span>
                    {selectedCitation.roleScope === "SUPER_ADMIN" && (
                      <span className="rounded-md bg-[#FFF8E6] px-2 py-0.5 text-[10.5px] font-bold text-[#92400E]">
                        Khusus Super Admin
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-faint">
                      Relevansi {Math.round(selectedCitation.score * 100)}%
                    </span>
                  </>
                )}
              </div>

              <h4 className="mt-1.5 text-[13.5px] font-bold text-ink">
                {isSqlCitation(selectedCitation) ? selectedCitation.label : selectedCitation.title}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Tutup kutipan sumber"
              className="flex size-7 shrink-0 items-center justify-center rounded-lg text-faint transition hover:bg-app hover:text-ink"
            >
              <Icon name="close" size={14} stroke={2.2} />
            </button>
          </div>

          {isSqlCitation(selectedCitation) ? (
            <div className="mt-2 space-y-1 text-[12.5px] leading-relaxed text-body">
              <p>{selectedCitation.querySummary}</p>
              <p className="text-[11.5px] text-faint">
                Alat: <span className="font-mono font-semibold text-ink">{selectedCitation.toolName}</span> · Diambil pada{" "}
                {formatExecutedAt(selectedCitation.executedAt)}
              </p>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              <blockquote className="rounded-xl border border-line-soft bg-field px-3 py-2.5 text-[12.5px] leading-relaxed text-body">
                “{selectedCitation.snippet}”
              </blockquote>
              {selectedCitation.sourceRef && (
                <p className="text-[11.5px] text-faint">
                  Referensi: <span className="font-mono font-semibold text-ink">{selectedCitation.sourceRef}</span>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
