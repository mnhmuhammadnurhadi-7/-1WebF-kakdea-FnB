import { TokoInfoCard } from "./TokoInfoCard";
import { TokoStatsCard } from "./TokoStatsCard";
import type { TokoData } from "./types";

type ProfilTokoTabProps = { toko: TokoData; onToko: (t: TokoData) => void; onSave: () => void };

export function ProfilTokoTab({ toko, onToko, onSave }: ProfilTokoTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <TokoInfoCard toko={toko} onToko={onToko} onSave={onSave} />
      <TokoStatsCard />
    </div>
  );
}
