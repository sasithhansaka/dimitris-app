import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { BrandLogo, type Brand } from "./BrandLogo";

export function BrandCard({ brand, className }: { brand: Brand; className?: string }) {
  return (
    <Link
      href={`/products?brand=${brand.id}`}
      className={cn(
        "u-lift group flex h-full flex-col items-start gap-3 rounded-md border border-rule bg-surface p-4 sm:p-5",
        className,
      )}
    >
      <BrandLogo brand={brand} size="lg" />
      <div className="mt-1 w-full min-w-0">
        <h3 className="truncate text-[0.975rem] leading-tight font-semibold text-ink transition-colors group-hover:text-brand">
          {brand.name}
        </h3>
        {brand.tagline && (
          <p className="mt-1 truncate text-[0.8125rem] leading-tight text-ink-3">{brand.tagline}</p>
        )}
      </div>
      {brand.activeOffers !== undefined && (
        <p className="u-nums mt-auto w-full border-t border-rule pt-3 text-[0.8125rem] font-medium text-ink-2">
          {brand.activeOffers} active offers
        </p>
      )}
    </Link>
  );
}
