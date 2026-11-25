import type { SidebarIconName } from "./SidebarIcon";

export type SidebarMenuItem = { label: string; href: string; icon: SidebarIconName; superAdminOnly?: boolean };

/** Daftar menu sidebar — ubah/tambah menu cukup di sini. */
export const SIDEBAR_MENU: SidebarMenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Data", href: "/dashboard/data", icon: "data" },
  { label: "Asisten AI", href: "/dashboard/ai", icon: "bot" },
  { label: "Riwayat & Audit", href: "/dashboard/audit", icon: "history" },
  { label: "Pengelola Pesanan", href: "/dashboard/orders", icon: "orders" },
  { label: "Kelola Pengguna", href: "/dashboard/users", icon: "users", superAdminOnly: true },
  { label: "CMS System", href: "/dashboard/cms", icon: "cms", superAdminOnly: true },
  { label: "Profil & Pengaturan", href: "/dashboard/profile", icon: "settings" },
];
