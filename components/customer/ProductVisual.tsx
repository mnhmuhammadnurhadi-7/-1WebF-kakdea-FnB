"use client";

import { useState } from "react";
import { getImageUrl } from "@/lib/api";

interface ProductVisualProps {
  src?: string | null;
  alt: string;
  className?: string;
  eager?: boolean;
}

/** Foto menu dengan placeholder netral (tanpa emoji) kalau gambar kosong atau gagal dimuat. */
export function ProductVisual({ src, alt, className = "", eager = false }: ProductVisualProps) {
  const [failed, setFailed] = useState(false);
  const showImage = !!src && !failed;

  if (showImage) {
    return (
      <img
        src={getImageUrl(src)}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{ background: "linear-gradient(145deg, #EAEDFF 0%, #DAE2FD 100%)" }}
      role="img"
      aria-label={alt}
    >
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00236F" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 11h18a0 0 0 0 1 0 0 9 9 0 0 1-18 0 0 0 0 0 1 0 0Z" />
        <path d="M8 7c0-1.2.8-1.8.8-3M12 7c0-1.2.8-1.8.8-3M16 7c0-1.2.8-1.8.8-3" />
      </svg>
    </div>
  );
}
