"use client";

import { useState } from "react";
import { PageHeader } from "@/components/customer/PageHeader";
import { WhatsAppIcon } from "@/components/customer/icons";
import { openWhatsApp, useContactInfo } from "@/lib/whatsapp";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const PhoneIcon = (
  <svg {...iconProps}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const EmailIcon = (
  <svg {...iconProps}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const MapPinIcon = (
  <svg {...iconProps}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "#EAEDFF", color: "#00236F" }}>
        {icon}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5 pt-0.5">
        <span className="text-[13px] font-semibold" style={{ color: "#757682" }}>
          {label}
        </span>
        {children}
      </div>
    </div>
  );
}

const fieldClass = "c-field w-full rounded-xl border px-4 py-3 text-[15px]";
const fieldStyle: React.CSSProperties = { borderColor: "#DAE2FD", color: "#131B2E", backgroundColor: "#FFFFFF" };

export default function CustomerKontakPage() {
  const contact = useContactInfo();
  const [formData, setFormData] = useState({ nama: "", email: "", pesan: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Halo SOJU, saya ${formData.nama.trim()}.\n\n${formData.pesan.trim()}\n\nEmail: ${formData.email.trim()}`;
    openWhatsApp(contact.waNumber, message);
    setFormData({ nama: "", email: "", pesan: "" });
  };

  return (
    <>
      <PageHeader
        title="Hubungi Kami"
        description="Kami siap melayani kebutuhan pesanan siap santap, kemasan beku, hampers, maupun katering pesta Anda."
      />

      <section className="pb-16 pt-4" style={{ backgroundColor: "#FAF8FF" }}>
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl bg-white p-7 sm:p-8" style={{ border: "1px solid #E2E7FF" }}>
                <h2 className="mb-6 text-[21px] font-bold" style={{ color: "#00236F", letterSpacing: "-0.015em" }}>
                  Informasi kontak
                </h2>
                <div className="flex flex-col gap-6">
                  <InfoRow icon={PhoneIcon} label="Telepon & WhatsApp">
                    <a
                      href={`tel:${contact.telepon.replace(/\s+/g, "")}`}
                      className="text-[16px] font-semibold underline-offset-4 hover:underline"
                      style={{ color: "#00236F" }}
                    >
                      {contact.telepon}
                    </a>
                  </InfoRow>
                  <InfoRow icon={EmailIcon} label="Email resmi">
                    <a
                      href={`mailto:${contact.email}`}
                      className="break-all text-[16px] font-semibold underline-offset-4 hover:underline"
                      style={{ color: "#00236F" }}
                    >
                      {contact.email}
                    </a>
                  </InfoRow>
                  <InfoRow icon={MapPinIcon} label="Alamat dapur & toko">
                    <p className="whitespace-pre-line text-[15px] leading-[24px]" style={{ color: "#444651" }}>
                      {contact.alamat}
                    </p>
                  </InfoRow>
                </div>
              </div>

              <div className="rounded-3xl p-7 sm:p-8" style={{ backgroundColor: "#F2F3FF", border: "1px solid #DAE2FD" }}>
                <h3 className="mb-4 text-[17px] font-bold" style={{ color: "#00236F" }}>
                  Jam operasional dapur & pengiriman
                </h3>
                <dl className="flex flex-col gap-2.5 text-[14.5px]" style={{ color: "#444651" }}>
                  <div className="flex justify-between gap-4">
                    <dt>Senin – Jumat</dt>
                    <dd className="font-semibold tabular-nums" style={{ color: "#00236F" }}>08:00 – 20:00 WIB</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Sabtu – Minggu</dt>
                    <dd className="font-semibold tabular-nums" style={{ color: "#00236F" }}>09:00 – 21:00 WIB</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-7 sm:p-8" style={{ border: "1px solid #E2E7FF" }}>
              <h2 className="mb-6 text-[21px] font-bold" style={{ color: "#00236F", letterSpacing: "-0.015em" }}>
                Kirim pesan langsung
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="k-nama" className="text-[13px] font-semibold" style={{ color: "#131B2E" }}>
                    Nama lengkap
                  </label>
                  <input
                    id="k-nama"
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.nama}
                    onChange={(e) => setFormData((f) => ({ ...f, nama: e.target.value }))}
                    className={fieldClass}
                    style={fieldStyle}
                    placeholder="Nama Anda"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="k-email" className="text-[13px] font-semibold" style={{ color: "#131B2E" }}>
                    Alamat email
                  </label>
                  <input
                    id="k-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                    className={fieldClass}
                    style={fieldStyle}
                    placeholder="nama@email.com"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="k-pesan" className="text-[13px] font-semibold" style={{ color: "#131B2E" }}>
                    Pesan atau kebutuhan pesanan
                  </label>
                  <textarea
                    id="k-pesan"
                    required
                    rows={5}
                    value={formData.pesan}
                    onChange={(e) => setFormData((f) => ({ ...f, pesan: e.target.value }))}
                    className={`${fieldClass} resize-none leading-[24px]`}
                    style={fieldStyle}
                    placeholder="Tuliskan pertanyaan atau detail pesanan Anda di sini"
                  />
                </div>

                <button
                  type="submit"
                  className="c-press mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white"
                  style={{ backgroundColor: "#25D366" }}
                >
                  {WhatsAppIcon}
                  Kirim pesan via WhatsApp
                </button>

                <p className="text-center text-[12.5px]" style={{ color: "#757682" }}>
                  Pesan Anda akan terbuka di WhatsApp dan dikirim ke kontak resmi SOJU.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
