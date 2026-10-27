# Documentation — Frontend Data Wiring (Dashboard, Data, Profile)

**Date:** 16 Sep 2026
**Scope:** `webf/` only (Next.js frontend). No changes to `backend/` or `prisma/schema.prisma`.

This document records the work done to remove static/hardcoded/mock data from the
dashboard and wire the `/data` page to full CRUD against the existing backend API.

---

## Summary

| Page | Status |
|------|--------|
| Dashboard (`app/dashboard/page.tsx`) | Completed — hardcoded chart/summary removed, wired to API |
| Data (`app/data/page.tsx`) | Completed — full CRUD, order create wired |
| Profile (`app/profile/page.tsx`) | Partially completed — blocked by missing backend endpoints |
| Typecheck (`tsc --noEmit`) | Passes with zero errors |

---

## All API endpoints confirmed (pre-existing, no changes)

- `GET /dashboard/summary?periode=` — values `today`, `7d`, `30d`
- `GET /dashboard/tren-penjualan?periode=` — values `7d`, `30d` only (no `90d`)
- Full CRUD exists for: products, customers, suppliers, orders
- Transactions: create (direct-cost / indirect-cost / cash) + delete only — no PUT
- Stock movements: create only — no PUT, no DELETE
- **No profile / user-settings / store-settings endpoints exist**

---

## 1. Dashboard (`app/dashboard/page.tsx`)

### Completed
- Removed the hardcoded `summaryCards` array (Total Produk 12, Order Hari Ini 18,
  Pemasukan Rp 8.425.000, Saldo Kas Rp 2.180.000). Cards now render a **skeleton
  loading state** while the API loads and **never** fall back to static numbers.
- Removed the hardcoded `recentOrders` mock array. Orders start empty and show
  "Belum ada data order dari backend" when the API returns no rows.
- Removed the entire static SVG chart: hardcoded path data, x/y coordinates,
  date labels ("30 Agt"–"5 Sep"), value markers ("420rb"…"1,24jt"), the dashed
  "Target harian" line, and the area-fill gradient.
- Removed the static "Capaian target 7 hari" badge (96%, "Rp 5,42jt / 5,60jt")
  and the "+12% vs 7 hari lalu" label.
- Replaced with a **dynamic bar chart** driven by `dashboardApi.getSalesTrend(periode)`.
  Y-axis scale, X-axis labels, and value markers are computed from the API response
  (`{ tanggal, total }[]`).
- Wired the 7H/30H toggle to refetch with `periode = "7d" | "30d"`.
  **90H button removed** — the backend does not support that range.
- Chart heading now updates ("7 Hari" / "30 Hari") and shows an explicit
  "Belum ada data penjualan untuk periode ini" state.
- Replaced the static stats strip with real computed stats: total for period,
  average/day, highest day, lowest day.
- "Total Produk" card now reads the real active product count from
  `api.products.getAll()` instead of the hardcoded `"12"`.

### Notes / kept as-is (per instruction)
- The "Sumber Input Data" card (72% AI / 318 entri / 28% manual / 124 entri)
  remains **100% static** — no backend endpoint exists for this metric.

---

## 2. Data (`app/data/page.tsx`) — full CRUD

### Completed
- **Order create wired**: the existing order form (line items + qty, customer,
  source) now calls `api.orders.create()`. The backend accepts **one product per
  order**, so the first item is submitted and a helper note explains this; the
  multi-item UI is retained for future backend support.
- **Order edit**: opens the modal in edit mode with a "Jumlah Bayar (Rp)" input,
  wired to `api.orders.update(id, { jumlah_bayar })` — the only field the backend
  PUT accepts.
- **Order delete**: confirmation modal → `api.orders.delete(id)` → tab refetch.
- **Customer edit/delete**: `api.customers.update/delete`, modal pre-filled from
  the row.
- **Supplier edit/delete**: `api.suppliers.update/delete`, modal pre-filled.
- **Transaction delete**: confirmation modal → `api.transactions.delete(sumberTabel, id)`
  where `sumberTabel` is derived from the row's `type`
  (`DIRECT_COST` / `INDIRECT_COST` / `CASH_TRANSACTION`). No edit button — the
  backend has no transaction PUT.
- **Stock tab** untouched (no edit/delete) — backend has no PUT/DELETE for movements.
- **Transaction types**: the create-transaction form now fetches options from
  `api.transactionTypes.getAll()` instead of a hardcoded array.
- **Important fix**: the transaction create previously called `createDirectCost`
  for every type; it now routes to `createIndirectCost` vs `createDirectCost`
  based on the selected type's `kategori` (`BEBAN_TIDAK_LANGSUNG` vs the rest).
  The old hardcoded `transaction_type_id: 1` fallback is gone.

### Tab fetch verification (all correct)
| Tab        | Endpoint              | Result |
|------------|-----------------------|--------|
| Transaksi  | `GET /transactions`   | Correct |
| Stok       | `GET /stock`          | Correct |
| Order      | `GET /orders`         | Correct |
| Customer   | `GET /customers`      | Correct |
| Supplier   | `GET /suppliers`      | Correct |

All empty-tab states are genuine — `seed.ts` only seeds Chart of Accounts and
Transaction Types, so an empty table means the DB is empty, not a fetch/filter bug.

---

## 3. Profile (`app/profile/page.tsx`) — partially blocked

### Completed
- `api.auth.getMe()` now populates the **Akun Pengguna** tab:
  user name/email in the current-user card and the user-list card, plus the
  profile-hero badges.
- Hardcoded initials ("BD", "BP") replaced with dynamic initials from the loaded
  user name.
- The fake second user ("Admin Kakak") removed from the user list.

### Blocked — needs a backend task
- **Store info** (nama/alamat/telepon/instagram/WhatsApp/deskripsi): still local
  state — no store-profile endpoint exists.
- **Notification settings, language, currency, report-period start**: still local —
  no settings endpoint exists.
- **Store statistics** ("Jan 2025", "12 varian", "47 orang", "1.284", "4.9 ⭐"):
  still hardcoded — no endpoint.
- **Subscription plan / password change**: no endpoints.

---

## Blocked items (flagged, per brief)

| Item | Reason |
|------|--------|
| Profile page full wiring | No profile/settings/store endpoints in `backend/src/routes/` |
| Stock movements edit/delete | No PUT/DELETE endpoint for stock movements |
| "Sumber Input Data" on dashboard | No backend metric endpoint (left as-is by instruction) |
| AI chat page | Fully hardcoded + canned data (left as-is by instruction) |

---

## Hardcoded data still present elsewhere in `webf/` (not in original list)

1. **`app/ai/page.tsx`** (lines ~129–187): the entire chat UI is mock —
   fake transaction previews ("Rp 240.000", "Rp 320.000", "Rp 92.000") and a
   canned 7-day summary ("Rp 3.180.000", "58 order", "42 transaksi"). This is the
   largest remaining mock-data surface in the app.

---

## Verification

- `tsc --noEmit` in `webf/` → exits 0, no errors.
- Grep audit confirms no hardcoded `Rp`/mock values remain in
  `app/dashboard/` or `app/profile/`. Remaining `Rp` strings in `app/data/` are
  all API-driven (`customer.saldoPiutang`, `supplier.saldoHutang`).