export function CmsSkeleton() {
  return (
    <div aria-label="Memuat konten CMS" className="space-y-5 py-2">
      <div className="skeleton-shimmer h-9 w-56 rounded-lg" />
      <div className="skeleton-shimmer h-4 w-80 max-w-full rounded" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="skeleton-shimmer h-32 rounded-card" />
        <div className="skeleton-shimmer h-32 rounded-card" />
        <div className="skeleton-shimmer h-32 rounded-card" />
      </div>
      <div className="skeleton-shimmer h-72 rounded-card" />
    </div>
  );
}
