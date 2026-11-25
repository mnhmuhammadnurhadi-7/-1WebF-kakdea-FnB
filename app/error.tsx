"use client";

import { StatusScreen } from "@/components/status/StatusScreen";

// Next.js memberi prop `reset` (bukan `retry`) untuk mencoba memuat ulang segmen yang error.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <StatusScreen kind="500" onRetry={reset} incidentId={error.digest ? `INC-${error.digest}` : undefined} />;
}
