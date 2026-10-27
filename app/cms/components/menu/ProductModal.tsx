import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { ImageUpload } from "./ImageUpload";
import { Modal } from "../ui/Modal";
import { VarianEditor } from "./VarianEditor";
import { MAX_HARGA } from "../shared/constants";
import type { ProductEditor } from "../hooks/useProductEditor";

export function ProductModal({ editor: p }: { editor: ProductEditor }) {
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
          <Button icon="check" onClick={p.saveProduct} disabled={p.savingProduct}>{p.savingProduct ? "Menyimpan..." : "Simpan"}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {p.productError && (
          <div role="alert" className="rounded-xl border border-bad/15 bg-bad-tint px-3.5 py-2.5 text-[13px] font-semibold text-bad-text">
            {p.productError}
          </div>
        )}
        <Field
          label="Nama Makanan"
          placeholder="Contoh: Nasi Goreng Spesial"
          value={p.productForm.namaBarang}
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
          error={p.priceTooHigh ? `Harga melebihi batas. Maksimal Rp ${MAX_HARGA.toLocaleString("id-ID")}.` : undefined}
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
