"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const CloseIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF8FF", fontFamily: "var(--font-plus-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Header - Figma: rgba(0, 35, 111, 0.9) with backdrop blur */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "rgba(0, 35, 111, 0.9)",
          backdropFilter: "blur(12px)",
          boxShadow: "0px 1px 8px 0px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/customer" className="flex items-center gap-4">
              <div className="flex flex-col">
                <span
                  className="text-[18px] font-semibold text-white leading-tight"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  SOJU
                </span>
                <span
                  className="text-[11px] font-semibold text-white uppercase"
                  style={{ letterSpacing: "0.05em" }}
                >
                  KULINER & FROZEN FOOD
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <CustomerNavLink href="/customer" label="Home" activePath="/customer" currentPath={pathname} />
              <CustomerNavLink href="/customer/menu" label="Menu" activePath="/customer/menu" currentPath={pathname} />
              <CustomerNavLink href="/customer/tentang" label="About" activePath="/customer/tentang" currentPath={pathname} />
              <CustomerNavLink href="/customer/kontak" label="Contact" activePath="/customer/kontak" currentPath={pathname} />
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? CloseIcon : MenuIcon}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10" style={{ backgroundColor: "rgba(0, 35, 111, 0.95)" }}>
            <nav className="flex flex-col px-6 py-3 gap-1">
              <CustomerNavLink href="/customer" label="Home" activePath="/customer" currentPath={pathname} onClick={() => setMobileMenuOpen(false)} />
              <CustomerNavLink href="/customer/menu" label="Menu" activePath="/customer/menu" currentPath={pathname} onClick={() => setMobileMenuOpen(false)} />
              <CustomerNavLink href="/customer/tentang" label="About" activePath="/customer/tentang" currentPath={pathname} onClick={() => setMobileMenuOpen(false)} />
              <CustomerNavLink href="/customer/kontak" label="Contact" activePath="/customer/kontak" currentPath={pathname} onClick={() => setMobileMenuOpen(false)} />
            </nav>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main>{children}</main>

      {/* Footer - Figma: #F2F3FF background */}
      <footer style={{ backgroundColor: "#F2F3FF" }} className="py-8 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col gap-8">
            {/* Footer Top */}
            <div className="flex flex-col md:flex-row items-start justify-center gap-5">
              {/* Brand Column */}
              <div className="flex-1">
                <div className="flex flex-col mb-4">
                  <span className="text-[18px] font-semibold leading-tight" style={{ color: "#00236F", letterSpacing: "-0.025em" }}>
                    SOJU
                  </span>
                  <span className="text-[11px] font-semibold uppercase" style={{ color: "#00236F", letterSpacing: "0.05em" }}>
                    KULINER & FROZEN FOOD
                  </span>
                </div>
                <p className="text-[14px] leading-[20px] max-w-xs" style={{ color: "#444651" }}>
                  Sajian kuliner nusantara siap santap dan produk beku berstandar HACCP.
                </p>
              </div>

              {/* Nav Column */}
              <div className="flex-1">
                <h4 className="text-[13px] font-bold uppercase mb-3" style={{ color: "#00236F", letterSpacing: "0.05em" }}>
                  Navigasi
                </h4>
                <div className="flex flex-col gap-2">
                  <Link href="/customer" className="text-[14px] hover:underline" style={{ color: "#444651" }}>Home</Link>
                  <Link href="/customer/menu" className="text-[14px] hover:underline" style={{ color: "#444651" }}>Menu</Link>
                  <Link href="/customer/tentang" className="text-[14px] hover:underline" style={{ color: "#444651" }}>About</Link>
                  <Link href="/customer/kontak" className="text-[14px] hover:underline" style={{ color: "#444651" }}>Contact</Link>
                </div>
              </div>

              {/* Contact Column */}
              <div className="flex-1">
                <h4 className="text-[13px] font-bold uppercase mb-3" style={{ color: "#00236F", letterSpacing: "0.05em" }}>
                  Kontak
                </h4>
                <p className="text-[14px]" style={{ color: "#444651" }}>
                  Hubungi kami via WhatsApp untuk pemesanan
                </p>
              </div>
            </div>

            {/* Footer Bottom */}
            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ backgroundColor: "#FFFFFF", boxShadow: "0px 1px 3px 0px rgba(15, 23, 42, 0.04)" }}
            >
              <span className="text-[13px]" style={{ color: "#757682" }}>
                © 2024 SOJU Corp. All rights reserved.
              </span>
              <span className="text-[13px]" style={{ color: "#757682" }}>
                Powered by SOJU
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface CustomerNavLinkProps {
  href: string;
  label: string;
  activePath: string;
  currentPath: string;
  onClick?: () => void;
}

function CustomerNavLink({ href, label, activePath, currentPath, onClick }: CustomerNavLinkProps) {
  const isActive = currentPath === activePath;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-2 rounded-lg text-[14px] transition-colors"
      style={{
        backgroundColor: isActive ? "#0244FF" : "transparent",
        color: "#FFFFFF",
        fontWeight: isActive ? 400 : 600,
      }}
    >
      {label}
    </Link>
  );
}
