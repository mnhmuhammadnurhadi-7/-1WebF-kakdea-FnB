"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const PhoneIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EmailIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const MapPinIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const WhatsAppIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function CustomerKontakPage() {
  const [formData, setFormData] = useState({ nama: "", email: "", pesan: "" });
  const [submitting, setSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    telepon: "+62 812 3456 7890",
    email: "info@soju.com",
    alamat: "Jl. Contoh No. 123\nKota, Provinsi 12345",
  });

  useEffect(() => {
    const loadContact = async () => {
      try {
        const res = await api.publicCms.getContentByKey("kontak");
        if (res.success && res.data) {
          setContactInfo({
            telepon: res.data.judul || "+62 812 3456 7890",
            email: res.data.subJudul || "info@soju.com",
            alamat: res.data.konten || "Jl. Contoh No. 123\nKota, Provinsi 12345",
          });
        }
      } catch (error) {
        console.error("Error loading contact data:", error);
      }
    };
    loadContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let cleanPhone = contactInfo.telepon.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith("62")) {
      cleanPhone = "62" + cleanPhone;
    }
    const message = `Halo SOJU, saya ${formData.nama}.%0A%0A${formData.pesan}%0A%0AEmail: ${formData.email}`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, "_blank");

    setSubmitting(false);
    setFormData({ nama: "", email: "", pesan: "" });
  };

  return (
    <>
      {/* Page Header */}
      <section className="pt-10 pb-8" style={{ backgroundColor: "#FAF8FF" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col gap-1">
            <span
              className="text-[11px] font-bold uppercase"
              style={{ color: "#006C4A", letterSpacing: "0.1em" }}
            >
              LAYANAN & RESERVASI
            </span>
            <h1
              className="text-[32px] sm:text-[40px] font-bold"
              style={{ color: "#00236F", letterSpacing: "-0.02em" }}
            >
              Hubungi Kami
            </h1>
            <p className="text-[16px] max-w-2xl" style={{ color: "#444651" }}>
              Kami siap melayani kebutuhan pesanan siap santap, kemasan beku, hampers, maupun katering pesta Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-10" style={{ backgroundColor: "#FAF8FF" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: "#DAE2FD", boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.04)" }}>
                <h2 className="text-[22px] font-bold mb-6" style={{ color: "#00236F" }}>
                  Informasi Kontak
                </h2>
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full shrink-0"
                      style={{ backgroundColor: "#EAEDFF", color: "#00236F" }}
                    >
                      {PhoneIcon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "#757682" }}>
                        Telepon & WhatsApp
                      </span>
                      <a
                        href={`tel:${contactInfo.telepon.replace(/\s+/g, "")}`}
                        className="text-[15px] font-semibold hover:underline"
                        style={{ color: "#00236F" }}
                      >
                        {contactInfo.telepon}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full shrink-0"
                      style={{ backgroundColor: "#EAEDFF", color: "#00236F" }}
                    >
                      {EmailIcon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "#757682" }}>
                        Email Resmi
                      </span>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-[15px] font-semibold hover:underline"
                        style={{ color: "#00236F" }}
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full shrink-0"
                      style={{ backgroundColor: "#EAEDFF", color: "#00236F" }}
                    >
                      {MapPinIcon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "#757682" }}>
                        Alamat Dapur & Toko
                      </span>
                      <p className="text-[15px] whitespace-pre-line" style={{ color: "#444651" }}>
                        {contactInfo.alamat}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "#F2F3FF", border: "1px solid #DAE2FD" }}
              >
                <h3 className="text-[17px] font-bold mb-3" style={{ color: "#00236F" }}>
                  Jam Operasional Dapur & Pengiriman
                </h3>
                <div className="flex flex-col gap-2 text-[14px]" style={{ color: "#444651" }}>
                  <div className="flex justify-between">
                    <span className="font-medium">Senin - Jumat:</span>
                    <span className="font-semibold" style={{ color: "#00236F" }}>08:00 - 20:00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sabtu - Minggu:</span>
                    <span className="font-semibold" style={{ color: "#00236F" }}>09:00 - 21:00 WIB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl border p-8" style={{ borderColor: "#DAE2FD", boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.04)" }}>
              <h2 className="text-[22px] font-bold mb-6" style={{ color: "#00236F" }}>
                Kirim Pesan Langsung
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[13px] font-semibold mb-2" style={{ color: "#131B2E" }}>
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData((f) => ({ ...f, nama: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border text-[14px] focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: "#DAE2FD", color: "#131B2E" }}
                    placeholder="Nama Anda"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold mb-2" style={{ color: "#131B2E" }}>
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border text-[14px] focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: "#DAE2FD", color: "#131B2E" }}
                    placeholder="nama@email.com"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold mb-2" style={{ color: "#131B2E" }}>
                    Pesan / Kebutuhan Pesanan
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.pesan}
                    onChange={(e) => setFormData((f) => ({ ...f, pesan: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border text-[14px] focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{ borderColor: "#DAE2FD", color: "#131B2E" }}
                    placeholder="Tuliskan pertanyaan atau detail pesanan Anda di sini..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 h-12 text-[15px] font-semibold text-white rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#25D366" }}
                >
                  {WhatsAppIcon}
                  {submitting ? "Membuka WhatsApp..." : "Kirim Pesan via WhatsApp"}
                </button>

                <p className="text-[12px] text-center mt-1" style={{ color: "#757682" }}>
                  Pesan Anda akan otomatis terformat dan terkirim ke kontak WhatsApp resmi SOJU.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
