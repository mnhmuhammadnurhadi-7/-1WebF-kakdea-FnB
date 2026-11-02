import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = ["image/png", "image/jpeg"];
const ALLOWED_EXTENSIONS = new Set(["png", "jpg", "jpeg"]);

export async function POST(request: Request) {
  let body: HandleUploadBody;

  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return Response.json({ error: "Permintaan upload tidak valid." }, { status: 400 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let authToken = "";
        try {
          authToken = (JSON.parse(clientPayload || "{}") as { authToken?: string }).authToken || "";
        } catch {
          throw new Error("Sesi login tidak valid.");
        }

        if (!authToken) throw new Error("Silakan login untuk mengunggah gambar.");

        const authResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${authToken}` },
          cache: "no-store",
        });
        if (!authResponse.ok) throw new Error("Sesi login tidak valid atau sudah berakhir.");

        const extension = pathname.split(".").pop()?.toLowerCase();
        if (!pathname.startsWith("menu-images/") || !extension || !ALLOWED_EXTENSIONS.has(extension)) {
          throw new Error("Hanya gambar PNG, JPG, atau JPEG yang dapat diunggah.");
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_IMAGE_SIZE_BYTES - 1,
          addRandomSuffix: true,
          validUntil: Date.now() + 5 * 60 * 1000,
        };
      },
      onUploadCompleted: async () => {},
    });

    return Response.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memproses upload.";
    const status = /login|sesi/i.test(message) ? 401 : 400;
    return Response.json({ error: message }, { status });
  }
}
