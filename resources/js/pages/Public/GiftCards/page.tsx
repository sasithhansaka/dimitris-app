import { Head } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import {
    GiftCardCard,
    type GiftCard,
} from "@/components/gift-cards/GiftCardCard";

type Props = {
    giftCards: GiftCard[];
    favoriteGiftCardIds: number[];
};

export default function GiftCardsPage({
    giftCards,
    favoriteGiftCardIds,
}: Props) {
    return (
        <>
            <Head title="Gift Cards" />
            <Container className="pt-9 pb-8 lg:pt-12">
                <header className="max-w-180">
                    <h1 className="u-display text-[2.35rem] leading-[1.03] text-ink sm:text-[3.1rem]">
                        Gift Cards
                    </h1>
                    <p className="mt-4 max-w-[58ch] text-[1rem] leading-relaxed text-ink-2">
                        Gift cards from brands and businesses you like. Browse
                        what is available and save an idea to your Wallet for
                        later.
                    </p>
                </header>
                <div className="mt-8 flex items-end justify-between gap-4 border-t border-rule pt-5">
                    <div>
                        <h2 className="u-display text-[1.65rem] leading-tight">
                            Available gift cards
                        </h2>
                        <p className="mt-1 text-[0.85rem] text-ink-3">
                            Discovery and saving only
                        </p>
                    </div>
                    <p className="u-nums hidden text-[0.82rem] text-ink-3 sm:block">
                        {giftCards.length} cards
                    </p>
                </div>
                {giftCards.length > 0 ? (
                    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {giftCards.map((giftCard) => (
                            <GiftCardCard
                                key={giftCard.id}
                                giftCard={giftCard}
                                isFavorited={favoriteGiftCardIds.includes(
                                    giftCard.id,
                                )}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="mt-6 border-t border-rule pt-6 text-[0.9rem] text-ink-3">
                        No active gift cards right now. Check back soon.
                    </p>
                )}
            </Container>
        </>
    );
}
