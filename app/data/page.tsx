"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChipSelector, type ChipOption } from "@/components/ui/ChipSelector";
import { InputField } from "@/components/ui/InputField";
import { Modal } from "@/components/ui/Modal";

const sheetTabs: ChipOption[] = [
  { id: "transaksi", label: "Transaksi" },
  { id: "stok", label: "Stok" },
  { id: "order", label: "Order" },
  { id: "customer", label: "Customer" },
  { id: "supplier", label: "Supplier" },
];

const SearchIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const FilterIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const DownloadIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const PlusIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const transactionTypes = [
  { value: "jual", label: "Penjualan Produk" },
  { value: "beli_bahan", label: "Pembelian Bahan Baku" },
  { value: "beli_kemasan", label: "Pembelian Kemasan" },
  { value: "ongkir_jual", label: "Ongkos Kirim (Penjualan)" },
  { value: "ongkir_beli", label: "Ongkos Kirim (Pembelian)" },
  { value: "gaji", label: "Gaji Karyawan" },
  { value: "sewa", label: "Sewa Tempat / Alat" },
  { value: "listrik_air", label: "Listrik & Air" },
  { value: "lainnya", label: "Lain-lain" },
];

const productList = [
  { value: "nugget_ayam_500", label: "Nugget Ayam Premium 500g" },
  { value: "nugget_ayam_250", label: "Nugget Ayam Premium 250g" },
  { value: "sosis_sapi_500", label: "Sosis Sapi Bakar 500g" },
  { value: "bakso_ikan_500", label: "Bakso Ikan Kenyal 500g" },
  { value: "siomay_ayam_10", label: "Siomay Ayam Frozen (10 pcs)" },
  { value: "pempek_ikan_isii", label: "Pempek Ikan Isi (8 pcs)" },
  { value: "cilok_ayam_12", label: "Cilok Ayam Kenyal (12 pcs)" },
  { value: "dimsum_udang_8", label: "Dimsum Udang Premium (8 pcs)" },
  { value: "chicken_katsu_300", label: "Chicken Katsu Frozen 300g" },
  { value: "tempura_udang_6", label: "Tempura Udang (6 pcs)" },
  { value: "kentang_goreng_500", label: "Kentang Goreng Shoestring 500g" },
  { value: "roti_bakar_coklat", label: "Roti Bakar Coklat Keju (frozen)" },
];

const customerList = [
  { value: "c1", label: "Ibu Siti — Depok" },
  { value: "c2", label: "Warung Barokah — Cimanggis" },
  { value: "c3", label: "Toko Makmur — Lenteng Agung" },
  { value: "c4", label: "Bu Aminah — Pasar Minggu" },
  { value: "c5", label: "Kantin Masjid Al-Ikhlas" },
];

const sourceList = [
  { value: "wa", label: "WhatsApp" },
  { value: "dm_ig", label: "DM Instagram" },
  { value: "grabfood", label: "GrabFood" },
  { value: "manual", label: "Manual (telepon / langsung)" },
];

const stockTypes = [
  { value: "masuk", label: "Masuk (Restock / Produksi)" },
  { value: "keluar", label: "Keluar (Terjual / Digunakan)" },
  { value: "retur", label: "Retur ke Supplier" },
  { value: "kedaluwarsa", label: "Kedaluwarsa / Rusak" },
];

const orderStatus = [
  { value: "baru", label: "Baru" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
  { value: "batal", label: "Dibatalkan" },
];

interface OrderItem {
  id: string;
  product: string;
  qty: string;
}

interface FormState {
  transaksi: {
    tanggal: string;
    deskripsi: string;
    jenis: string;
    nominal: string;
  };
  stok: {
    produk: string;
    jenis: string;
    jumlah: string;
    tanggal: string;
    catatan: string;
  };
  order: {
    tanggal: string;
    customer: string;
    sumber: string;
    items: OrderItem[];
    status: string;
  };
  customer: {
    nama: string;
    alamat: string;
    kontak: string;
    telepon: string;
    bank: string;
    rek: string;
    catatan: string;
  };
  supplier: {
    nama: string;
    alamat: string;
    kontak: string;
    telepon: string;
    bank: string;
    rek: string;
    catatan: string;
  };
}

const initialForm: FormState = {
  transaksi: { tanggal: "", deskripsi: "", jenis: "", nominal: "" },
  stok: { produk: "", jenis: "", jumlah: "", tanggal: "", catatan: "" },
  order: {
    tanggal: "",
    customer: "",
    sumber: "",
    items: [{ id: "1", product: "", qty: "" }],
    status: "baru",
  },
  customer: { nama: "", alamat: "", kontak: "", telepon: "", bank: "", rek: "", catatan: "" },
  supplier: { nama: "", alamat: "", kontak: "", telepon: "", bank: "", rek: "", catatan: "" },
};

type FormErrors = Partial<Record<string, string>>;

export default function DataPage() {
  const [activeTab, setActiveTab] = useState("transaksi");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSheet, setModalSheet] = useState(activeTab);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const openModal = () => {
    setModalSheet(activeTab);
    setForm(initialForm);
    setErrors({});
    setModalOpen(true);
  };

  const updateForm = <K extends keyof FormState>(
    sheet: K,
    patch: Partial<FormState[K]>,
  ) => {
    setForm((prev) => ({ ...prev, [sheet]: { ...prev[sheet], ...patch } }));
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (modalSheet === "transaksi") {
      const f = form.transaksi;
      if (!f.tanggal) e["transaksi.tanggal"] = "Tanggalnya belum diisi nih";
      else if (new Date(f.tanggal) > new Date()) e["transaksi.tanggal"] = "Tanggalnya kok di masa depan? Coba dicek lagi";
      if (!f.jenis) e["transaksi.jenis"] = "Jenis transaksinya pilih dulu ya";
      if (!f.nominal) e["transaksi.nominal"] = "Nominalnya belum diisi nih";
      else if (parseInt(f.nominal.replace(/\D/g, "")) <= 0) e["transaksi.nominal"] = "Nominalnya harus lebih dari 0";
    } else if (modalSheet === "stok") {
      const f = form.stok;
      if (!f.produk) e["stok.produk"] = "Produknya belum dipilih";
      if (!f.jenis) e["stok.jenis"] = "Jenis pergerakannya pilih dulu";
      if (!f.jumlah) e["stok.jumlah"] = "Jumlahnya belum diisi";
      else if (parseInt(f.jumlah) <= 0) e["stok.jumlah"] = "Jumlahnya harus lebih dari 0";
      if (!f.tanggal) e["stok.tanggal"] = "Tanggalnya belum diisi nih";
      else if (new Date(f.tanggal) > new Date()) e["stok.tanggal"] = "Tanggalnya kok di masa depan? Coba dicek lagi";
    } else if (modalSheet === "order") {
      const f = form.order;
      if (!f.tanggal) e["order.tanggal"] = "Tanggalnya belum diisi nih";
      if (!f.customer) e["order.customer"] = "Customernya belum dipilih";
      if (!f.sumber) e["order.sumber"] = "Sumber ordernya pilih dulu";
      if (f.items.length === 0) e["order.items"] = "Minimal harus ada 1 produk nih";
      else {
        f.items.forEach((it, idx) => {
          if (!it.product) e[`order.items.${idx}.product`] = "Produknya pilih dulu";
          if (!it.qty || parseInt(it.qty) <= 0) e[`order.items.${idx}.qty`] = "Qty-nya isi dengan benar";
        });
      }
    } else if (modalSheet === "customer") {
      if (!form.customer.nama) e["customer.nama"] = "Namanya belum diisi nih";
    } else if (modalSheet === "supplier") {
      if (!form.supplier.nama) e["supplier.nama"] = "Nama supplier belum diisi";
    }
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      // TODO: integrate API call — this is design-only
      setModalOpen(false);
    }
  };

  const addOrderItem = () => {
    updateForm("order", {
      items: [
        ...form.order.items,
        { id: String(Date.now()), product: "", qty: "" },
      ],
    });
  };

  const removeOrderItem = (id: string) => {
    updateForm("order", {
      items: form.order.items.filter((i) => i.id !== id),
    });
  };

  const updateOrderItem = (id: string, patch: Partial<OrderItem>) => {
    updateForm("order", {
      items: form.order.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });
  };

  const formValid = Object.keys(validate()).length === 0;

  return (
    <AppLayout activeMenu="data">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="font-heading text-[28px] font-semibold text-ink leading-tight">
                Data
              </h1>
              <p className="text-[14px] text-muted">
                Kelola semua data: transaksi, stok, order, customer & supplier.
              </p>
            </div>
            <Button variant="primary" size="md" onClick={openModal} leftIcon={PlusIcon}>
              Tambah
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2.5 text-muted flex-1 min-w-[260px]">
              {SearchIcon}
              <input
                type="text"
                placeholder={`Cari di sheet ${sheetTabs.find(t => t.id === activeTab)?.label}…`}
                className="w-full bg-transparent text-[14px] text-ink placeholder:text-muted-light focus:outline-none"
              />
            </div>
            <Button variant="outline" size="md" leftIcon={FilterIcon}>Filter</Button>
            <Button variant="secondary" size="md" leftIcon={DownloadIcon}>Export</Button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border pb-1">
            <ChipSelector
              options={sheetTabs}
              value={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>

        {/* Content Card per Sheet */}
        <SheetPreview tab={activeTab} />
      </div>

      {/* Modal Tambah Data */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah Data Baru"
        subtitle="Pilih sheet, isi field, lalu simpan."
        width={480}
        footer={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => setModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              disabled={!formValid}
            >
              Simpan
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          {/* Step 1: Chip Selector Sheet */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-semibold text-muted uppercase tracking-wide">
              Step 1 — Pilih Sheet
            </span>
            <ChipSelector
              options={sheetTabs}
              value={modalSheet}
              onChange={(v) => {
                setModalSheet(v);
                setErrors({});
              }}
            />
          </div>

          <div className="w-full h-px bg-border" />

          {/* Step 2: Form per Sheet */}
          <div className="flex flex-col gap-4">
            <span className="text-[12px] font-semibold text-muted uppercase tracking-wide">
              Step 2 — Isi Data
            </span>

            {modalSheet === "transaksi" && (
              <div className="flex flex-col gap-4">
                <InputField
                  label="Tanggal"
                  type="date"
                  required
                  value={form.transaksi.tanggal}
                  onChange={(v) => updateForm("transaksi", { tanggal: v })}
                  error={errors["transaksi.tanggal"]}
                />
                <InputField
                  label="Jenis Transaksi"
                  type="select"
                  required
                  value={form.transaksi.jenis}
                  onChange={(v) => updateForm("transaksi", { jenis: v })}
                  options={transactionTypes}
                  error={errors["transaksi.jenis"]}
                />
                <InputField
                  label="Nominal (Rp)"
                  type="number"
                  required
                  placeholder="Contoh: 150000"
                  value={form.transaksi.nominal}
                  onChange={(v) => updateForm("transaksi", { nominal: v })}
                  error={errors["transaksi.nominal"]}
                  helper="Angka saja, tanpa titik/koma."
                />
                <InputField
                  label="Deskripsi"
                  type="textarea"
                  placeholder="Contoh: Penjualan 2 nugget ke Warung Barokah"
                  value={form.transaksi.deskripsi}
                  onChange={(v) => updateForm("transaksi", { deskripsi: v })}
                  helper="Opsional — biar mudah dicari nanti."
                />
              </div>
            )}

            {modalSheet === "stok" && (
              <div className="flex flex-col gap-4">
                <InputField
                  label="Produk"
                  type="select"
                  required
                  value={form.stok.produk}
                  onChange={(v) => updateForm("stok", { produk: v })}
                  options={productList}
                  error={errors["stok.produk"]}
                />
                <InputField
                  label="Jenis Pergerakan"
                  type="select"
                  required
                  value={form.stok.jenis}
                  onChange={(v) => updateForm("stok", { jenis: v })}
                  options={stockTypes}
                  error={errors["stok.jenis"]}
                />
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Jumlah (pcs/g)"
                    type="number"
                    required
                    placeholder="10"
                    value={form.stok.jumlah}
                    onChange={(v) => updateForm("stok", { jumlah: v })}
                    error={errors["stok.jumlah"]}
                  />
                  <InputField
                    label="Tanggal"
                    type="date"
                    required
                    value={form.stok.tanggal}
                    onChange={(v) => updateForm("stok", { tanggal: v })}
                    error={errors["stok.tanggal"]}
                  />
                </div>
                <InputField
                  label="Catatan"
                  type="textarea"
                  placeholder="Opsional, misal: restock dari Pak Hadi"
                  value={form.stok.catatan}
                  onChange={(v) => updateForm("stok", { catatan: v })}
                />
              </div>
            )}

            {modalSheet === "order" && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Tanggal"
                    type="date"
                    required
                    value={form.order.tanggal}
                    onChange={(v) => updateForm("order", { tanggal: v })}
                    error={errors["order.tanggal"]}
                  />
                  <InputField
                    label="Status"
                    type="select"
                    value={form.order.status}
                    onChange={(v) => updateForm("order", { status: v })}
                    options={orderStatus}
                  />
                </div>
                <InputField
                  label="Customer"
                  type="select"
                  required
                  value={form.order.customer}
                  onChange={(v) => updateForm("order", { customer: v })}
                  options={customerList}
                  error={errors["order.customer"]}
                  helper="Kalau nama belum ada, nanti auto dibuatkan (badge BARU)."
                />
                <InputField
                  label="Sumber Order"
                  type="select"
                  required
                  value={form.order.sumber}
                  onChange={(v) => updateForm("order", { sumber: v })}
                  options={sourceList}
                  error={errors["order.sumber"]}
                />

                {/* Repeatable items */}
                <div className="flex flex-col gap-3 rounded-2xl border border-border p-4 bg-card-alt">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-[14px] font-semibold text-ink">
                      Produk & Qty
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addOrderItem}
                      leftIcon={PlusIcon}
                    >
                      Tambah item
                    </Button>
                  </div>
                  {errors["order.items"] && (
                    <p className="text-[12px] font-medium text-danger">{errors["order.items"]}</p>
                  )}
                  {form.order.items.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-7">
                        <InputField
                          label={`Produk ${idx + 1}`}
                          type="select"
                          value={item.product}
                          onChange={(v) => updateOrderItem(item.id, { product: v })}
                          options={productList}
                          error={errors[`order.items.${idx}.product`]}
                        />
                      </div>
                      <div className="col-span-4">
                        <InputField
                          label="Qty"
                          type="number"
                          placeholder="1"
                          value={item.qty}
                          onChange={(v) => updateOrderItem(item.id, { qty: v })}
                          error={errors[`order.items.${idx}.qty`]}
                        />
                      </div>
                      <div className="col-span-1 pt-6">
                        {form.order.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOrderItem(item.id)}
                            aria-label="Hapus item"
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-danger-bg hover:text-danger transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modalSheet === "customer" && (
              <div className="flex flex-col gap-4">
                <InputField
                  label="Nama Customer"
                  type="text"
                  required
                  placeholder="Contoh: Ibu Siti — Depok"
                  value={form.customer.nama}
                  onChange={(v) => updateForm("customer", { nama: v })}
                  error={errors["customer.nama"]}
                />
                <InputField
                  label="Alamat"
                  type="textarea"
                  placeholder="Opsional — alamat lengkap pengiriman"
                  value={form.customer.alamat}
                  onChange={(v) => updateForm("customer", { alamat: v })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Kontak Person"
                    type="text"
                    placeholder="Contoh: Anaknya"
                    value={form.customer.kontak}
                    onChange={(v) => updateForm("customer", { kontak: v })}
                  />
                  <InputField
                    label="Telepon"
                    type="text"
                    placeholder="0812xxxxxxxx"
                    value={form.customer.telepon}
                    onChange={(v) => updateForm("customer", { telepon: v })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Bank"
                    type="text"
                    placeholder="BCA / BRI / dll"
                    value={form.customer.bank}
                    onChange={(v) => updateForm("customer", { bank: v })}
                  />
                  <InputField
                    label="No. Rekening"
                    type="text"
                    placeholder="Nomor rekening"
                    value={form.customer.rek}
                    onChange={(v) => updateForm("customer", { rek: v })}
                  />
                </div>
                <InputField
                  label="Catatan"
                  type="textarea"
                  placeholder="Catatan khusus (opsional)"
                  value={form.customer.catatan}
                  onChange={(v) => updateForm("customer", { catatan: v })}
                />
              </div>
            )}

            {modalSheet === "supplier" && (
              <div className="flex flex-col gap-4">
                <InputField
                  label="Nama Supplier"
                  type="text"
                  required
                  placeholder="Contoh: CV Bahan Makanan Sejahtera"
                  value={form.supplier.nama}
                  onChange={(v) => updateForm("supplier", { nama: v })}
                  error={errors["supplier.nama"]}
                />
                <InputField
                  label="Alamat"
                  type="textarea"
                  placeholder="Opsional — alamat gudang/kantor"
                  value={form.supplier.alamat}
                  onChange={(v) => updateForm("supplier", { alamat: v })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Kontak Person"
                    type="text"
                    placeholder="Contoh: Pak Hadi"
                    value={form.supplier.kontak}
                    onChange={(v) => updateForm("supplier", { kontak: v })}
                  />
                  <InputField
                    label="Telepon"
                    type="text"
                    placeholder="0812xxxxxxxx"
                    value={form.supplier.telepon}
                    onChange={(v) => updateForm("supplier", { telepon: v })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Bank"
                    type="text"
                    placeholder="BCA / BRI / dll"
                    value={form.supplier.bank}
                    onChange={(v) => updateForm("supplier", { bank: v })}
                  />
                  <InputField
                    label="No. Rekening"
                    type="text"
                    placeholder="Nomor rekening"
                    value={form.supplier.rek}
                    onChange={(v) => updateForm("supplier", { rek: v })}
                  />
                </div>
                <InputField
                  label="Catatan"
                  type="textarea"
                  placeholder="Term pembayaran, dll (opsional)"
                  value={form.supplier.catatan}
                  onChange={(v) => updateForm("supplier", { catatan: v })}
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}

/**
 * Preview table/card untuk tiap sheet — placeholder tampilan data.
 * (Fokus fitur di sini: DESIGN + TOMBOL TAMBAH + MODAL — bukan real data/API)
 */
function SheetPreview({ tab }: { tab: string }) {
  if (tab === "transaksi") {
    return (
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-[13px] border-collapse border-spacing-0">
          <thead className="bg-card-alt text-muted">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Tanggal</th>
              <th className="text-left px-5 py-3 font-semibold">Jenis Transaksi</th>
              <th className="text-left px-5 py-3 font-semibold">Deskripsi</th>
              <th className="text-right px-5 py-3 font-semibold">Debit</th>
              <th className="text-right px-5 py-3 font-semibold">Kredit</th>
              <th className="text-left px-5 py-3 font-semibold">Sumber</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              { t: "05 Sep 2026", j: "Penjualan Produk", d: "Order GF-1044", db: "92.000", kr: "", s: "AI" },
              { t: "05 Sep 2026", j: "Penjualan Produk", d: "DM IG Toko Barokah", db: "185.000", kr: "", s: "AI" },
              { t: "04 Sep 2026", j: "Pembelian Bahan Baku", d: "Daging ayam 10kg", db: "", kr: "320.000", s: "MANUAL" },
              { t: "04 Sep 2026", j: "Penjualan Produk", d: "WA Bu Siti", db: "240.000", kr: "", s: "AI" },
              { t: "04 Sep 2026", j: "Ongkos Kirim", d: "GrabExpress Depok", db: "", kr: "25.000", s: "MANUAL" },
              { t: "03 Sep 2026", j: "Listrik & Air", d: "Tagihan PLTN bulan ini", db: "", kr: "485.000", s: "MANUAL" },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-card-alt transition-colors">
                <td className="px-5 py-3 text-muted">{row.t}</td>
                <td className="px-5 py-3 font-medium text-ink">{row.j}</td>
                <td className="px-5 py-3 text-ink">{row.d}</td>
                <td className="px-5 py-3 text-right font-semibold text-teal-success">
                  {row.db ? `Rp ${row.db}` : "-"}
                </td>
                <td className="px-5 py-3 text-right font-semibold text-danger">
                  {row.kr ? `Rp ${row.kr}` : "-"}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={row.s === "AI" ? "ai" : "manual"}>{row.s}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    );
  }

  if (tab === "stok") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {productList.slice(0, 8).map((p, i) => (
          <Card key={p.value} className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <Badge variant={i % 3 === 0 ? "new" : i % 3 === 1 ? "success" : "source"}>
                {i % 3 === 0 ? "Stok aman" : i % 3 === 1 ? "Mau habis" : "Kedaluwarsa rawan"}
              </Badge>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-bg text-accent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m7.5 4.27 9 5.15" />
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-heading text-[15px] font-semibold text-ink leading-snug">
                {p.label}
              </span>
              <span className="text-[12px] text-muted">SKU: {p.value.toUpperCase()}</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-heading text-[22px] font-bold text-ink">
                {Math.floor(Math.random() * 40 + 5)}
              </span>
              <span className="text-[12px] text-muted">pcs / pack</span>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (tab === "order") {
    return (
      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col">
          {[
            { id: "#ORD-0105", cust: "DM Instagram — Toko Barokah", amt: "Rp 185.000", st: "Baru", s: "AI", src: "DM IG", date: "Hari ini, 10:32" },
            { id: "#ORD-0104", cust: "GrabFood #GF-1044", amt: "Rp 92.000", st: "Diproses", s: "AI", src: "GrabFood", date: "Hari ini, 09:15" },
            { id: "#ORD-0103", cust: "Bu Siti — WA", amt: "Rp 240.000", st: "Selesai", s: "MANUAL", src: "WA", date: "Kemarin, 18:44" },
            { id: "#ORD-0102", cust: "Warung Makmur — COD", amt: "Rp 65.000", st: "Selesai", s: "MANUAL", src: "Manual", date: "Kemarin, 14:20" },
          ].map((o) => (
            <div
              key={o.id}
              className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-4 last:border-b-0 hover:bg-card-alt transition-colors"
            >
              <div className="flex min-w-[120px] flex-col">
                <span className="font-heading text-[13px] font-bold text-accent">{o.id}</span>
                <span className="text-[11px] text-muted">{o.date}</span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-[14px] font-semibold text-ink">{o.cust}</span>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={o.s === "AI" ? "ai" : "manual"}>{o.s}</Badge>
                  <Badge variant="source">{o.src}</Badge>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      o.st === "Baru"
                        ? "bg-teal-success-bg text-teal-success"
                        : o.st === "Diproses"
                        ? "bg-accent-tag text-accent"
                        : "bg-card-muted text-muted"
                    }`}
                  >
                    {o.st}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-heading text-[18px] font-bold text-ink">{o.amt}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (tab === "customer") {
    return (
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-[13px] border-collapse border-spacing-0">
          <thead className="bg-card-alt text-muted">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Nama Customer</th>
              <th className="text-left px-5 py-3 font-semibold">Telepon</th>
              <th className="text-left px-5 py-3 font-semibold">Alamat</th>
              <th className="text-right px-5 py-3 font-semibold">Saldo Piutang</th>
              <th className="text-right px-5 py-3 font-semibold">Order terakhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customerList.map((c, i) => (
              <tr key={c.value} className="hover:bg-card-alt transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-mint text-[12px] font-bold text-teal-active">
                      {c.label.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-ink">{c.label}</span>
                      <span className="text-[11px] text-muted">ID: {c.value.toUpperCase()}</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted">08{12000000 + i * 13579}</td>
                <td className="px-5 py-3 text-muted">Depok, Jawa Barat</td>
                <td className="px-5 py-3 text-right font-semibold text-accent">
                  {i % 3 === 0 ? "Rp 0" : `Rp ${(i + 1) * 45}${"000"}`}
                </td>
                <td className="px-5 py-3 text-right text-muted">
                  {i === 0 ? "Hari ini" : i === 1 ? "Kemarin" : `${i} hari lalu`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    );
  }

  // Supplier
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[
        { n: "CV Bahan Sejahtera", k: "Pak Hadi", t: "0812-0001-0001", tag: "Bahan baku utama", piutang: "Rp 1.200.000" },
        { n: "Toko Kemasan Makmur", k: "Ibu Rina", t: "0812-0001-0002", tag: "Packaging & plastik", piutang: "Rp 0" },
        { n: "Distributor Frozen Food", k: "Mas Anton", t: "0812-0001-0003", tag: "Reseller produk", piutang: "Rp 485.000" },
        { n: "Warung Sayur Pak Darso", k: "Pak Darso", t: "0812-0001-0004", tag: "Sayur & bumbu", piutang: "Rp 65.000" },
        { n: "Delivery Express JNE", k: "CS JNE", t: "1500-xxx", tag: "Ekspedisi & kurir", piutang: "Rp 320.000" },
        { n: "Rental Alat Dapur", k: "Bang Joko", t: "0812-0001-0006", tag: "Sewa freezer & mixer", piutang: "Rp 0" },
      ].map((s) => (
        <Card key={s.n} className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-bg">
              <span className="font-heading text-[14px] font-bold text-accent">
                {s.n.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <Badge variant="source">{s.tag}</Badge>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-heading text-[16px] font-semibold text-ink">{s.n}</span>
            <span className="text-[12px] text-muted">CP: {s.k} · {s.t}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-[12px] text-muted">Hutang dagang</span>
            <span
              className={`font-heading text-[15px] font-bold ${
                s.piutang === "Rp 0" ? "text-teal-success" : "text-danger"
              }`}
            >
              {s.piutang}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
