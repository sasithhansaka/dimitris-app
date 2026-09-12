import { Head } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import {
    CatalogOfferCard,
    type Offer,
} from "@/components/offers/CatalogOfferCard";

type Props = {
    offers: Offer[];
};

export default function OffersPage({ offers }: Props) {
    return (
        <>
            <Head title="Offers" />
            <Container className="pt-9 pb-8 lg:pt-12">
                <header className="max-w-190">
                    <h1 className="u-display text-[2.35rem] leading-[1.03] text-ink sm:text-[3.1rem]">
                        Offers and catalogs
                    </h1>
                    <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-ink-2">
                        Explore seasonal promotions, product collections and
                        business campaigns. Some offers include a separate
                        coupon you can choose to claim.
                    </p>
                </header>
                <div className="mt-8 flex items-end justify-between gap-4 border-t border-rule pt-5">
                    <div>
                        <h2 className="u-display text-[1.65rem] leading-tight">
                            Latest offers
                        </h2>
                        <p className="mt-1 text-[0.85rem] text-ink-3">
                            Promotions and product discovery
                        </p>
                    </div>
                    <p className="u-nums hidden text-[0.82rem] text-ink-3 sm:block">
                        {offers.length} offers
                    </p>
                </div>
                {offers.length > 0 ? (
                    <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {offers.map((offer) => (
                            <CatalogOfferCard key={offer.id} offer={offer} />
                        ))}
                    </div>
                ) : (
                    <p className="mt-6 border-t border-rule pt-6 text-[0.9rem] text-ink-3">
                        No active offers right now. Check back soon.
                    </p>
                )}
            </Container>
        </>
    );
}
