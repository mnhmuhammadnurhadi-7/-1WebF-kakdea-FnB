# Struktur proyek

Setiap halaman: `page.tsx` hanya memanggil satu View. Isi halaman dibagi ke subfolder per fitur di dalam `components/`.

```
app/dashboard/
  page.tsx
  components/
    DashboardView.tsx
    header/   WelcomeHeader
    kpi/      KpiGrid, StatCard, SaldoKasCard
    chart/    SalesTrendChart, TrendPlot, SourceRatioCard
    orders/   RecentOrders, OrderItem
    ai-command/ AiCommandBox
    state/    DashboardSkeleton, DashboardError, TestBanner
    shared/   Icon, format, types, sampleData
app/data/   components/ DataView + header, tabs, master, jenis, tambah, bebas, ui, state, shared
app/ai/     components/ AiView + header, chat, prompts, shared
app/audit/  components/ AuditView + header, summary, filter, log, state, shared
app/cms/    components/ CmsView + hooks, header, menu, content, state, ui, shared
components/ customer, layout (AppLayout, Sidebar, Topbar, ...), ui
lib/        api.ts, whatsapp.ts
```

## Cara pasang
1. Hapus folder `app`, `components`, `lib` yang lama (jangan hapus package.json, public, .env, next.config).
2. Salin tiga folder dari zip ini ke proyek, timpa `eslint.config.mjs` jika perlu.
3. `npm run dev`. Dashboard tanpa backend: buka `http://localhost:3000/dashboard?testing`.

## Yang berubah
- `globals.css` dan `layout.tsx`: warna Figma + hanya font Plus Jakarta Sans (sebelumnya masih krem/amber + Fraunces).
- Bingkai Sidebar/Topbar dipindah ke `components/layout/` dan dipakai semua halaman admin (tidak lagi mengimpor dari folder dashboard).
- `app/error.tsx`: prop `retry` diganti `reset` (nama prop yang benar di Next.js, sebelumnya tombol "Coba lagi" tidak berfungsi).
- Logic dan pemanggilan API tidak diubah.
