"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { customerApi } from "@/lib/customerApi";
import { CartProvider } from "@/components/customer/CartContext";

const nav = [
  { href: "/customer", label: "Beranda" },
  { href: "/dashboard-customer/pesanan", label: "Pesanan" },
  { href: "/dashboard-customer/profil", label: "Profil" },
];

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!customerApi.isAuthenticated()) {
      router.replace(`/customer/akun?next=${encodeURIComponent(pathname)}`);
      return;
    }
    customerApi.getProfile().then(() => setChecking(false)).catch(() => {
      router.replace(`/customer/akun?next=${encodeURIComponent(pathname)}`);
    });
  }, [pathname, router]);

  if (checking) return <div className="mx-auto max-w-5xl px-5 py-16 text-sm text-slate-500">Memeriksa sesi akun…</div>;

  return (
    <CartProvider>
    <section className="min-h-[65vh] px-5 py-8 sm:px-6 sm:py-12" style={{ backgroundColor: "#FAF8FF" }}>
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[.16em]" style={{ color: "#1E3A8A" }}>Dashboard Customer</p>
          <h1 className="mt-2 text-3xl font-bold" style={{ color: "#131B2E" }}>Akun Saya</h1>
        </div>
        <nav className="mb-6 flex gap-2 border-b pb-4" style={{ borderColor: "#DAE2FD" }} aria-label="Navigasi akun customer">
          {nav.map((item) => {
            const active = item.href === "/customer" ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
            return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className="rounded-full px-5 py-2.5 text-sm font-semibold" style={{ backgroundColor: active ? "#1E3A8A" : "white", color: active ? "white" : "#00236F" }}>{item.label}</Link>;
          })}
        </nav>
        {children}
      </div>
    </section>
    </CartProvider>
  );
}
