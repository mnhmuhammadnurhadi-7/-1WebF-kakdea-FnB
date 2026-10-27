import { Icon } from "../shared/Icon";
import { Panel } from "../ui/Panel";
import { ProductRow } from "./ProductRow";
import { MAX_UNGGULAN } from "../shared/constants";
import type { Product } from "../shared/types";

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
      <div className="flex flex-col gap-1 border-b border-line-soft px-6 py-5">
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
        <div className="py-12 text-center text-faint">Belum ada menu makanan</div>
      ) : (
        <div className="overflow-x-auto">
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
      )}
    </Panel>
  );
}
