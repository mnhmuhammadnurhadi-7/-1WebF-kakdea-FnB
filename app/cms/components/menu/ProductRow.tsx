import { getImageUrl } from "@/lib/api";
import { parseVarian } from "@/lib/whatsapp";
import { Icon } from "../shared/Icon";
import { formatRupiah } from "../shared/format";
import type { Product } from "../shared/types";

type ProductRowProps = {
  product: Product;
  starred: boolean;
  onToggleStar: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function ProductRow({ product, starred, onToggleStar, onEdit, onDelete }: ProductRowProps) {
  const varian = parseVarian(product.varian);
  const tile = "flex size-8 items-center justify-center rounded-[10px] transition";
  return (
    <tr className="transition-colors hover:bg-app/70">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3.5">
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
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[14.5px] font-bold text-ink">{product.namaBarang}</span>
            {product.deskripsi && <span className="max-w-[260px] truncate text-[12px] text-faint">{product.deskripsi}</span>}
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        {varian.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {varian.map((v) => (
              <span key={v} className="rounded-full bg-sky-tint px-2.5 py-1 text-[11.5px] font-semibold text-navy">{v}</span>
            ))}
          </div>
        ) : (
          <span className="text-[12.5px] text-faint">Tanpa varian</span>
        )}
      </td>
      <td className="tabular whitespace-nowrap px-5 py-4 text-[14.5px] font-extrabold text-ink">{formatRupiah(product.hargaDefault)}</td>
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={onToggleStar}
          aria-pressed={starred}
          aria-label={starred ? "Hapus dari Produk Unggulan" : "Jadikan Produk Unggulan (maks 5)"}
          title={starred ? "Hapus dari Produk Unggulan" : "Jadikan Produk Unggulan (maks 5)"}
          className={"flex size-9 items-center justify-center rounded-xl transition " + (starred ? "bg-[#FFF4D6] text-[#F59E0B] hover:bg-[#FFEBB8]" : "bg-app text-faint hover:text-[#F59E0B]")}
        >
          <Icon name="star" size={17} fill={starred ? "currentColor" : "none"} />
        </button>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1.5">
          <button type="button" aria-label="Edit menu" onClick={onEdit} className={tile + " bg-[#e8f0ff] text-brand hover:bg-brand/20"}>
            <Icon name="pencil" size={15} stroke={2} />
          </button>
          <button type="button" aria-label="Hapus menu" onClick={onDelete} className={tile + " bg-bad-tint text-bad hover:bg-bad/20"}>
            <Icon name="trash" size={15} stroke={2} />
          </button>
        </div>
      </td>
    </tr>
  );
}
