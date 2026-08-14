import { Link } from "react-router-dom";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { openWhatsAppWithTracking } from "@/lib/whatsapp";
import commercialImage from "@/assets/mega-commercial.jpg";
import filtersImage from "@/assets/mega-filters.jpg";
import gravityImage from "@/assets/mega-gravity.jpg";
import uvImage from "@/assets/mega-uv.jpg";
import accessoriesImage from "@/assets/mega-accessories.jpg";

const fallbackProductImage = "/images/premium-ro-purifier.png";

const categoryImages: Record<string, string> = {
  commercial: commercialImage,
  "filters-cartridges": filtersImage,
  "gravity-purifiers": gravityImage,
  "uv-purifiers": uvImage,
  accessories: accessoriesImage,
};

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] === "/placeholder.svg"
    ? categoryImages[product.category] || fallbackProductImage
    : product.images[0];

  const handleWhatsApp = () => {
    openWhatsAppWithTracking(
      `Product Card: ${product.name}`,
      `Hi! I'd like to order ${product.name} — ₹${product.price.selling.toLocaleString("en-IN")}. Please share delivery and installation details.`,
    );
  };

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
      <Link to={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-[#f7f8fa]">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04] sm:p-5"
        />
        {product.price.discount > 0 && (
          <span className="absolute left-2 top-2 rounded bg-emerald-700 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white sm:left-3 sm:top-3 sm:text-[10px]">
            {product.price.discount}% off
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-2 min-h-10 font-heading text-sm font-semibold leading-5 text-[#082456] transition-colors hover:text-primary sm:min-h-12 sm:text-base sm:leading-6">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded bg-emerald-700 px-1.5 py-0.5 text-[10px] font-bold text-white sm:text-xs">
            {product.rating} <Star className="h-2.5 w-2.5 fill-current" />
          </span>
          <span className="text-[10px] text-slate-500 sm:text-xs">{product.reviewCount} ratings</span>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-heading text-lg font-bold text-slate-950 sm:text-xl">₹{product.price.selling.toLocaleString("en-IN")}</span>
          {product.price.original > product.price.selling && (
            <span className="text-[11px] text-slate-600 line-through sm:text-sm">₹{product.price.original.toLocaleString("en-IN")}</span>
          )}
        </div>

        <p className="mt-2 flex items-center gap-1 text-[10px] font-medium text-emerald-700 sm:text-xs">
          <Check className="h-3.5 w-3.5" /> Free installation available
        </p>

        <div className="mt-auto pt-4">
          <Button
            type="button"
            onClick={handleWhatsApp}
            className="h-10 w-full rounded-full bg-[#047857] px-3 font-heading text-[11px] font-bold text-white hover:bg-[#036747] sm:h-11 sm:text-sm"
          >
            <img src="/images/whatsapp-logo.svg" alt="" aria-hidden="true" className="mr-1.5 h-4 w-4 shrink-0 brightness-0 invert sm:mr-2" />
            <span className="truncate">Order on WhatsApp</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
