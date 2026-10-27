/* eslint-disable @typescript-eslint/no-explicit-any */
export type ChipOption = { id: string; label: string };

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "TAMBAH" | "UBAH" | "HAPUS" | string;
export type AuditSource = "AI" | "MANUAL" | string;

export interface AuditLog {
  id: string;
  tanggal: string;
  jam: string;
  sheet: string;
  recordLabel: string;
  action: AuditAction;
  source: AuditSource;
  actor: string;
  detail: string;
  perubahan?: { field: string; sebelum: string; sesudah: string }[];
}

/** Bentuk log mentah dari backend (nama field bisa EN atau ID) — dibiarkan longgar seperti kode aslinya. */
export type RawAuditLog = any;
