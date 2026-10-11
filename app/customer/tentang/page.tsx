"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function CustomerTentangPage() {
  const [aboutContent, setAboutContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await api.publicCms.getContentByKey("tentang_kami");
        if (res.success) setAboutContent(res.data);
      } catch (error) {
        console.error("Error loading about content:", error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "#DAE2FD", borderTopColor: "#1E3A8A" }}
          />
          <span className="text-[14px]" style={{ color: "#444651" }}>
            Memuat...
          </span>
        </div>
      </div>
    );
  }

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
              BRAND STORY & FILOSOFI
            </span>
            <h1
              className="text-[32px] sm:text-[40px] font-bold"
              style={{ color: "#00236F", letterSpacing: "-0.02em" }}
            >
              Tentang Kami
            </h1>
            <p className="text-[16px] max-w-2xl" style={{ color: "#444651" }}>
              Mengenal lebih dekat dedikasi dan kualitas di balik setiap hidangan SOJU.
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-12" style={{ backgroundColor: "#FAF8FF" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 border" style={{ borderColor: "#DAE2FD", boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.04)" }}>
            {aboutContent ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-[26px] font-bold" style={{ color: "#00236F" }}>
                  {aboutContent.judul}
                </h2>
                {aboutContent.subJudul && (
                  <p className="text-[16px] font-semibold" style={{ color: "#006C4A" }}>
                    {aboutContent.subJudul}
                  </p>
                )}
                {aboutContent.konten && (
                  <div className="text-[15px] leading-relaxed whitespace-pre-wrap mt-2" style={{ color: "#444651" }}>
                    {aboutContent.konten}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[14px]" style={{ color: "#757682" }}>
                  Konten belum tersedia.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12" style={{ backgroundColor: "#F2F3FF" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-[26px] sm:text-[30px] font-bold" style={{ color: "#00236F" }}>
              Nilai Utama Kami
            </h2>
            <p className="text-[15px] max-w-xl mx-auto mt-1" style={{ color: "#444651" }}>
              Komitmen kami dalam menyajikan hidangan autentik berkualitas terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}>
              <div
                className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-[24px]"
                style={{ backgroundColor: "#EAEDFF" }}
              >
                🐟
              </div>
              <h3 className="text-[18px] font-bold mb-2" style={{ color: "#00236F" }}>
                Bahan Segar Alami
              </h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "#444651" }}>
                Olahan murni daging ikan tenggiri segar & ayam pilihan tanpa bahan pengawet sintetik.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}>
              <div
                className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-[24px]"
                style={{ backgroundColor: "#EAEDFF" }}
              >
                ❄️
              </div>
              <h3 className="text-[18px] font-bold mb-2" style={{ color: "#00236F" }}>
                Cold-Chain Standard
              </h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "#444651" }}>
                Diproses dan disimpan dengan standar rantai dingin -18°C untuk menjaga higienitas dan cita rasa.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}>
              <div
                className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-[24px]"
                style={{ backgroundColor: "#EAEDFF" }}
              >
                🏆
              </div>
              <h3 className="text-[18px] font-bold mb-2" style={{ color: "#00236F" }}>
                Standar HACCP
              </h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "#444651" }}>
                Sajian kuliner nusantara siap santap dan produk beku berstandar sertifikasi keamanan pangan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12" style={{ backgroundColor: "#FAF8FF" }}>
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="text-[26px] font-bold mb-3" style={{ color: "#00236F" }}>
            Ingin Menikmati Hidangan Kami?
          </h2>
          <p className="text-[15px] max-w-xl mx-auto mb-6" style={{ color: "#444651" }}>
            Jelajahi pilihan menu siap santap dan frozen pack terbaik dari SOJU.
          </p>
          <Link
            href="/customer/menu"
            className="inline-flex items-center justify-center px-8 h-12 text-[15px] font-semibold text-white rounded-full transition-all hover:opacity-90"
            style={{ backgroundColor: "#1E3A8A" }}
          >
            Lihat Katalog Menu
          </Link>
        </div>
      </section>
    </>
  );
}
