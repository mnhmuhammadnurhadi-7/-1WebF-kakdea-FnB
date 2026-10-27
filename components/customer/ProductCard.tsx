import { ProductVisual } from "@/components/customer/ProductVisual";
import { WhatsAppIcon } from "@/components/customer/icons";
import { parseVarian } from "@/lib/whatsapp";

interface ProductCardProps {
  product: any;
  onOpen: (product: any) => void;
  badge?: string;
  imageHeight?: number;
  showDescription?: boolean;
  className?: string;
}

/** Satu kartu = satu tombol: seluruh area bisa diklik dan membuka form pesanan. */
export function ProductCard({ product, onOpen, badge, imageHeight = 190, showDescription = false, className = "" }: ProductCardProps) {
  const varian = parseVarian(product.varian);
  const varianHint = varian.length > 1 ? `${varian.length} varian` : varian[0];

  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      aria-label={`Pesan ${product.namaBarang}`}
      className={`c-card group flex w-full flex-col overflow-hidden rounded-2xl bg-white text-left ${className}`}
    >
      <div className="relative w-full overflow-hidden" style={{ height: imageHeight, backgroundColor: "#F2F3FF" }}>
        <ProductVisual src={product.gambar} alt={product.namaBarang} className="c-card-img" />
        {badge && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
            style={{ backgroundColor: "rgba(0,35,111,0.88)", color: "#82F5C1" }}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug" style={{ color: "#131B2E" }}>
          {product.namaBarang}
        </h3>
        {varianHint && (
          <span className="text-[12.5px]" style={{ color: "#757682" }}>
            {varianHint}
          </span>
        )}
        {showDescription && product.deskripsi && (
          <p className="mt-1 line-clamp-2 text-[13.5px] leading-[20px]" style={{ color: "#444651" }}>
            {product.deskripsi}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-[16px] font-bold tabular-nums" style={{ color: "#00236F" }}>
            Rp {Number(product.hargaDefault || 0).toLocaleString("id-ID")}
          </span>
          <span
            className="c-card-cta inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            {WhatsAppIcon}
            Pesan
          </span>
        </div>
      </div>
    </button>
  );
}
