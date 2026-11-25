"use client";

import { DashboardFrame } from "@/components/layout/DashboardFrame";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

/** Rangka bersama semua halaman dashboard: sidebar + topbar, dan penampung toast untuk pesan sukses/gagal. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const restricted = pathname.startsWith("/dashboard/cms") || pathname.startsWith("/dashboard/users");

  useEffect(() => {
    let active = true;
    api.auth.getMe().then((response) => {
      if (!active) return;
      const userRole = String(response.data?.peran || "ADMIN");
      setRole(userRole);
      if (restricted && userRole !== "SUPER_ADMIN") {
        router.replace("/dashboard/data");
      }
    }).catch(() => {
      if (active) router.replace("/login");
    });
    return () => {
      active = false;
    };
  }, [pathname, restricted, router]);

  const allowed = role !== null && (!restricted || role === "SUPER_ADMIN");
  if (!allowed) return <div className="p-8 text-sm text-slate-500">Memeriksa hak akses…</div>;
  return (
    <ToastProvider>
      <DashboardFrame>{children}</DashboardFrame>
    </ToastProvider>
  );
}
