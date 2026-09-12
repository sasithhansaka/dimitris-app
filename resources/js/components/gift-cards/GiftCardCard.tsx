import { Link } from "@inertiajs/react";
import { currencySymbol } from "@/lib/currencies";
import { GiftCardSaveButton } from "./GiftCardSaveButton";

export type GiftCard = {
    id: number;
    name: string;
    description: string;
    image: string | null;
    amount: string;
    currency: string;
    brand: {
        id: number;
        name: string;
        logo: string | null;
    };
};

export function GiftCardCard({
    giftCard,
    isFavorited = false,
}: {
    giftCard: GiftCard;
    isFavorited?: boolean;
}) {
    const symbol = currencySymbol(giftCard.currency);
    const prices = giftCard.amount
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

    return (
        <article className="u-lift flex h-full flex-col overflow-hidden rounded-md border border-rule bg-surface">
            <Link
                href={`/gift-cards/${giftCard.id}`}
                className="relative flex aspect-16/10 items-center justify-center overflow-hidden bg-white"
            >
                {giftCard.image ? (
                    <img
                        src={`/storage/${giftCard.image}`}
                        alt={giftCard.name}
                        className="h-4/5 w-4/5 object-contain"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-[0.85rem] font-semibold text-ink-3">
                        {giftCard.name}
                    </div>
                )}
            </Link>
            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2">
                    {giftCard.brand.logo ? (
                        <img
                            src={`/storage/${giftCard.brand.logo}`}
                            alt=""
                            className="size-5 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <span className="u-display flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-[0.6rem] font-bold text-paper">
                            {giftCard.brand.name.slice(0, 2).toUpperCase()}
                        </span>
                    )}
                    <span className="u-label truncate text-ink-2">
                        {giftCard.brand.name}
                    </span>
                    <span className="u-label ml-auto text-ink-3">
                        Gift card
                    </span>
                </div>
                <h3 className="mt-3 text-[1rem] leading-snug font-semibold tracking-[-0.015em] text-ink">
                    <Link href={`/gift-cards/${giftCard.id}`}>
                        {giftCard.name}
                    </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-[0.82rem] leading-relaxed text-ink-3">
                    {giftCard.description}
                </p>
                {prices.length > 0 && (
                    <p className="mt-4 border-t border-rule pt-3 text-[0.82rem] font-semibold text-ink">
                      from  {prices.map((price) => `${symbol}${price}`).join(" / ")}
                    </p>
                )}
                <GiftCardSaveButton
                    giftCardId={giftCard.id}
                    title={giftCard.name}
                    initialSaved={isFavorited}
                    className="mt-4 w-full"
                />
            </div>
        </article>
    );
}
