"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/customer/PageHeader";

const svgProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const LeafIcon = (
  <svg {...svgProps}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);
const SnowflakeIcon = (
  <svg {...svgProps}>
    <path d="M2 12h20M12 2v20M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4" />
  </svg>
);
const ShieldIcon = (
  <svg {...svgProps}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const VALUES = [
  {
    icon: LeafIcon,
    title: "Bahan segar alami",
    text: "Olahan murni daging ikan tenggiri segar & ayam pilihan tanpa bahan pengawet sintetik.",
  },
  {
    icon: SnowflakeIcon,
    title: "Standar cold-chain",
    text: "Diproses dan disimpan dengan standar rantai dingin -18°C untuk menjaga higienitas dan cita rasa.",
  },
  {
    icon: ShieldIcon,
    title: "Standar HACCP",
    text: "Sajian kuliner nusantara siap santap dan produk beku berstandar sertifikasi keamanan pangan.",
  },
];

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

  return (
    <>
      <PageHeader title="Tentang Kami" description="Mengenal lebih dekat dedikasi dan kualitas di balik setiap hidangan SOJU." />

      <section className="pb-14 pt-4" style={{ backgroundColor: "#FAF8FF" }}>
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
          <div className="max-w-3xl rounded-3xl bg-white p-7 sm:p-10" style={{ border: "1px solid #E2E7FF" }}>
            {loading ? (
              <div className="flex flex-col gap-3" aria-busy="true" aria-label="Memuat">
                <div className="c-skeleton h-7 w-1/2 rounded-md" />
                <div className="c-skeleton h-4 w-1/3 rounded-md" />
                <div className="c-skeleton mt-3 h-4 w-full rounded-md" />
                <div className="c-skeleton h-4 w-full rounded-md" />
                <div className="c-skeleton h-4 w-3/4 rounded-md" />
              </div>
            ) : aboutContent ? (
              <div className="flex flex-col gap-3">
                <h2 className="text-[26px] font-bold leading-tight" style={{ color: "#00236F", letterSpacing: "-0.02em" }}>
                  {aboutContent.judul}
                </h2>
                {aboutContent.subJudul && (
                  <p className="text-[16px] font-semibold" style={{ color: "#006C4A" }}>
                    {aboutContent.subJudul}
                  </p>
                )}
                {aboutContent.konten && (
                  <div className="mt-2 max-w-[68ch] whitespace-pre-wrap text-[15.5px] leading-[27px]" style={{ color: "#444651" }}>
                    {aboutContent.konten}
                  </div>
                )}
              </div>
            ) : (
              <p className="py-8 text-center text-[14px]" style={{ color: "#757682" }}>
                Konten belum tersedia.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-14" style={{ backgroundColor: "#F2F3FF" }}>
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
          <div className="mb-10 max-w-xl">
            <h2 className="text-[26px] font-bold sm:text-[30px]" style={{ color: "#00236F", letterSpacing: "-0.025em" }}>
              Nilai utama kami
            </h2>
            <p className="mt-2 text-[15px] leading-[24px]" style={{ color: "#444651" }}>
              Komitmen kami dalam menyajikan hidangan autentik berkualitas terbaik.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-3">
            {VALUES.map((v) => (
              <li key={v.title} className="flex flex-col gap-3 border-t pt-6" style={{ borderColor: "#C9D3F5" }}>
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#FFFFFF", color: "#00236F" }}
                >
                  {v.icon}
                </span>
                <h3 className="text-[18px] font-bold" style={{ color: "#00236F" }}>
                  {v.title}
                </h3>
                <p className="text-[14.5px] leading-[23px]" style={{ color: "#444651" }}>
                  {v.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-6" style={{ backgroundColor: "#FAF8FF" }}>
        <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-5">
          <div className="flex max-w-xl flex-col gap-2">
            <h2 className="text-[26px] font-bold" style={{ color: "#00236F", letterSpacing: "-0.025em" }}>
              Ingin menikmati hidangan kami?
            </h2>
            <p className="text-[15px] leading-[24px]" style={{ color: "#444651" }}>
              Jelajahi pilihan menu siap santap dan frozen pack terbaik dari SOJU.
            </p>
          </div>
          <Link
            href="/customer/menu"
            className="c-press inline-flex h-12 items-center justify-center rounded-full px-8 text-[15px] font-semibold text-white"
            style={{ backgroundColor: "#1E3A8A" }}
          >
            Lihat Katalog Menu
          </Link>
        </div>
      </section>
    </>
  );
}
