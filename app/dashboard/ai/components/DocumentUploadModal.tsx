"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { AiRoleScope, AiUploadDocumentPayload, ManualAiSourceType } from "@/lib/api";
import { StateBanner } from "@/components/feedback/StateBanner";
import { Button } from "./Button";
import { Icon } from "./Icon";

type DocumentUploadModalProps = {
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: AiUploadDocumentPayload) => Promise<void>;
};

const SOURCE_TYPE_OPTIONS: { value: ManualAiSourceType; label: string }[] = [
  { value: "SOP", label: "SOP Operasional" },
  { value: "FAQ", label: "FAQ / Pertanyaan Umum" },
  { value: "MANUAL", label: "Panduan / Dokumen Manual" },
];

const ROLE_SCOPE_OPTIONS: { value: AiRoleScope; label: string; hint: string }[] = [
  {
    value: "ALL_ADMIN",
    label: "Semua Admin & Super Admin",
    hint: "Dapat diakses oleh seluruh admin operasional.",
  },
  {
    value: "SUPER_ADMIN",
    label: "Khusus Super Admin",
    hint: "Hanya dipakai saat Super Admin bertanya ke AI.",
  },
];

/** Modal khusus SUPER_ADMIN untuk mengunggah & mengindeks dokumen SOP/FAQ/Manual ke basis pengetahuan AI. */
export function DocumentUploadModal({ submitting, onClose, onSubmit }: DocumentUploadModalProps) {
  const [title, setTitle] = useState("");
  const [sourceType, setSourceType] = useState<ManualAiSourceType>("SOP");
  const [roleScope, setRoleScope] = useState<AiRoleScope>("ALL_ADMIN");
  const [sourceRef, setSourceRef] = useState("");
  const [content, setContent] = useState("");
  const [rejectOnPii, setRejectOnPii] = useState(true);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, submitting]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const trimmedRef = sourceRef.trim();

    if (!trimmedTitle) {
      setFormError("Judul dokumen wajib diisi.");
      return;
    }
    if (trimmedContent.length < 20) {
      setFormError("Konten dokumen minimal 20 karakter agar dapat diindeks dengan baik.");
      return;
    }

    try {
      await onSubmit({
        title: trimmedTitle,
        sourceType,
        roleScope,
        sourceRef: trimmedRef.length > 0 ? trimmedRef : null,
        content: trimmedContent,
        rejectOnPii,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal mengunggah dokumen ke basis pengetahuan AI.");
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/35 p-4 backdrop-blur-[2px]"
      onClick={() => {
        if (!submitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-upload-doc-title"
        className="w-full max-w-[560px] overflow-hidden rounded-[24px] bg-white shadow-pop ring-1 ring-line-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line-soft px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#eef4ff] text-brand">
              <Icon name="upload" size={19} stroke={2.1} />
            </span>
            <div>
              <h2 id="ai-upload-doc-title" className="text-[18px] font-bold tracking-[-.02em] text-ink">
                Unggah Dokumen Pengetahuan AI
              </h2>
              <p className="text-[12.5px] text-body">
                Dokumen akan dipecah dan diindeks otomatis untuk Hybrid RAG SOJU.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Tutup modal unggah dokumen"
            className="flex size-8 items-center justify-center rounded-xl text-faint transition hover:bg-app hover:text-ink disabled:opacity-50"
          >
            <Icon name="close" size={16} stroke={2.2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(100dvh-10rem)] space-y-4 overflow-y-auto px-6 py-5">
          {formError && <StateBanner title="Dokumen belum dapat disimpan">{formError}</StateBanner>}

          <div>
            <label htmlFor="ai-doc-title" className="mb-1.5 block text-[12.5px] font-bold text-label">
              Judul Dokumen <span className="text-bad">*</span>
            </label>
            <input
              id="ai-doc-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              placeholder="Contoh: SOP Retur & Penanganan Komplain Pelanggan"
              className="w-full rounded-xl border border-line bg-field px-3.5 py-2.5 text-[16px] text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15 sm:text-[14px]"
            />
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label htmlFor="ai-doc-source-type" className="mb-1.5 block text-[12.5px] font-bold text-label">
                Jenis Dokumen
              </label>
              <select
                id="ai-doc-source-type"
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as ManualAiSourceType)}
                disabled={submitting}
                className="w-full rounded-xl border border-line bg-field px-3.5 py-2.5 text-[16px] text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15 sm:text-[14px]"
              >
                {SOURCE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ai-doc-role-scope" className="mb-1.5 block text-[12.5px] font-bold text-label">
                Cakupan Akses Peran
              </label>
              <select
                id="ai-doc-role-scope"
                value={roleScope}
                onChange={(e) => setRoleScope(e.target.value as AiRoleScope)}
                disabled={submitting}
                className="w-full rounded-xl border border-line bg-field px-3.5 py-2.5 text-[16px] text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15 sm:text-[14px]"
              >
                {ROLE_SCOPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="ai-doc-ref" className="mb-1.5 block text-[12.5px] font-bold text-label">
              Referensi Dokumen <span className="font-normal text-faint">(opsional)</span>
            </label>
            <input
              id="ai-doc-ref"
              type="text"
              value={sourceRef}
              onChange={(e) => setSourceRef(e.target.value)}
              disabled={submitting}
              placeholder="Contoh: SOP-OPS-004 atau Panduan-Kasir-v2"
              className="w-full rounded-xl border border-line bg-field px-3.5 py-2.5 text-[16px] text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15 sm:text-[14px]"
            />
          </div>

          <div>
            <label htmlFor="ai-doc-content" className="mb-1.5 block text-[12.5px] font-bold text-label">
              Isi Dokumen <span className="text-bad">*</span>
            </label>
            <textarea
              id="ai-doc-content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={submitting}
              placeholder="Tulis atau tempel isi SOP, FAQ, atau panduan operasional di sini (jangan masukkan email, nomor telepon, atau alamat pribadi pelanggan)..."
              className="w-full resize-y rounded-xl border border-line bg-field px-3.5 py-2.5 text-[16px] leading-relaxed text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15 sm:text-[14px]"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-line-soft bg-field/80 p-3">
            <input
              type="checkbox"
              checked={rejectOnPii}
              onChange={(e) => setRejectOnPii(e.target.checked)}
              disabled={submitting}
              className="mt-0.5 size-4 rounded border-line accent-brand"
            />
            <span className="text-[12.5px] leading-snug text-body">
              <strong className="font-bold text-ink">Tolak otomatis jika ada data pribadi (PII)</strong>
              <br />
              Mencegah email, nomor telepon, atau NIK pelanggan masuk ke indeks pengetahuan AI.
            </span>
          </label>

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line-soft pt-4">
            <Button variant="secondary" size="sm" onClick={onClose} disabled={submitting}>
              Batal
            </Button>
            <Button type="submit" size="sm" icon="upload" disabled={submitting}>
              {submitting ? "Mengunggah & Mengindeks..." : "Simpan & Indeks Dokumen"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
