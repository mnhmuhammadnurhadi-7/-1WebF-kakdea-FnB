import { getImageUrl } from "@/lib/api";
import { parseVarian } from "@/lib/whatsapp";
import { Icon } from "./Icon";
import { Panel } from "./Panel";
import { ProductRow } from "./ProductRow";
import { MAX_UNGGULAN } from "./constants";
import { formatRupiah } from "./format";
import type { Product } from "./types";
import { InlineState } from "@/components/status/InlineState";

type MenuTabProps = {
  products: Product[];
  starredIds: number[];
  onToggleStar: (id: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
};

const TH = "px-5 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-[.08em] text-faint whitespace-nowrap";

export function MenuTab({ products, starredIds, onToggleStar, onEdit, onDelete }: MenuTabProps) {
  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-col gap-1 border-b border-line-soft px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-[18px] font-bold tracking-[-.02em] text-ink">Menu Makanan</h3>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4D6] px-3 py-1 text-[12px] font-extrabold text-[#92400E]">
            <Icon name="star" size={12} fill="currentColor" />
            {starredIds.length} / {MAX_UNGGULAN} Unggulan
          </span>
        </div>
        <p className="text-[13px] text-body">
          Klik tombol <strong>Star ⭐</strong> pada menu (maksimal {MAX_UNGGULAN}) untuk menampilkannya di bagian Produk Unggulan halaman depan.
        </p>
      </div>

      {products.length === 0 ? (
        <InlineState kind="kosong" title="Belum ada menu makanan" description="Tambah menu pertama lewat tombol “Tambah Menu” di atas." />
      ) : (
        <>
          {/* Tampilan Tabel Desktop/Tablet (>=768px) */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-[13.5px]">
              <thead className="bg-cream">
                <tr>
                  <th className={TH}>Menu</th>
                  <th className={TH}>Varian</th>
                  <th className={TH}>Harga</th>
                  <th className={TH}>Unggulan</th>
                  <th className={TH + " text-right"}>Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    starred={starredIds.includes(product.id)}
                    onToggleStar={() => onToggleStar(product.id)}
                    onEdit={() => onEdit(product)}
                    onDelete={() => onDelete(product.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Tampilan Kartu Mobile (<768px) */}
          <div className="divide-y divide-line-soft md:hidden">
            {products.map((product) => {
              const varian = parseVarian(product.varian);
              const starred = starredIds.includes(product.id);
              return (
                <article key={product.id} className="flex flex-col gap-3 p-4">
                  <div className="flex items-start gap-3">
                    {product.gambar ? (
                      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FFF1C9]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getImageUrl(product.gambar)} alt={product.namaBarang} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF1C9]">
                        <span className="text-[22px]">🍜</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="break-words text-[14.5px] font-bold text-ink">{product.namaBarang}</h4>
                      {product.deskripsi && <p className="mt-0.5 line-clamp-2 text-[12px] text-faint">{product.deskripsi}</p>}
                      <p className="tabular mt-1 text-[14.5px] font-extrabold text-ink">{formatRupiah(product.hargaDefault)}</p>
                    </div>
                  </div>

                  {varian.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {varian.map((v) => (
                        <span key={v} className="rounded-full bg-sky-tint px-2.5 py-1 text-[11.5px] font-semibold text-navy">{v}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 border-t border-line-soft pt-3">
                    <button
                      type="button"
                      onClick={() => onToggleStar(product.id)}
                      aria-pressed={starred}
                      className={
                        "inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-[12.5px] font-bold transition " +
                        (starred ? "bg-[#FFF4D6] text-[#92400E]" : "bg-app text-faint")
                      }
                    >
                      <Icon name="star" size={15} fill={starred ? "currentColor" : "none"} />
                      {starred ? "Unggulan" : "Jadikan Unggulan"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label="Edit menu"
                        onClick={() => onEdit(product)}
                        className="flex size-9 items-center justify-center rounded-[10px] bg-[#e8f0ff] text-brand transition hover:bg-brand/20"
                      >
                        <Icon name="pencil" size={15} stroke={2} />
                      </button>
                      <button
                        type="button"
                        aria-label="Hapus menu"
                        onClick={() => onDelete(product.id)}
                        className="flex size-9 items-center justify-center rounded-[10px] bg-bad-tint text-bad transition hover:bg-bad/20"
                      >
                        <Icon name="trash" size={15} stroke={2} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </Panel>
  );
}
