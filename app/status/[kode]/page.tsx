import { notFound } from "next/navigation";
import { StatusScreen } from "@/components/status/StatusScreen";
import { isStatusKind } from "@/components/status/presets";

/** Pratinjau/tujuan layar status: /status/404, /status/500, /status/503, /status/504, /status/429, /status/offline, /status/maintenance, /status/online */
export default async function StatusPage({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params;
  if (!isStatusKind(kode)) notFound();
  return <StatusScreen kind={kode} />;
}
