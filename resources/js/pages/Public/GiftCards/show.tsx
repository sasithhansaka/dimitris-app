import { Head, Link } from "@inertiajs/react";
import { ChevronRight, Info, Wallet } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GiftCardSaveButton } from "@/components/gift-cards/GiftCardSaveButton";
import { currencySymbol } from "@/lib/currencies";
import type { GiftCard } from "@/types/giftCard";

export default function GiftCardShowPage({
    giftCard,
    isFavorited = false,
}: {
    giftCard: GiftCard;
    isFavorited?: boolean;
}) {
    const brand = giftCard.brand;
    const symbol = currencySymbol(giftCard.currency);
    const values = giftCard.amount
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

    return (
        <>
            <Head title={giftCard.name} />
            <Container className="pt-6 pb-8 lg:pt-10">
                <nav aria-label="Breadcrumb">
                    <ol className="flex items-center gap-1.5 text-[0.82rem] text-ink-3">
                        <li>
                            <Link href="/gift-cards" className="hover:text-ink">
                                Gift Cards
                            </Link>
                        </li>
                        <li>
                            <ChevronRight
                                className="size-3.5"
                                aria-hidden="true"
                            />
                        </li>
                        <li className="truncate text-ink-2" aria-current="page">
                            {giftCard.name}
                        </li>
                    </ol>
                </nav>
                <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-12">
                    <div className="relative flex aspect-16/10 items-center justify-center overflow-hidden rounded-lg border border-rule bg-white">
                        {giftCard.image ? (
                            <img
                                src={`/storage/${giftCard.image}`}
                                alt={giftCard.name}
                                className="h-4/5 w-4/5 object-contain"
                            />
                        ) : (
                            <div className="flex size-full items-center justify-center text-[1rem] font-semibold text-ink-3">
                                {giftCard.name}
                            </div>
                        )}
                    </div>
                    <aside className="lg:sticky lg:top-[92px] lg:self-start">
                        <div className="rounded-lg border border-rule bg-surface p-5 sm:p-6">
                            <div className="flex items-center gap-3">
                                {brand?.logo ? (
                                    <img
                                        src={`/storage/${brand.logo}`}
                                        alt=""
                                        className="size-10 shrink-0 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="u-display flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-[0.85rem] font-bold text-paper">
                                        {(brand?.name ?? "?")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </span>
                                )}
                                <div>
                                    <p className="u-label text-ink-3">
                                        Business
                                    </p>
                                    <p className="mt-1 font-semibold text-ink">
                                        {brand?.name}
                                    </p>
                                </div>
                            </div>
                            <h1 className="u-display mt-6 text-[2rem] leading-[1.05] text-ink sm:text-[2.3rem]">
                                {giftCard.name}
                            </h1>
                            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-2">
                                {giftCard.description}
                            </p>
                            {values.length > 0 && (
                                <div className="mt-6 border-y border-rule py-4">
                                    <p className="u-label text-ink-3">
                                        Possible values
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {values.map((value) => (
                                            <span
                                                key={value}
                                                className="rounded-sm border border-rule-strong bg-paper px-3 py-2 text-[0.84rem] font-semibold text-ink"
                                            >
                                                {symbol}
                                                {value}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <GiftCardSaveButton
                                giftCardId={giftCard.id}
                                title={giftCard.name}
                                initialSaved={isFavorited}
                                className="mt-6 w-full"
                            />
                            <p className="mt-3 flex items-start gap-2 text-[0.78rem] leading-relaxed text-ink-3">
                                <Wallet
                                    className="mt-0.5 size-4 shrink-0"
                                    aria-hidden="true"
                                />
                                Saving keeps this gift idea in your Wallet. It
                                does not mean the card was purchased.
                            </p>
                        </div>
                    </aside>
                </div>
                <section className="mt-10 max-w-190 border-t border-rule pt-5">
                    <h2 className="u-display text-[1.5rem]">Terms preview</h2>
                    <p className="mt-3 flex items-start gap-3 text-[0.9rem] leading-relaxed text-ink-2">
                        <Info
                            className="mt-0.5 size-4.5 shrink-0 text-primary"
                            aria-hidden="true"
                        />
                        Available values and full use terms are set by Nike and
                        may vary by market.
                    </p>
                </section>
            </Container>
        </>
    );
}
