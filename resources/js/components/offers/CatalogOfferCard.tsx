import { Link } from "@inertiajs/react";
import { ArrowRight, CalendarDays, TicketCheck } from "lucide-react";
import { BrandLogo, type Brand } from "@/components/brands/BrandLogo";
import { PromoPlate, type PlatePattern } from "@/components/ui/PromoPlate";

export type Offer = {
  id: string;
  slug: string;
  title: string;
  description: string;
  validUntil: string;
  brand: Brand;
  relatedCouponSlug?: string;
  image: {
    pattern: PlatePattern;
    accent: string;
    tone?: "light" | "dark";
  };
};

const DATE_FORMAT = new Intl.DateTimeFormat("en", { day: "numeric", month: "short" });

export function CatalogOfferCard({ offer }: { offer: Offer }) {
  return (
    <article className="u-lift group flex h-full flex-col overflow-hidden rounded-md border border-rule bg-surface">
      <Link href={`/offers/${offer.slug}`} className="block focus-visible:outline-offset-[-2px]">
        <div className="relative aspect-16/10 overflow-hidden bg-paper-deep">
          <PromoPlate {...offer.image} className="size-full" />
          {offer.relatedCouponSlug && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-sm bg-white px-2.5 py-1.5 text-[0.72rem] font-semibold text-brand-ink shadow-[0_1px_3px_rgba(20,21,28,0.12)]">
              <TicketCheck className="size-3.5" aria-hidden="true" />
              Coupon available
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <BrandLogo brand={offer.brand} size="xs" />
          <span className="u-label truncate text-ink-2">{offer.brand.name}</span>
          <span className="u-label ml-auto text-ink-3">Offer</span>
        </div>
        <Link href={`/offers/${offer.slug}`} className="mt-3 rounded-sm">
          <h3 className="text-[1.05rem] leading-snug font-semibold tracking-[-0.015em] text-ink transition-colors group-hover:text-brand">
            {offer.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-[0.82rem] leading-relaxed text-ink-3">{offer.description}</p>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-rule pt-4">
          <p className="flex items-center gap-1.5 text-[0.76rem] text-ink-3">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            Until {DATE_FORMAT.format(new Date(`${offer.validUntil}T12:00:00`))}
          </p>
          <Link
            href={`/offers/${offer.slug}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-[0.82rem] font-semibold text-brand hover:text-brand-hover"
          >
            View offer <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
