import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

const defaultRemotePatterns: RemotePattern[] = [
  // Local MinIO / S3-compatible storage (host & Docker network)
  { protocol: "http", hostname: "localhost", port: "9000", pathname: "/**" },
  { protocol: "http", hostname: "127.0.0.1", port: "9000", pathname: "/**" },
  { protocol: "http", hostname: "minio", port: "9000", pathname: "/**" },
  // Local backend legacy product image endpoint
  { protocol: "http", hostname: "localhost", port: "4000", pathname: "/api/public/products/**" },
  { protocol: "http", hostname: "127.0.0.1", port: "4000", pathname: "/api/public/products/**" },
  { protocol: "http", hostname: "backend", port: "4000", pathname: "/api/public/products/**" },
  // Cloud S3-compatible providers (Cloudflare R2, Supabase Storage, AWS S3)
  { protocol: "https", hostname: "**.r2.dev", pathname: "/**" },
  { protocol: "https", hostname: "**.r2.cloudflarestorage.com", pathname: "/**" },
  { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
  { protocol: "https", hostname: "**.amazonaws.com", pathname: "/**" },
];

const customMediaBaseUrl =
  process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL || process.env.S3_PUBLIC_BASE_URL;

if (customMediaBaseUrl) {
  try {
    const parsed = new URL(customMediaBaseUrl);
    const protocol = parsed.protocol === "http:" ? "http" : "https";
    const basePath = parsed.pathname.replace(/\/+$/, "");
    defaultRemotePatterns.push({
      protocol,
      hostname: parsed.hostname,
      port: parsed.port || "",
      pathname: basePath ? `${basePath}/**` : "/**",
    });
  } catch {
    // Ignore malformed custom URL so build never fails on optional env var
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: defaultRemotePatterns,
  },
};

export default nextConfig;
