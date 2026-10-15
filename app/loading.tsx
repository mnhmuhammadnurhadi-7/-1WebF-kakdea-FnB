export default function Loading() {
  return (
    <main aria-label="Memuat halaman" className="min-h-screen bg-background p-5 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="skeleton-shimmer h-8 w-48 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-72 max-w-full rounded" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="skeleton-shimmer h-36 rounded-2xl border border-border" />)}
        </div>
        <div className="skeleton-shimmer h-72 rounded-2xl border border-border" />
      </div>
    </main>
  );
}
