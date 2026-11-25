import { Button } from "./Button";
import { Field } from "./Field";
import { ImageUpload } from "./ImageUpload";
import { Modal } from "./Modal";
import { VarianEditor } from "./VarianEditor";
import { MAX_HARGA } from "./constants";
import type { ProductEditor } from "./useProductEditor";
import { StateBanner } from "@/components/feedback/StateBanner";

export function ProductModal({ editor: p }: { editor: ProductEditor }) {
  // Error per kolom muncul setelah upaya simpan gagal (productError terisi) dan kolomnya memang belum valid.
  const failed = !!p.productError;
  const errNama = failed && !p.productForm.namaBarang.trim() ? "Nama menu wajib diisi." : undefined;
  const price = Number(p.productForm.hargaDefault);
  const errHarga = p.priceTooHigh
    ? `Harga melebihi batas. Maksimal Rp ${MAX_HARGA.toLocaleString("id-ID")}.`
    : failed && (!p.productForm.hargaDefault.trim() || !Number.isFinite(price) || price <= 0)
      ? "Harga harus berupa angka lebih dari 0."
      : undefined;
  const hasFieldError = !!(errNama || errHarga);

  return (
    <Modal
      open={p.productModalOpen}
      onClose={() => p.setProductModalOpen(false)}
      eyebrow="Menu makanan"
      title={p.editingProduct ? "Edit Menu Makanan" : "Tambah Menu Makanan"}
      icon={p.editingProduct ? "pencil" : "plus"}
      width={500}
      footer={
        <>
          <Button variant="secondary" onClick={() => p.setProductModalOpen(false)}>Batal</Button>
          <Button icon="check" onClick={p.saveProduct} disabled={p.savingProduct}>{p.savingProduct ? "Menyimpan..." : failed ? "Coba simpan lagi" : "Simpan"}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {p.productError && !hasFieldError && <StateBanner title="Menu belum bisa disimpan" code="ERR-S231">{p.productError}</StateBanner>}
        <Field
          label="Nama Makanan"
          placeholder="Contoh: Nasi Goreng Spesial"
          value={p.productForm.namaBarang}
          error={errNama}
          onChange={(v) => {
            p.setProductError("");
            p.setProductForm((f) => ({ ...f, namaBarang: v }));
          }}
          required
        />
        <Field
          label="Harga"
          type="number"
          prefix="Rp"
          placeholder="Contoh: 25000"
          value={p.productForm.hargaDefault}
          onChange={(v) => {
            p.setProductError("");
            p.setProductForm((f) => ({ ...f, hargaDefault: v }));
          }}
          error={errHarga}
          required
        />
        <ImageUpload
          gambar={p.productForm.gambar}
          uploading={p.uploadingImage}
          onFile={p.handleImageUpload}
          onRemove={() => p.setProductForm((f) => ({ ...f, gambar: "" }))}
        />
        <VarianEditor varian={p.productForm.varian} draft={p.varianDraft} onDraft={p.setVarianDraft} onAdd={p.addVarian} onRemove={p.removeVarian} />
        <Field
          label="Deskripsi"
          type="textarea"
          placeholder="Deskripsi makanan..."
          value={p.productForm.deskripsi}
          onChange={(v) => p.setProductForm((f) => ({ ...f, deskripsi: v }))}
        />
      </div>
    </Modal>
  );
}
