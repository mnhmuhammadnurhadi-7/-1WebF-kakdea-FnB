import { DashboardFrame } from "@/components/layout/DashboardFrame";
import { ToastProvider } from "@/components/feedback/ToastProvider";

/** Rangka bersama semua halaman dashboard: sidebar + topbar, dan penampung toast untuk pesan sukses/gagal. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <DashboardFrame>{children}</DashboardFrame>
    </ToastProvider>
  );
}
