"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProductVisual } from "@/components/customer/ProductVisual";
import { ChevronDownIcon, CloseIcon, MinusIcon, PlusIcon, WhatsAppIcon } from "@/components/customer/icons";
import { buildOrderMessage, openWhatsApp, parseVarian } from "@/lib/whatsapp";

interface OrderModalProps {
  product: any | null;
  waNumber: string;
  onClose: () => void;
}

const EXIT_MS = 200;
const MAX_QTY = 99;

export function OrderModal({ product, waNumber, onClose }: OrderModalProps) {
  if (typeof document === "undefined" || !product) return null;
  // key = id supaya form (varian/jumlah/catatan) selalu mulai bersih untuk tiap menu.
  return createPortal(<OrderSheet key={product.id} product={product} waNumber={waNumber} onClose={onClose} />, document.body);
}

function OrderSheet({ product, waNumber, onClose }: { product: any; waNumber: string; onClose: () => void }) {
  const varianList = useMemo(() => parseVarian(product.varian), [product.varian]);
  const hasVarian = varianList.length > 0;

  const [varian, setVarian] = useState("");
  const [jumlah, setJumlah] = useState(1);
  const [qtyText, setQtyText] = useState("1");
  const [catatan, setCatatan] = useState("");
  const [varianError, setVarianError] = useState(false);
  const [closing, setClosing] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<Element | null>(null);
  const uid = useId();

  const price = Number(product.hargaDefault || 0);
  const total = price * jumlah;

  // onClose disimpan di ref: parent boleh re-render (mis. hero auto-slide) tanpa mengganggu fokus/animasi.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  const closingRef = useRef(false);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    window.setTimeout(() => onCloseRef.current(), EXIT_MS);
  }, []);

  /* Kunci scroll, fokus awal, Escape, dan jebakan fokus (Tab) selama modal terbuka. */
  useEffect(() => {
    returnFocusRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        requestClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), select, textarea, input, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      (returnFocusRef.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, [requestClose]);

  const setQty = (n: number) => {
    const clamped = Math.min(MAX_QTY, Math.max(1, Math.round(n) || 1));
    setJumlah(clamped);
    setQtyText(String(clamped));
  };

  const handleOrder = () => {
    if (hasVarian && !varian) {
      setVarianError(true);
      selectRef.current?.focus();
      return;
    }
    openWhatsApp(
      waNumber,
      buildOrderMessage({ nama: product.namaBarang, varian: varian || undefined, jumlah, catatan })
    );
  };

  const fieldStyle: React.CSSProperties = { borderColor: "#DAE2FD", color: "#131B2E", backgroundColor: "#FFFFFF" };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6 ${closing ? "c-backdrop-out" : "c-backdrop-in"}`}
      style={{ backgroundColor: "rgba(0, 20, 64, 0.5)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        className={`relative flex max-h-[94dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[28px] bg-white sm:max-h-[90dvh] sm:rounded-[28px] ${closing ? "c-sheet-out" : "c-sheet-in"}`}
        style={{ boxShadow: "0 24px 64px -16px rgba(0, 35, 111, 0.35)" }}
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={requestClose}
          aria-label="Tutup"
          className="c-press absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.92)", color: "#00236F", boxShadow: "0 1px 6px rgba(0,0,0,0.15)" }}
        >
          {CloseIcon}
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="aspect-[16/10] w-full shrink-0 sm:aspect-[16/9]" style={{ backgroundColor: "#F2F3FF" }}>
            <ProductVisual src={product.gambar} alt={product.namaBarang} eager />
          </div>

          <div className="flex flex-col gap-5 px-5 pb-5 pt-5 sm:px-6">
            <div className="flex flex-col gap-1.5">
              <h2
                id={`${uid}-title`}
                className="text-[24px] font-bold leading-tight"
                style={{ color: "#131B2E", letterSpacing: "-0.02em" }}
              >
                {product.namaBarang}
              </h2>
              <p className="flex items-baseline gap-2">
                <span className="text-[22px] font-bold" style={{ color: "#00236F" }}>
                  Rp {price.toLocaleString("id-ID")}
                </span>
                {product.satuan && (
                  <span className="text-[14px]" style={{ color: "#757682" }}>
                    / {product.satuan}
                  </span>
                )}
              </p>
              {product.deskripsi && (
                <p className="mt-1 text-[14px] leading-[22px]" style={{ color: "#444651" }}>
                  {product.deskripsi}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {hasVarian && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`${uid}-varian`} className="text-[13px] font-semibold" style={{ color: "#131B2E" }}>
                    Varian
                  </label>
                  <div className="relative">
                    <select
                      id={`${uid}-varian`}
                      ref={selectRef}
                      value={varian}
                      onChange={(e) => {
                        setVarian(e.target.value);
                        setVarianError(false);
                      }}
                      aria-invalid={varianError}
                      aria-describedby={varianError ? `${uid}-varian-err` : undefined}
                      className="c-field h-12 w-full appearance-none rounded-xl border pl-4 pr-11 text-[15px]"
                      style={{ ...fieldStyle, borderColor: varianError ? "#BA1A1A" : "#DAE2FD", color: varian ? "#131B2E" : "#757682" }}
                    >
                      <option value="">Pilih varian</option>
                      {varianList.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "#757682" }}>
                      {ChevronDownIcon}
                    </span>
                  </div>
                  {varianError && (
                    <p id={`${uid}-varian-err`} role="alert" className="text-[12.5px]" style={{ color: "#BA1A1A" }}>
                      Pilih varian dulu sebelum memesan.
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <label htmlFor={`${uid}-qty`} className="text-[13px] font-semibold" style={{ color: "#131B2E" }}>
                  Jumlah
                </label>
                <div className="flex items-center rounded-full border" style={{ borderColor: "#DAE2FD" }}>
                  <button
                    type="button"
                    onClick={() => setQty(jumlah - 1)}
                    disabled={jumlah <= 1}
                    aria-label="Kurangi jumlah"
                    className="c-press flex h-11 w-11 items-center justify-center rounded-full disabled:opacity-35"
                    style={{ color: "#00236F" }}
                  >
                    {MinusIcon}
                  </button>
                  <input
                    id={`${uid}-qty`}
                    inputMode="numeric"
                    value={qtyText}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setQtyText(digits);
                      if (digits) setJumlah(Math.max(1, Number(digits)));
                    }}
                    onBlur={() => setQty(Number(qtyText))}
                    className="h-11 w-12 bg-transparent text-center text-[16px] font-semibold tabular-nums outline-none"
                    style={{ color: "#131B2E" }}
                  />
                  <button
                    type="button"
                    onClick={() => setQty(jumlah + 1)}
                    disabled={jumlah >= MAX_QTY}
                    aria-label="Tambah jumlah"
                    className="c-press flex h-11 w-11 items-center justify-center rounded-full disabled:opacity-35"
                    style={{ color: "#00236F" }}
                  >
                    {PlusIcon}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-note`} className="flex items-baseline justify-between text-[13px] font-semibold" style={{ color: "#131B2E" }}>
                  <span>
                    Catatan <span className="font-normal" style={{ color: "#757682" }}>(opsional)</span>
                  </span>
                  <span className="text-[12px] font-normal tabular-nums" style={{ color: "#757682" }}>
                    {catatan.length}/200
                  </span>
                </label>
                <textarea
                  id={`${uid}-note`}
                  rows={2}
                  maxLength={200}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: tanpa saus, dikirim sore"
                  className="c-field w-full resize-none rounded-xl border px-4 py-3 text-[15px] leading-[22px]"
                  style={fieldStyle}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t px-5 py-4 sm:px-6" style={{ borderColor: "#E2E7FF", backgroundColor: "#FFFFFF" }}>
          <div className="flex items-baseline justify-between">
            <span className="text-[13px]" style={{ color: "#757682" }}>
              Perkiraan total
            </span>
            <span className="text-[18px] font-bold tabular-nums" style={{ color: "#00236F" }}>
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>
          <button
            type="button"
            onClick={handleOrder}
            className="c-press inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            {WhatsAppIcon}
            Pesan via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
