import { Link } from "@inertiajs/react";
import { BrandLogo } from "@/components/brands/BrandLogo";
import { GiftCardVisual, type GiftCard } from "./GiftCardVisual";
import { GiftCardSaveButton } from "./GiftCardSaveButton";

export type { GiftCard };

export function GiftCardCard({ giftCard }: { giftCard: GiftCard }) {
  return (
    <article className="u-lift flex h-full flex-col overflow-hidden rounded-md border border-rule bg-surface">
      <Link href={`/gift-cards/${giftCard.slug}`} className="block focus-visible:outline-offset-[-2px]">
        <GiftCardVisual giftCard={giftCard} className="aspect-16/10" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <BrandLogo brand={giftCard.brand} size="xs" />
          <span className="u-label truncate text-ink-2">{giftCard.brand.name}</span>
          <span className="u-label ml-auto text-ink-3">Gift card</span>
        </div>
        <Link href={`/gift-cards/${giftCard.slug}`} className="mt-3 rounded-sm">
          <h3 className="text-[1rem] leading-snug font-semibold tracking-[-0.015em] text-ink hover:text-brand">{giftCard.title}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-[0.82rem] leading-relaxed text-ink-3">{giftCard.description}</p>
        <p className="mt-4 border-t border-rule pt-3 text-[0.82rem] font-semibold text-ink">{giftCard.valueLabels.join(" / ")}</p>
        <GiftCardSaveButton giftCardId={giftCard.id} title={giftCard.title} className="mt-4 w-full" />
      </div>
    </article>
  );
}
