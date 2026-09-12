import { Head, Link } from "@inertiajs/react";
import { CalendarDays, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard, type Product } from "@/components/products/ProductCard";
import type { Offer } from "@/types/offer";

const DATE_FORMAT = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

type Props = {
    offer: Offer;
    featuredProducts: Product[];
};

export default function OfferShowPage({ offer, featuredProducts }: Props) {
    const brand = offer.brand;

    return (
        <>
            <Head title={offer.title} />
            <Container className="pt-6 pb-8 lg:pt-10">
                <nav aria-label="Breadcrumb">
                    <ol className="flex items-center gap-1.5 text-[0.82rem] text-ink-3">
                        <li>
                            <Link href="/offers" className="hover:text-ink">
                                Offers
                            </Link>
                        </li>
                        <li>
                            <ChevronRight
                                className="size-3.5"
                                aria-hidden="true"
                            />
                        </li>
                        <li className="truncate text-ink-2" aria-current="page">
                            {offer.title}
                        </li>
                    </ol>
                </nav>
                <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)] lg:gap-12">
                    <div className="relative flex aspect-16/10 items-center justify-center overflow-hidden rounded-lg border border-rule bg-white">
                        <img
                            src={`/storage/${offer.image}`}
                            alt={offer.title}
                            className="h-4/5 w-4/5 object-contain"
                        />
                    </div>
                    <header className="lg:self-center">
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
                                    Promotion by
                                </p>
                                <p className="mt-1 font-semibold text-ink">
                                    {brand?.name}
                                </p>
                            </div>
                        </div>
                        <h1 className="u-display mt-6 max-w-[15ch] text-[2.2rem] leading-[1.03] text-ink sm:text-[2.8rem]">
                            {offer.title}
                        </h1>
                        <p className="mt-4 max-w-[58ch] text-[1rem] leading-relaxed text-ink-2">
                            {offer.description}
                        </p>
                        <p className="mt-6 flex items-center gap-2 border-t border-rule pt-4 text-[0.86rem] font-medium text-ink-2">
                            <CalendarDays
                                className="size-4.5 text-primary"
                                aria-hidden="true"
                            />
                            {DATE_FORMAT.format(new Date(offer.start_date))} -{" "}
                            {DATE_FORMAT.format(new Date(offer.end_date))}
                        </p>
                    </header>
                </div>

                <section className="mt-14 lg:mt-20">
                    <SectionHeading
                        title="Featured products"
                        sub="A light look at products connected to this business campaign."
                        actionLabel="All products"
                        actionHref="/products"
                    />
                    {featuredProducts.length > 0 ? (
                        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-7 rounded-lg border border-dashed border-rule-strong bg-surface px-6 py-14 text-center">
                            <p className="text-[0.9rem] text-ink-3">
                                No featured products
                            </p>
                        </div>
                    )}
                </section>
            </Container>
        </>
    );
}
