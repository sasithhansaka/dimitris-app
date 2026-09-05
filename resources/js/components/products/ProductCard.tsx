import { Link } from "@inertiajs/react";
import { ArrowRight, Tag } from "lucide-react";
import { BrandLogo, type Brand } from "@/components/brands/BrandLogo";
import { PromoPlate, type PlatePattern } from "@/components/ui/PromoPlate";

export type Product = {
  id: string;
  name: string;
  description: string;
  brand: Brand;
  category: { id: string; name: string };
  coupon?: { slug: string; reward: string };
  image: {
    pattern: PlatePattern;
    accent: string;
    tone?: "light" | "dark";
  };
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="u-lift group flex h-full flex-col overflow-hidden rounded-md border border-rule bg-surface">
      <div className="relative aspect-4/3 overflow-hidden bg-paper-deep">
        <PromoPlate {...product.image} className="size-full" />
        {product.coupon && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-sm bg-white px-2.5 py-1.5 text-[0.72rem] font-semibold text-brand-ink shadow-[0_1px_3px_rgba(20,21,28,0.12)]">
            <Tag className="size-3.5" aria-hidden="true" />
            Coupon available
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <BrandLogo brand={product.brand} size="xs" />
          <span className="u-label truncate text-ink-2">{product.brand.name}</span>
          <span className="u-label ml-auto text-ink-3">{product.category.name}</span>
        </div>
        <h3 className="mt-3 text-[1.025rem] leading-snug font-semibold tracking-[-0.015em] text-ink">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[0.82rem] leading-relaxed text-ink-3">
          {product.description}
        </p>

        <div className="mt-4 border-t border-rule pt-3">
          {product.coupon ? (
            <Link
              href={`/coupons/${product.coupon.slug}`}
              className="inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-md bg-brand px-4 py-2.5 text-[0.85rem] font-semibold text-paper transition-colors hover:bg-brand-hover"
            >
              <span className="truncate">{product.coupon.reward}</span>
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Link>
          ) : (
            <p className="flex min-h-11 items-center text-[0.82rem] leading-snug text-ink-3">
              No coupon available
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
