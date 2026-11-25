"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type {
  AdminUserRecord,
  AdminUserRole,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from "@/lib/api";

type UserFormModalProps = {
  mode: "create" | "edit";
  initialUser?: AdminUserRecord | null;
  currentUserId: number | null;
  submitting: boolean;
  onClose: () => void;
  onCreate: (payload: CreateAdminUserPayload) => Promise<void>;
  onUpdate: (id: number, payload: UpdateAdminUserPayload) => Promise<void>;
};

export function UserFormModal({
  mode,
  initialUser,
  currentUserId,
  submitting,
  onClose,
  onCreate,
  onUpdate,
}: UserFormModalProps) {
  const isEdit = mode === "edit" && Boolean(initialUser);
  const isSelf = isEdit && initialUser !== null && initialUser !== undefined && initialUser.id === currentUserId;

  const [nama, setNama] = useState(initialUser?.nama ?? "");
  const [email, setEmail] = useState(initialUser?.email ?? "");
  const [peran, setPeran] = useState<AdminUserRole>(initialUser?.peran ?? "ADMIN");
  const [password, setPassword] = useState("");
  const [sendInvite, setSendInvite] = useState(false);
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

    const trimmedNama = nama.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedNama) {
      setFormError("Nama lengkap wajib diisi.");
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError("Format email tidak valid.");
      return;
    }

    if (!isEdit) {
      if (!sendInvite && password.length < 8) {
        setFormError("Password awal minimal 8 karakter wajib diisi.");
        return;
      }
      if (sendInvite && password.length > 0 && password.length < 8) {
        setFormError("Jika diisi, password awal minimal 8 karakter.");
        return;
      }

      const payload: CreateAdminUserPayload = {
        nama: trimmedNama,
        email: trimmedEmail,
        peran,
        sendInvite,
      };
      if (password.length >= 8) {
        payload.password = password;
      }

      try {
        await onCreate(payload);
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Gagal menambahkan pengguna.");
      }
      return;
    }

    if (!initialUser) return;

    const payload: UpdateAdminUserPayload = {
      nama: trimmedNama,
      email: trimmedEmail,
    };
    if (!isSelf) {
      payload.peran = peran;
    }

    try {
      await onUpdate(initialUser.id, payload);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal memperbarui data pengguna.");
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="modal-backdrop-enter fixed inset-0 z-[85] flex items-center justify-center bg-navy/45 p-4 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
      style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}
    >
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!submitting) onClose();
        }}
        aria-hidden="true"
      />

      <div className="modal-surface relative z-10 max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-[24px] bg-white p-6 shadow-[0_30px_80px_rgba(30,58,138,.32)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f0ff] px-3 py-1 text-[11px] font-bold uppercase tracking-[.08em] text-brand">
              {isEdit ? "Perbarui Akun" : "Akun Baru"}
            </span>
            <h2
              id="user-modal-title"
              className="mt-2.5 text-[22px] font-bold leading-tight tracking-[-.025em] text-ink"
            >
              {isEdit ? "Ubah Data Pengguna" : "Tambah Pengguna Admin"}
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-body">
              {isEdit
                ? "Perbarui nama, email, atau peran akun admin yang dipilih."
                : "Buat akun admin baru untuk mengakses dashboard operasional SOJU."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Tutup modal"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-faint transition hover:bg-app hover:text-ink disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-label">Nama Lengkap</span>
            <input
              type="text"
              required
              value={nama}
              onChange={(event) => setNama(event.target.value)}
              placeholder="Contoh: Rina Kartika"
              disabled={submitting}
              className="h-11 rounded-xl border border-line bg-field px-3.5 text-base text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 disabled:opacity-60 sm:text-sm"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-label">Alamat Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@soju.id"
              disabled={submitting}
              className="h-11 rounded-xl border border-line bg-field px-3.5 text-base text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 disabled:opacity-60 sm:text-sm"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-label">Peran Akses</span>
            <select
              value={peran}
              onChange={(event) => setPeran(event.target.value as AdminUserRole)}
              disabled={submitting || isSelf}
              aria-describedby={isSelf ? "self-role-hint" : undefined}
              className="h-11 rounded-xl border border-line bg-field px-3.5 text-base text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 disabled:cursor-not-allowed disabled:bg-app disabled:text-faint sm:text-sm"
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
            {isSelf ? (
              <span id="self-role-hint" className="text-[12px] font-medium text-faint">
                Anda tidak dapat mengubah peran akun sendiri.
              </span>
            ) : (
              <span className="text-[12px] text-faint">
                Super Admin dapat mengelola pengguna, CMS, dan seluruh pengaturan sistem.
              </span>
            )}
          </label>

          {!isEdit && (
            <>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-app/70 px-3.5 py-3">
                <input
                  type="checkbox"
                  checked={sendInvite}
                  onChange={(event) => setSendInvite(event.target.checked)}
                  disabled={submitting}
                  className="mt-0.5 size-4 rounded border-line accent-brand"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-bold text-ink">Kirim email undangan</span>
                  <span className="text-[12px] leading-snug text-body">
                    Pengguna akan menerima tautan pengaturan password melalui email.
                  </span>
                </span>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-label">
                  Password Awal{" "}
                  <span className="font-medium text-faint">
                    {sendInvite ? "(opsional, minimal 8 karakter jika diisi)" : "(wajib, minimal 8 karakter)"}
                  </span>
                </span>
                <input
                  type="password"
                  required={!sendInvite}
                  minLength={sendInvite ? undefined : 8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={sendInvite ? "Kosongkan untuk password acak sementara" : "Minimal 8 karakter"}
                  disabled={submitting}
                  className="h-11 rounded-xl border border-line bg-field px-3.5 text-base text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 disabled:opacity-60 sm:text-sm"
                />
              </label>
            </>
          )}

          {formError && (
            <div
              role="alert"
              className="rounded-xl border border-bad-edge bg-bad-tint px-3.5 py-2.5 text-[13px] font-semibold text-bad-text"
            >
              {formError}
            </div>
          )}

          <div className="mt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-11 rounded-xl bg-white text-[13.5px] font-bold text-ink shadow-btn ring-1 ring-line transition hover:bg-app disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-xl bg-brand text-[13.5px] font-bold text-white shadow-blue transition hover:bg-brand-hover disabled:opacity-60"
            >
              {submitting
                ? isEdit
                  ? "Menyimpan…"
                  : "Membuat akun…"
                : isEdit
                  ? "Simpan Perubahan"
                  : "Buat Akun"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
