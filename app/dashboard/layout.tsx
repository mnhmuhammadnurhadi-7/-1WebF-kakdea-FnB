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
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    api.auth.getMe().then((response) => {
      const restricted = pathname.startsWith("/dashboard/cms");
      if (restricted && response.data.peran !== "SUPER_ADMIN") router.replace("/dashboard/data");
      else setAllowed(true);
    }).catch(() => router.replace("/login"));
  }, [pathname, router]);
  if (!allowed) return <div className="p-8 text-sm text-slate-500">Memeriksa hak akses…</div>;
  return (
    <ToastProvider>
      <DashboardFrame>{children}</DashboardFrame>
    </ToastProvider>
  );
}
