"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  api,
  type AdminUserRecord,
  type AdminUserRole,
  type CreateAdminUserPayload,
  type UpdateAdminUserPayload,
} from "@/lib/api";
import { useConfirm } from "@/components/feedback/ConfirmDialog";
import { StatePanel } from "@/components/feedback/StatePanel";
import { useToast } from "@/components/feedback/ToastProvider";
import { UserFormModal } from "./UserFormModal";

type RoleFilter = "" | AdminUserRole;
type StatusFilter = "" | "true" | "false";

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "Belum pernah masuk";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function roleLabel(role: AdminUserRole): string {
  return role === "SUPER_ADMIN" ? "Super Admin" : "Admin";
}

export function UsersView() {
  const toast = useToast();
  const { confirm, dialog } = useConfirm();

  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");

  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);

  const [modalState, setModalState] = useState<
    | { open: false }
    | { open: true; mode: "create"; user: null }
    | { open: true; mode: "edit"; user: AdminUserRecord }
  >({ open: false });
  const [submitting, setSubmitting] = useState(false);
  const [busyUserId, setBusyUserId] = useState<number | null>(null);

  // Debounce pencarian agar tidak memicu request di setiap ketikan.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Ambil identitas akun aktif untuk proteksi self-disable & self-role-change.
  useEffect(() => {
    let active = true;
    api.auth
      .getMe()
      .then((res) => {
        if (!active) return;
        const id = Number(res.data?.id);
        if (Number.isInteger(id) && id > 0) {
          setCurrentUserId(id);
        }
      })
      .catch(() => {
        // Guard akses ditangani oleh DashboardLayout.
      });
    return () => {
      active = false;
    };
  }, []);

  // Muat daftar pengguna berdasarkan filter aktif.
  useEffect(() => {
    let active = true;
    api.users
      .getAll({
        search: debouncedSearch || undefined,
        peran: roleFilter || undefined,
        aktif: statusFilter || undefined,
      })
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setUsers(list);
        setLoadError(false);
        setHasLoadedOnce(true);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setLoadError(true);
        setLoading(false);
        const message = err instanceof Error ? err.message : "Gagal memuat daftar pengguna.";
        toast.error("Gagal memuat daftar pengguna", { description: message });
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, roleFilter, statusFilter, reloadTick, toast]);

  const refreshUsers = useCallback(() => {
    setLoading(true);
    setReloadTick((tick) => tick + 1);
  }, []);

  const hasActiveFilters = Boolean(searchInput.trim() || roleFilter || statusFilter);

  const resetFilters = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setRoleFilter("");
    setStatusFilter("");
    setLoading(true);
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const aktifCount = users.filter((item) => item.aktif !== false).length;
    const nonaktifCount = total - aktifCount;
    const superAdminCount = users.filter((item) => item.peran === "SUPER_ADMIN").length;
    return { total, aktifCount, nonaktifCount, superAdminCount };
  }, [users]);

  const handleCreateUser = async (payload: CreateAdminUserPayload) => {
    setSubmitting(true);
    try {
      const response = await api.users.create(payload);
      toast.success("Pengguna berhasil ditambahkan", {
        description:
          response.message ||
          `Akun ${payload.nama} (${roleLabel(payload.peran)}) siap digunakan.`,
      });
      setModalState({ open: false });
      refreshUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal membuat akun pengguna.";
      toast.error("Gagal menambahkan pengguna", { description: message });
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (id: number, payload: UpdateAdminUserPayload) => {
    setSubmitting(true);
    try {
      const response = await api.users.update(id, payload);
      toast.success("Data pengguna diperbarui", {
        description: response.message || "Perubahan akun admin telah disimpan.",
      });
      setModalState({ open: false });
      refreshUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal memperbarui data pengguna.";
      toast.error("Gagal memperbarui pengguna", { description: message });
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: AdminUserRecord) => {
    const isSelf = currentUserId !== null && user.id === currentUserId;
    if (isSelf && user.aktif) {
      toast.error("Aksi tidak diizinkan", {
        description: "Anda tidak dapat menonaktifkan akun sendiri.",
      });
      return;
    }

    const nextActive = !user.aktif;
    const approved = await confirm({
      title: nextActive ? "Aktifkan kembali akun admin?" : "Nonaktifkan akun admin?",
      detail: `${user.nama} (${user.email}) · ${roleLabel(user.peran)}`,
      description: nextActive
        ? "Pengguna ini akan dapat masuk kembali ke dashboard SOJU sesuai perannya."
        : "Pengguna ini tidak akan bisa masuk ke dashboard hingga diaktifkan kembali. Data riwayat audit tetap tersimpan.",
      confirmLabel: nextActive ? "Ya, aktifkan" : "Ya, nonaktifkan",
      cancelLabel: "Batal",
      tone: nextActive ? "brand" : "danger",
    });

    if (!approved) return;

    setBusyUserId(user.id);
    try {
      const response = await api.users.updateStatus(user.id, nextActive);
      toast.success(
        nextActive ? "Akun berhasil diaktifkan" : "Akun berhasil dinonaktifkan",
        {
          description:
            response.message ||
            `${user.nama} kini berstatus ${nextActive ? "Aktif" : "Nonaktif"}.`,
          tag: nextActive ? "AKTIF" : "NONAKTIF",
        },
      );
      refreshUsers();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memperbarui status akun pengguna.";
      toast.error("Gagal mengubah status akun", { description: message });
    } finally {
      setBusyUserId(null);
    }
  };

  const handleTriggerResetPassword = async (user: AdminUserRecord) => {
    if (!user.aktif) {
      toast.error("Akun sedang nonaktif", {
        description: "Aktifkan akun terlebih dahulu sebelum mengirim tautan reset password.",
      });
      return;
    }

    const approved = await confirm({
      title: "Kirim email reset password?",
      detail: `${user.nama} · ${user.email}`,
      description:
        "Sistem akan membuat tautan reset password sekali pakai dan mengirimkannya ke alamat email admin tersebut.",
      confirmLabel: "Ya, kirim email",
      cancelLabel: "Batal",
      tone: "brand",
    });

    if (!approved) return;

    setBusyUserId(user.id);
    try {
      const response = await api.users.resetPassword(user.id);
      toast.success("Email reset password terkirim", {
        description:
          response.message || `Tautan reset password telah dikirim ke ${user.email}.`,
        tag: "TERKIRIM",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengirim email reset password.";
      toast.error("Gagal mengirim reset password", { description: message });
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 page-enter">
      {/* Header Banner SOJU */}
      <section className="relative isolate overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-navy via-navy to-brand px-5 py-6 text-white shadow-navy sm:px-7 sm:py-7 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-28 hidden size-80 rounded-full border-[34px] border-sky/10 xl:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-16 hidden size-56 rounded-full border border-white/10 xl:block"
        />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.17em] text-sky">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-sky" />
              Dapur Soju <span className="font-medium text-white/55">/ Kelola Pengguna</span>
            </p>
            <h1 className="mt-3 text-[28px] font-bold leading-[1.15] tracking-[-.035em] sm:text-[34px]">
              Kelola Pengguna Admin
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
              Atur akun Admin dan Super Admin, kelola status aktif, serta kirim tautan reset password secara aman.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={refreshUsers}
              disabled={loading}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-[13.5px] font-semibold text-white backdrop-blur transition hover:bg-white/15 disabled:opacity-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <path d="M21 3v6h-6" />
              </svg>
              Muat Ulang
            </button>
            <button
              type="button"
              onClick={() => setModalState({ open: true, mode: "create", user: null })}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-[13.5px] font-bold text-navy shadow-btn transition hover:bg-sky-tint"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Tambah Pengguna
            </button>
          </div>
        </div>
      </section>

      {/* Ringkasan KPI */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-[20px] border border-line-soft bg-white p-4 shadow-card sm:p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-[.1em] text-faint">Total Ditampilkan</p>
          <p className="mt-2 text-[28px] font-extrabold leading-none tracking-[-.03em] text-navy tabular">
            {stats.total}
          </p>
          <p className="mt-1.5 text-[12px] text-body">Akun pengelola sistem</p>
        </div>
        <div className="rounded-[20px] border border-line-soft bg-white p-4 shadow-card sm:p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-[.1em] text-faint">Status Aktif</p>
          <p className="mt-2 text-[28px] font-extrabold leading-none tracking-[-.03em] text-ok-text tabular">
            {stats.aktifCount}
          </p>
          <p className="mt-1.5 text-[12px] text-body">Dapat mengakses dashboard</p>
        </div>
        <div className="rounded-[20px] border border-line-soft bg-white p-4 shadow-card sm:p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-[.1em] text-faint">Super Admin</p>
          <p className="mt-2 text-[28px] font-extrabold leading-none tracking-[-.03em] text-brand tabular">
            {stats.superAdminCount}
          </p>
          <p className="mt-1.5 text-[12px] text-body">Hak akses penuh</p>
        </div>
        <div className="rounded-[20px] border border-line-soft bg-white p-4 shadow-card sm:p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-[.1em] text-faint">Nonaktif</p>
          <p className="mt-2 text-[28px] font-extrabold leading-none tracking-[-.03em] text-bad-text tabular">
            {stats.nonaktifCount}
          </p>
          <p className="mt-1.5 text-[12px] text-body">Akses login ditangguhkan</p>
        </div>
      </section>

      {/* Bar Pencarian & Filter */}
      <section className="rounded-[20px] border border-line-soft bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-line bg-field px-3.5 py-2.5 focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/15">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-faint">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                setLoading(true);
              }}
              aria-label="Cari pengguna berdasarkan nama atau email"
              placeholder="Cari nama atau email pengguna…"
              className="w-full bg-transparent text-base text-ink outline-none placeholder:text-faint sm:text-sm"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setDebouncedSearch("");
                  setLoading(true);
                }}
                aria-label="Hapus pencarian"
                className="flex size-6 shrink-0 items-center justify-center rounded-md text-faint hover:bg-app hover:text-ink"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:flex lg:items-center">
            <label className="flex items-center gap-2">
              <span className="sr-only">Filter peran</span>
              <select
                aria-label="Filter peran pengguna"
                value={roleFilter}
                onChange={(event) => {
                  setRoleFilter(event.target.value as RoleFilter);
                  setLoading(true);
                }}
                className="h-11 w-full rounded-xl border border-line bg-field px-3.5 text-base font-medium text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 sm:text-sm lg:w-44"
              >
                <option value="">Semua Peran</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>

            <label className="flex items-center gap-2">
              <span className="sr-only">Filter status</span>
              <select
                aria-label="Filter status akun"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as StatusFilter);
                  setLoading(true);
                }}
                className="h-11 w-full rounded-xl border border-line bg-field px-3.5 text-base font-medium text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 sm:text-sm lg:w-44"
              >
                <option value="">Semua Status</option>
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </label>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-4 text-[13px] font-bold text-ink transition hover:bg-app"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Konten Utama: Error / Loading / Kosong / Tabel & Kartu */}
      {loadError && !hasLoadedOnce ? (
        <StatePanel
          kind="gagal-memuat"
          subject="Daftar pengguna"
          description="Terjadi kendala saat mengambil data akun admin dari server. Silakan coba muat ulang."
          onRetry={refreshUsers}
        />
      ) : loading && !hasLoadedOnce ? (
        <section className="rounded-[20px] border border-line-soft bg-white p-5 shadow-card">
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="skeleton-shimmer h-16 rounded-2xl border border-line-soft"
              />
            ))}
          </div>
        </section>
      ) : users.length === 0 ? (
        <section className="flex flex-col items-center justify-center rounded-[24px] border border-line-soft bg-white px-6 py-14 text-center shadow-card">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-[#e8f0ff] text-brand">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9.5" cy="8.5" r="3" />
              <path d="M3.5 19a6 6 0 0 1 12 0" />
              <circle cx="17" cy="9.5" r="2.2" />
              <path d="M15.5 15.2a4.6 4.6 0 0 1 5 3.8" />
            </svg>
          </span>
          <h2 className="mt-4 text-[18px] font-bold text-ink">
            {hasActiveFilters ? "Pengguna tidak ditemukan" : "Belum ada pengguna admin"}
          </h2>
          <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-body">
            {hasActiveFilters
              ? "Tidak ada akun admin yang cocok dengan kata kunci pencarian atau filter peran dan status saat ini."
              : "Tambahkan akun Admin atau Super Admin pertama untuk mulai mengelola operasional bersama tim."}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center rounded-xl bg-brand px-5 text-[13.5px] font-bold text-white shadow-blue transition hover:bg-brand-hover"
              >
                Reset Filter
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setModalState({ open: true, mode: "create", user: null })}
                className="inline-flex h-11 items-center rounded-xl bg-brand px-5 text-[13.5px] font-bold text-white shadow-blue transition hover:bg-brand-hover"
              >
                Tambah Pengguna
              </button>
            )}
          </div>
        </section>
      ) : (
        <section className="overflow-hidden rounded-[20px] border border-line-soft bg-white shadow-card">
          {/* Tampilan Tabel Desktop */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line-soft bg-app/65 text-[11px] font-extrabold uppercase tracking-[.08em] text-faint">
                  <th className="px-5 py-3.5">Pengguna</th>
                  <th className="px-4 py-3.5">Peran</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Terakhir Masuk</th>
                  <th className="px-4 py-3.5">Dibuat</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft text-[13.5px]">
                {users.map((user) => {
                  const isSelf = currentUserId !== null && user.id === currentUserId;
                  const isBusy = busyUserId === user.id;
                  const disableToggle = isBusy || (isSelf && user.aktif);
                  const disableReset = isBusy || !user.aktif;

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-app/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={
                              "flex size-10 shrink-0 items-center justify-center rounded-xl text-[13px] font-extrabold " +
                              (user.aktif
                                ? "bg-[#e8f0ff] text-brand"
                                : "bg-app text-faint")
                            }
                          >
                            {getInitials(user.nama)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="truncate font-bold text-ink">{user.nama}</span>
                              {isSelf && (
                                <span className="rounded-full bg-[#e8f0ff] px-2 py-0.5 text-[10.5px] font-extrabold text-brand">
                                  Akun Anda
                                </span>
                              )}
                            </div>
                            <p className="truncate text-[12.5px] text-body">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={
                            "inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-bold " +
                            (user.peran === "SUPER_ADMIN"
                              ? "bg-navy text-white"
                              : "bg-sky-tint text-navy")
                          }
                        >
                          {roleLabel(user.peran)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold " +
                            (user.aktif
                              ? "bg-ok-tint text-ok-text"
                              : "bg-bad-tint text-bad-text")
                          }
                        >
                          <span
                            className={
                              "size-1.5 rounded-full " +
                              (user.aktif ? "bg-ok" : "bg-bad")
                            }
                          />
                          {user.aktif ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-[12.5px] text-body tabular">
                        {formatDateTime(user.terakhirMasukPada)}
                      </td>

                      <td className="px-4 py-4 text-[12.5px] text-faint tabular">
                        {formatShortDate(user.dibuatPada)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              setModalState({ open: true, mode: "edit", user })
                            }
                            className="inline-flex h-9 items-center rounded-lg border border-line bg-white px-3 text-[12.5px] font-bold text-ink transition hover:bg-app disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Ubah
                          </button>

                          <button
                            type="button"
                            disabled={disableReset}
                            title={
                              !user.aktif
                                ? "Akun nonaktif tidak dapat menerima email reset password"
                                : "Kirim tautan reset password ke email pengguna"
                            }
                            onClick={() => void handleTriggerResetPassword(user)}
                            className="inline-flex h-9 items-center rounded-lg border border-line bg-white px-3 text-[12.5px] font-bold text-brand transition hover:bg-[#e8f0ff] disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            Reset Password
                          </button>

                          <button
                            type="button"
                            disabled={disableToggle}
                            title={
                              isSelf && user.aktif
                                ? "Anda tidak dapat menonaktifkan akun sendiri"
                                : user.aktif
                                  ? "Nonaktifkan akun ini"
                                  : "Aktifkan kembali akun ini"
                            }
                            onClick={() => void handleToggleStatus(user)}
                            className={
                              "inline-flex h-9 items-center rounded-lg px-3 text-[12.5px] font-bold transition disabled:cursor-not-allowed disabled:opacity-45 " +
                              (user.aktif
                                ? "border border-bad-edge bg-bad-tint text-bad-text hover:bg-bad hover:text-white"
                                : "border border-ok/30 bg-ok-tint text-ok-text hover:bg-ok hover:text-white")
                            }
                          >
                            {user.aktif ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tampilan Kartu Mobile & Tablet (<1024px) */}
          <div className="divide-y divide-line-soft lg:hidden">
            {users.map((user) => {
              const isSelf = currentUserId !== null && user.id === currentUserId;
              const isBusy = busyUserId === user.id;
              const disableToggle = isBusy || (isSelf && user.aktif);
              const disableReset = isBusy || !user.aktif;

              return (
                <article key={user.id} className="flex flex-col gap-3.5 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={
                          "flex size-11 shrink-0 items-center justify-center rounded-xl text-[13.5px] font-extrabold " +
                          (user.aktif ? "bg-[#e8f0ff] text-brand" : "bg-app text-faint")
                        }
                      >
                        {getInitials(user.nama)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="truncate text-[14.5px] font-bold text-ink">
                            {user.nama}
                          </h3>
                          {isSelf && (
                            <span className="rounded-full bg-[#e8f0ff] px-2 py-0.5 text-[10.5px] font-extrabold text-brand">
                              Akun Anda
                            </span>
                          )}
                        </div>
                        <p className="truncate text-[12.5px] text-body">{user.email}</p>
                      </div>
                    </div>

                    <span
                      className={
                        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold " +
                        (user.aktif
                          ? "bg-ok-tint text-ok-text"
                          : "bg-bad-tint text-bad-text")
                      }
                    >
                      <span
                        className={
                          "size-1.5 rounded-full " + (user.aktif ? "bg-ok" : "bg-bad")
                        }
                      />
                      {user.aktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[12px] text-body">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold " +
                        (user.peran === "SUPER_ADMIN"
                          ? "bg-navy text-white"
                          : "bg-sky-tint text-navy")
                      }
                    >
                      {roleLabel(user.peran)}
                    </span>
                    <span className="text-faint">·</span>
                    <span>Masuk terakhir: {formatDateTime(user.terakhirMasukPada)}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => setModalState({ open: true, mode: "edit", user })}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-line bg-white px-3 text-[13px] font-bold text-ink transition hover:bg-app disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Ubah
                    </button>

                    <button
                      type="button"
                      disabled={disableReset}
                      title={
                        !user.aktif
                          ? "Akun nonaktif tidak dapat menerima email reset password"
                          : "Kirim tautan reset password ke email pengguna"
                      }
                      onClick={() => void handleTriggerResetPassword(user)}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-line bg-white px-3 text-[13px] font-bold text-brand transition hover:bg-[#e8f0ff] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Reset Password
                    </button>

                    <button
                      type="button"
                      disabled={disableToggle}
                      title={
                        isSelf && user.aktif
                          ? "Anda tidak dapat menonaktifkan akun sendiri"
                          : user.aktif
                            ? "Nonaktifkan akun ini"
                            : "Aktifkan kembali akun ini"
                      }
                      onClick={() => void handleToggleStatus(user)}
                      className={
                        "inline-flex h-10 items-center justify-center rounded-xl px-3 text-[13px] font-bold transition disabled:cursor-not-allowed disabled:opacity-45 " +
                        (user.aktif
                          ? "border border-bad-edge bg-bad-tint text-bad-text hover:bg-bad hover:text-white"
                          : "border border-ok/30 bg-ok-tint text-ok-text hover:bg-ok hover:text-white")
                      }
                    >
                      {user.aktif ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Modal Tambah / Ubah Pengguna */}
      {modalState.open && (
        <UserFormModal
          mode={modalState.mode}
          initialUser={modalState.user}
          currentUserId={currentUserId}
          submitting={submitting}
          onClose={() => setModalState({ open: false })}
          onCreate={handleCreateUser}
          onUpdate={handleUpdateUser}
        />
      )}

      {/* Dialog Konfirmasi */}
      {dialog}
    </div>
  );
}
