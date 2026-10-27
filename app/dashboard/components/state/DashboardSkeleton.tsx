"use client";

export function DashboardSkeleton() {
  return (
    <div aria-label="Memuat dashboard" className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="skeleton-shimmer h-3 w-64 rounded-full" />
        <div className="skeleton-shimmer h-9 w-80 rounded-xl" />
        <div className="skeleton-shimmer h-4 w-96 rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-[1.35fr_1fr_1fr_1fr]">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="skeleton-shimmer min-h-[168px] rounded-card" />
        ))}
      </div>
      <div className="skeleton-shimmer h-72 rounded-panel" />
    </div>
  );
}
