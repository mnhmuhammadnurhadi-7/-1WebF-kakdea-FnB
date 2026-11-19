"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContactInfo } from "@/lib/whatsapp";
import { CartProvider, useCart } from "@/components/customer/CartContext";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { customerApi } from "@/lib/customerApi";

const MenuIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const CloseIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const NAV = [
  { href: "/customer", label: "Home" },
  { href: "/customer/menu", label: "Menu" },
  { href: "/customer/tentang", label: "About" },
  { href: "/customer/kontak", label: "Contact" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const contact = useContactInfo();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup menu mobile setiap pindah halaman
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <CartProvider>
    <div
      className="customer-root min-h-screen"
      style={{ backgroundColor: "#FAF8FF", fontFamily: "var(--font-plus-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-[14px] focus:font-semibold"
        style={{ color: "#00236F" }}
      >
        Lewati ke konten
      </a>

      <header
        className="c-header sticky top-0 z-50"
        style={{
          backgroundColor: "rgba(0, 35, 111, 0.94)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: scrolled ? "0px 6px 24px -8px rgba(0, 20, 64, 0.35)" : "0px 1px 0px 0px rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
          <div className="flex h-[72px] items-center justify-between">
            <Link href="/customer" className="flex items-center gap-2.5 rounded-md" aria-label="SOJU, ke beranda">
              <Image src="/soju.png" alt="" width={40} height={40} loading="eager" className="shrink-0 rounded-full object-contain" />
              <span className="flex flex-col">
                <span className="text-[19px] font-bold leading-tight text-white" style={{ letterSpacing: "-0.025em" }}>
                  SOJU
                </span>
                <span className="text-[10.5px] font-semibold uppercase text-white/80" style={{ letterSpacing: "0.06em" }}>
                  Kuliner &amp; Frozen Food
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
              {NAV.map((n) => (
                <CustomerNavLink key={n.href} {...n} currentPath={pathname} />
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <CartHeaderButton />
              <CustomerAccountButton />
              <button
                type="button"
                onClick={() => setMobileMenuOpen((o) => !o)}
                aria-expanded={mobileMenuOpen}
                aria-controls="menu-mobile"
                aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
                className="c-press -mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-white md:hidden"
              >
                {mobileMenuOpen ? CloseIcon : MenuIcon}
              </button>
            </div>
          </div>
        </div>

        <div id="menu-mobile" className="c-mobile-nav md:hidden" data-open={mobileMenuOpen} aria-hidden={!mobileMenuOpen}>
          <div>
            <nav className="flex flex-col gap-1 border-t border-white/10 px-5 py-3" aria-label="Navigasi seluler">
              {NAV.map((n) => (
                <CustomerNavLink key={n.href} {...n} currentPath={pathname} tabbable={mobileMenuOpen} block />
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main id="konten">{children}</main>

      <footer style={{ backgroundColor: "#F2F3FF" }} className="px-5 pb-8 pt-12 sm:px-6">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1.2fr]">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <span className="text-[19px] font-bold leading-tight" style={{ color: "#00236F", letterSpacing: "-0.025em" }}>
                  SOJU
                </span>
                <span className="text-[10.5px] font-semibold uppercase" style={{ color: "#00236F", letterSpacing: "0.06em" }}>
                  Kuliner &amp; Frozen Food
                </span>
              </div>
              <p className="max-w-xs text-[14px] leading-[22px]" style={{ color: "#444651" }}>
                Sajian kuliner nusantara siap santap dan produk beku berstandar HACCP.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[14px] font-bold" style={{ color: "#00236F" }}>
                Navigasi
              </h4>
              <div className="flex flex-col gap-2">
                {NAV.map((n) => (
                  <Link key={n.href} href={n.href} className="w-fit text-[14px] underline-offset-4 hover:underline" style={{ color: "#444651" }}>
                    {n.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[14px] font-bold" style={{ color: "#00236F" }}>
                Kontak
              </h4>
              <div className="flex flex-col gap-2 text-[14px]" style={{ color: "#444651" }}>
                <a href={`https://wa.me/${contact.waNumber}`} target="_blank" rel="noopener noreferrer" className="w-fit underline-offset-4 hover:underline">
                  {contact.telepon} (WhatsApp)
                </a>
                <a href={`mailto:${contact.email}`} className="w-fit underline-offset-4 hover:underline">
                  {contact.email}
                </a>
                <p className="whitespace-pre-line leading-[22px]">{contact.alamat}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 text-[13px]" style={{ borderColor: "#DAE2FD", color: "#757682" }}>
            © {new Date().getFullYear()} SOJU Corp. Seluruh hak dilindungi.
          </div>
        </div>
      </footer>
      <CartDrawer />
    </div>
    </CartProvider>
  );
}

function CartHeaderButton() {
  const { itemCount, openCart } = useCart();
  return (
    <button type="button" onClick={openCart} aria-label={`Buka keranjang, ${itemCount} item`} className="relative inline-flex h-10 items-center gap-2 rounded-full border border-white/30 px-3 text-sm font-semibold text-white hover:bg-white/10">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6" />
        <circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" />
      </svg>
      <span className="hidden sm:inline">Keranjang</span>
      {itemCount > 0 && <span className="min-w-5 rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold text-[#00236F]" style={{ backgroundColor: "#82F5C1" }}>{itemCount}</span>}
    </button>
  );
}

function CustomerAccountButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => setSignedIn(customerApi.isAuthenticated()), [pathname]);
  return (
    <button
      type="button"
      onClick={() => router.push(signedIn ? "/dashboard-customer/profil" : "/customer/akun?next=%2Fdashboard-customer%2Fprofil")}
      aria-label={signedIn ? "Buka profil customer" : "Masuk atau daftar customer"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    </button>
  );
}

interface CustomerNavLinkProps {
  href: string;
  label: string;
  currentPath: string;
  block?: boolean;
  tabbable?: boolean;
}

function CustomerNavLink({ href, label, currentPath, block, tabbable = true }: CustomerNavLinkProps) {
  const isActive = currentPath === href;

  return (
    <Link
      href={href}
      tabIndex={tabbable ? undefined : -1}
      aria-current={isActive ? "page" : undefined}
      className={`${block ? "flex" : "inline-flex"} items-center rounded-lg px-4 py-2.5 text-[14px] font-semibold text-white transition-[background-color,opacity] duration-200 ease-out ${
        isActive ? "" : "opacity-85 hover:bg-white/10 hover:opacity-100"
      }`}
      style={{ backgroundColor: isActive ? "#0244FF" : undefined }}
    >
      {label}
    </Link>
  );
}
