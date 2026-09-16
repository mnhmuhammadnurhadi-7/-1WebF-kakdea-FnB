"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChipSelector, type ChipOption } from "@/components/ui/ChipSelector";
import { InputField } from "@/components/ui/InputField";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/lib/api";

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

// Note: order status field is not in database schema per requirements, but kept for UI reference
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("transaksi");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSheet, setModalSheet] = useState(activeTab);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Real data states
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function fetchMasterData() {
      try {
        setLoading(true);
        const [productsRes, customersRes, suppliersRes] = await Promise.all([
          api.products.getAll(),
          api.customers.getAll(),
          api.suppliers.getAll(),
        ]);

        if (productsRes.success) setProducts(productsRes.data);
        if (customersRes.success) setCustomers(customersRes.data);
        if (suppliersRes.success) setSuppliers(suppliersRes.data);
      } catch (error) {
        console.error('Error fetching master data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMasterData();
  }, []);

  // Convert data to select options
  const productList = products.map(p => ({
    value: String(p.id),
    label: `${p.namaBarang}${p.varian ? ` - ${p.varian}` : ''}`,
  }));

  const customerList = customers.map(c => ({
    value: String(c.id),
    label: `${c.nama}${c.alamat ? ` - ${c.alamat}` : ''}`,
  }));

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

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      try {
        // Call appropriate API based on modal sheet
        if (modalSheet === "transaksi") {
          // Determine transaction type and call appropriate endpoint
          await api.transactions.createDirectCost({
            tanggal: form.transaksi.tanggal,
            business_unit: 'PABRIK', // Default, should be from form
            transaction_type_id: 1, // Would need to map from form.transaksi.jenis
            detail_transaksi: form.transaksi.deskripsi,
            nominal: parseFloat(form.transaksi.nominal),
            jenis_kas: 'Kas Utama',
          });
        } else if (modalSheet === "stok") {
          await api.stock.createMovement({
            product_id: parseInt(form.stok.produk),
            tanggal: form.stok.tanggal,
            tipe: form.stok.jenis.toUpperCase(),
            jumlah: parseInt(form.stok.jumlah),
            keterangan: form.stok.catatan,
          });
        } else if (modalSheet === "customer") {
          await api.customers.create({
            kode_customer: `CUST${Date.now()}`,
            nama: form.customer.nama,
            alamat: form.customer.alamat,
            contact_person: form.customer.kontak,
            telp: form.customer.telepon,
            bank_nama: form.customer.bank,
            rekening: form.customer.rek,
            keterangan: form.customer.catatan,
          });
        } else if (modalSheet === "supplier") {
          await api.suppliers.create({
            kode_supplier: `SUP${Date.now()}`,
            nama: form.supplier.nama,
            alamat: form.supplier.alamat,
            contact_person: form.supplier.kontak,
            telp: form.supplier.telepon,
            bank_nama: form.supplier.bank,
            rekening: form.supplier.rek,
            keterangan: form.supplier.catatan,
          });
        }
        
        setModalOpen(false);
        // Refresh data
        window.location.reload();
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Terjadi kesalahan saat menyimpan data');
      }
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
 * Preview table/card untuk tiap sheet — sekarang dengan real data dari API.
 */
function SheetPreview({ tab }: { tab: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let response;
        
        switch (tab) {
          case 'transaksi':
            response = await api.transactions.getAll();
            break;
          case 'stok':
            response = await api.stock.getAll();
            break;
          case 'order':
            response = await api.orders.getAll();
            break;
          case 'customer':
            response = await api.customers.getAll();
            break;
          case 'supplier':
            response = await api.suppliers.getAll();
            break;
          default:
            response = { success: true, data: [] };
        }

        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tab]);

  if (loading) {
    return (
      <Card className="flex items-center justify-center py-16">
        <div className="text-muted">Loading data...</div>
      </Card>
    );
  }

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
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted">
                  Belum ada data transaksi
                </td>
              </tr>
            ) : data.map((row: any, i: number) => (
              <tr key={i} className="hover:bg-card-alt transition-colors">
                <td className="px-5 py-3 text-muted">{new Date(row.tanggal).toLocaleDateString('id-ID')}</td>
                <td className="px-5 py-3 font-medium text-ink">{row.transaksi || row.keterangan || row.type}</td>
                <td className="px-5 py-3 text-ink">{row.detailTransaksi || row.keterangan || '-'}</td>
                <td className="px-5 py-3 text-right font-semibold text-teal-success">
                  {row.debit ? `Rp ${row.debit.toLocaleString('id-ID')}` : "-"}
                </td>
                <td className="px-5 py-3 text-right font-semibold text-danger">
                  {row.kredit ? `Rp ${row.kredit.toLocaleString('id-ID')}` : "-"}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={row.sumberInput === 'AI' ? "ai" : "manual"}>{row.sumberInput || 'MANUAL'}</Badge>
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
        {data.length === 0 ? (
          <Card className="col-span-full flex items-center justify-center py-16">
            <div className="text-muted">Belum ada data produk</div>
          </Card>
        ) : data.map((product: any, i: number) => (
          <Card key={product.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <Badge variant={product.status === 'AMAN' ? "success" : product.status === 'MENIPIS' ? "new" : "danger"}>
                {product.status === 'AMAN' ? 'Stok aman' : product.status === 'MENIPIS' ? 'Mau habis' : 'Kritis'}
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
                {product.namaBarang}
              </span>
              <span className="text-[12px] text-muted">SKU: {product.kodeProduk}</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-heading text-[22px] font-bold text-ink">
                {product.stokSaatIni}
              </span>
              <span className="text-[12px] text-muted">{product.satuan}</span>
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
          {data.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-muted">
              Belum ada data order
            </div>
          ) : data.map((order: any) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-4 last:border-b-0 hover:bg-card-alt transition-colors"
            >
              <div className="flex min-w-[120px] flex-col">
                <span className="font-heading text-[13px] font-bold text-accent">{order.kodeOrder}</span>
                <span className="text-[11px] text-muted">{new Date(order.tanggal).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-[14px] font-semibold text-ink">{order.customer?.nama || order.namaPemesan || 'Unknown'}</span>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={order.sumberInput === 'AI' ? "ai" : "manual"}>{order.sumberInput}</Badge>
                  <Badge variant="source">{order.jenisOrder}</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="font-heading text-[18px] font-bold text-ink">
                  Rp {order.totalInvoice.toLocaleString('id-ID')}
                </div>
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
              <th className="text-right px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted">
                  Belum ada data customer
                </td>
              </tr>
            ) : data.map((customer: any, i: number) => (
              <tr key={customer.id} className="hover:bg-card-alt transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-mint text-[12px] font-bold text-teal-active">
                      {customer.nama.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-ink">{customer.nama}</span>
                      <span className="text-[11px] text-muted">ID: {customer.kodeCustomer}</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted">{customer.telp || '-'}</td>
                <td className="px-5 py-3 text-muted">{customer.alamat || '-'}</td>
                <td className="px-5 py-3 text-right font-semibold text-accent">
                  {customer.saldoPiutang > 0 ? `Rp ${customer.saldoPiutang.toLocaleString('id-ID')}` : 'Rp 0'}
                </td>
                <td className="px-5 py-3 text-right text-muted">
                  {customer.status || '-'}
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
      {data.length === 0 ? (
        <Card className="col-span-full flex items-center justify-center py-16">
          <div className="text-muted">Belum ada data supplier</div>
        </Card>
      ) : data.map((supplier: any) => (
        <Card key={supplier.id} className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-bg">
              <span className="font-heading text-[14px] font-bold text-accent">
                {supplier.nama.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <Badge variant="source">Supplier</Badge>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-heading text-[16px] font-semibold text-ink">{supplier.nama}</span>
            <span className="text-[12px] text-muted">CP: {supplier.contactPerson || '-'} · {supplier.telp || '-'}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-[12px] text-muted">Hutang dagang</span>
            <span
              className={`font-heading text-[15px] font-bold ${
                supplier.saldoHutang === 0 ? "text-teal-success" : "text-danger"
              }`}
            >
              {supplier.saldoHutang > 0 ? `Rp ${supplier.saldoHutang.toLocaleString('id-ID')}` : 'Rp 0'}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
