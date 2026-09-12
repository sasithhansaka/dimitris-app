import { Head, Link, usePage } from "@inertiajs/react";
import { dashboard, login } from "@/routes";
/* @chisel-registration */
import { register } from "@/routes";
/* @end-chisel-registration */
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CouponCard, type Coupon } from "@/components/coupons/CouponCard";
import { ProductCard, type Product } from "@/components/products/ProductCard";
import {
    CompetitionCard,
    type Competition,
} from "@/components/competitions/CompetitionCard";
import {
    CatalogOfferCard,
    type Offer,
} from "@/components/offers/CatalogOfferCard";
import { BrandCard } from "@/components/brands/BrandCard";
import type { Brand } from "@/components/brands/BrandLogo";
import {
    GiftCardCard,
    type GiftCard,
} from "@/components/gift-cards/GiftCardCard";
import { ArticleCard } from "@/components/articles/ArticleCard";
import type { Article } from "@/types/article";
import { ArrowRight, Search, TicketCheck, Trophy } from "lucide-react";
import { ArticleCardHome } from "@/components/articles/ArticleCard-home";

const FEATURED_COUPONS: Coupon[] = [
    {
        id: "1",
        slug: "20-off-first-order",
        title: "20% off your first order storewide",
        reward: "20% OFF",
        rewardKind: "Discount",
        validUntil: "2026-12-31",
        brand: {
            id: "1",
            name: "Northwind",
            logo: { monogram: "N", accent: "#2563eb", ink: "#ffffff" },
        },
        productName: "Storewide",
        image: { pattern: "arcs", accent: "#2563eb" },
    },
    {
        id: "2",
        slug: "buy-one-get-one-free",
        title: "Buy one, get one free on selected snacks",
        reward: "BOGO",
        rewardKind: "Bundle",
        validUntil: "2026-11-30",
        brand: {
            id: "2",
            name: "Fresco",
            logo: { monogram: "F", accent: "#059669", ink: "#ffffff" },
        },
        productName: "Snacks range",
        image: { pattern: "orbit", accent: "#059669" },
    },
    {
        id: "3",
        slug: "5-cashback-electronics",
        title: "5% cashback on electronics purchases",
        reward: "5% BACK",
        rewardKind: "Cashback",
        validUntil: "2026-10-31",
        brand: {
            id: "3",
            name: "Circuit",
            logo: { monogram: "C", accent: "#d97706", ink: "#ffffff" },
        },
        productName: "Electronics",
        image: { pattern: "stack", accent: "#d97706" },
    },
];

const FEATURED_COMPETITIONS: Competition[] = [
    {
        id: "1",
        slug: "win-a-year-of-coffee",
        title: "Win a year's supply of coffee",
        prize: "12x monthly coffee subscription boxes",
        validUntil: "2026-12-15",
        entryMethod: "receipt",
        brand: {
            id: "2",
            name: "Fresco",
            logo: { monogram: "F", accent: "#059669", ink: "#ffffff" },
        },
        image: { pattern: "peak", accent: "#059669" },
    },
    {
        id: "2",
        slug: "headphones-giveaway",
        title: "Premium headphones giveaway",
        prize: "1x Wireless Noise-Cancelling Headphones",
        validUntil: "2026-11-20",
        entryMethod: "code",
        brand: {
            id: "3",
            name: "Circuit",
            logo: { monogram: "C", accent: "#d97706", ink: "#ffffff" },
        },
        image: { pattern: "beam", accent: "#d97706" },
    },
    {
        id: "3",
        slug: "home-makeover-prize",
        title: "Home makeover prize draw",
        prize: "$1,000 home decor voucher",
        validUntil: "2026-10-05",
        entryMethod: "qr",
        brand: {
            id: "4",
            name: "Hearth",
            logo: { monogram: "H", accent: "#7c3aed", ink: "#ffffff" },
        },
        image: { pattern: "bloom", accent: "#7c3aed" },
    },
];

const POPULAR_BRANDS: Brand[] = [
    {
        id: "1",
        name: "Northwind",
        tagline: "Everyday essentials",
        activeOffers: 4,
        logo: { monogram: "N", accent: "#2563eb", ink: "#ffffff" },
    },
    {
        id: "2",
        name: "Fresco",
        tagline: "Fresh groceries",
        activeOffers: 3,
        logo: { monogram: "F", accent: "#059669", ink: "#ffffff" },
    },
    {
        id: "3",
        name: "Circuit",
        tagline: "Electronics & tech",
        activeOffers: 5,
        logo: { monogram: "C", accent: "#d97706", ink: "#ffffff" },
    },
    {
        id: "4",
        name: "Hearth",
        tagline: "Home & living",
        activeOffers: 2,
        logo: { monogram: "H", accent: "#7c3aed", ink: "#ffffff" },
    },
    {
        id: "5",
        name: "Solace",
        tagline: "Beauty & wellness",
        activeOffers: 3,
        logo: { monogram: "S", accent: "#dc2626", ink: "#ffffff" },
    },
    {
        id: "6",
        name: "Uplift",
        tagline: "Sports & outdoors",
        activeOffers: 1,
        logo: { monogram: "U", accent: "#0f766e", ink: "#ffffff" },
    },
];

type Props = {
    featuredProducts: Product[];
    featuredOffers: Offer[];
    featuredGiftCards: GiftCard[];
    featuredArticles: Article[];
};

export default function Home({
    featuredProducts,
    featuredOffers,
    featuredGiftCards,
    featuredArticles,
}: Props) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Home" />

            <section className="border-b border-rule">
                <Container className="py-9 lg:py-14">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-stretch lg:gap-12">
                        <div className="flex flex-col justify-center">
                            <h1 className="u-display max-w-[15ch] text-[2.45rem] leading-[1.01] text-ink sm:text-[3.3rem] lg:text-[3.85rem]">
                                More ways to get rewarded.
                            </h1>
                            <p className="mt-5 max-w-[55ch] text-[1.02rem] leading-relaxed text-ink-2">
                                Claim coupon benefits, collect loyalty stamps,
                                or enter prize competitions — with every next
                                step made clear.
                            </p>
                            <form
                                action="/products"
                                role="search"
                                className="mt-7 flex max-w-[600px] items-center gap-2 rounded-md border border-rule-strong bg-surface p-1.5 pl-4 focus-within:border-brand"
                            >
                                <Search
                                    className="size-5 shrink-0 text-ink-3"
                                    aria-hidden="true"
                                />
                                <input
                                    name="q"
                                    type="search"
                                    placeholder="Search By Product Name"
                                    aria-label="Search product by name"
                                    className="min-h-11 min-w-0 flex-1 bg-transparent px-1 text-[0.92rem] outline-none"
                                />
                                <button
                                    type="submit"
                                    className="min-h-11 shrink-0 rounded-md bg-brand px-5 text-[0.86rem] font-semibold text-paper hover:bg-brand-hover"
                                >
                                    Search
                                </button>
                            </form>
                            <div className="mt-5 flex flex-wrap gap-2 text-[0.8rem] text-ink-3">
                                <span>Or browse</span>
                                <Link
                                    href="/products"
                                    className="font-semibold text-brand hover:underline"
                                >
                                    by brand
                                </Link>
                                <span>·</span>
                                <Link
                                    href="/products"
                                    className="font-semibold text-brand hover:underline"
                                >
                                    by category
                                </Link>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            <Link
                                href="/coupons"
                                className="group flex min-h-57.5 flex-col justify-between rounded-lg bg-brand p-6 text-paper transition-colors hover:bg-brand-hover"
                            >
                                <TicketCheck
                                    className="size-8"
                                    aria-hidden="true"
                                />
                                <div>
                                    <h2 className="u-display text-[2rem] leading-none">
                                        Coupons
                                    </h2>
                                    <p className="mt-3 text-[0.86rem] leading-relaxed text-paper/78">
                                        Select one or more, upload a purchase
                                        receipt, and receive the validated
                                        reward.
                                    </p>
                                    <span className="mt-5 inline-flex items-center gap-2 text-[0.84rem] font-semibold">
                                        Browse coupons{" "}
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </div>
                            </Link>
                            <Link
                                href="/competitions"
                                className="group flex min-h-57.5 flex-col justify-between rounded-lg bg-ink p-6 text-paper transition-colors hover:bg-[#242631]"
                            >
                                <Trophy className="size-8" aria-hidden="true" />
                                <div>
                                    <h2 className="u-display text-[2rem] leading-none">
                                        Competitions
                                    </h2>
                                    <p className="mt-3 text-[0.86rem] leading-relaxed text-paper/70">
                                        View the prize and requirement, then
                                        register using receipt, code, QR or
                                        barcode{" "}
                                    </p>
                                    <span className="mt-5 inline-flex items-center gap-2 text-[0.84rem] font-semibold">
                                        Explore prizes{" "}
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* /products */}
            <Container as="section" className="pt-12 lg:pt-16">
                <SectionHeading
                    title="Popular products"
                    sub="Trending picks with coupons ready to claim."
                    actionLabel="All products"
                    actionHref="/products"
                />
                <div className="u-rail u-rail-mask -mx-5 mt-7 flex gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-2 lg:px-0 xl:grid-cols-4">
                    {featuredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="w-[78vw] max-w-[300px] shrink-0 lg:w-auto lg:max-w-none"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </Container>
            {/* featureed  coupons  */}
            <Container as="section" className="pt-14 lg:pt-20">
                <SectionHeading
                    title="Featured coupons"
                    sub="Hand-picked offers worth claiming this week."
                    actionLabel="All coupons"
                    actionHref="/coupons"
                />
                <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {FEATURED_COUPONS.map((coupon) => (
                        <CouponCard key={coupon.id} coupon={coupon} />
                    ))}
                </div>
            </Container>

            {/* competitions */}

            <Container as="section" className="pt-14 lg:pt-20">
                <SectionHeading
                    title="Featured competitions"
                    sub="Enter for a chance to win great prizes."
                    actionLabel="All competitions"
                    actionHref="/competitions"
                />
                <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {FEATURED_COMPETITIONS.map((competition, index) => (
                        <CompetitionCard
                            key={competition.id}
                            competition={competition}
                            featured={index === 0}
                        />
                    ))}
                </div>
            </Container>

            {/* promotions */}
            <Container as="section" className="pt-14 lg:pt-20">
                <SectionHeading
                    title="Latest offers"
                    sub="Explore promotions and product collections from familiar businesses."
                    actionLabel="View all offers"
                    actionHref="/offers"
                />
                {featuredOffers.length > 0 ? (
                    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {featuredOffers.map((offer) => (
                            <CatalogOfferCard key={offer.id} offer={offer} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-7 rounded-lg border border-dashed border-rule-strong bg-surface px-6 py-14 text-center">
                        <p className="text-[0.9rem] text-ink-3">No offers</p>
                    </div>
                )}
            </Container>

            {/* brands */}

            <Container as="section" className="pt-14 lg:pt-20">
                <SectionHeading
                    title="Popular brands"
                    sub="Discover offers and products from businesses shoppers trust."
                    actionLabel="Browse products"
                    actionHref="/products"
                />
                <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-5 xl:grid-cols-6">
                    {POPULAR_BRANDS.map((brand) => (
                        <BrandCard key={brand.id} brand={brand} />
                    ))}
                </div>
            </Container>

            <Container as="section" className="pt-14 lg:pt-20">
                <SectionHeading
                    title="Gift cards"
                    sub="Save gift cards from businesses you like for later."
                    actionLabel="Browse gift cards"
                    actionHref="/gift-cards"
                />
                {featuredGiftCards.length > 0 ? (
                    <div className="u-rail u-rail-mask-sm -mx-5 mt-7 flex gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 xl:grid-cols-4">
                        {featuredGiftCards.map((giftCard) => (
                            <div
                                key={giftCard.id}
                                className="w-[78vw] max-w-77.5 shrink-0 sm:w-auto sm:max-w-none"
                            >
                                <GiftCardCard giftCard={giftCard} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-7 rounded-lg border border-dashed border-rule-strong bg-surface px-6 py-14 text-center">
                        <p className="text-[0.9rem] text-ink-3">
                            No gift cards
                        </p>
                    </div>
                )}
            </Container>
            <Container as="section" className="pt-14 lg:pt-20">
                <SectionHeading
                    title="From the blog"
                    sub="Guides and ideas for coupons, receipts and competitions."
                    actionLabel="All articles"
                    actionHref="/articles"
                />
                {featuredArticles.length > 0 ? (
                    <div className="mt-7 grid gap-5 sm:grid-cols-3">
                        {featuredArticles.map((article) => (
                            <ArticleCardHome key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-7 rounded-lg border border-dashed border-rule-strong bg-surface px-6 py-14 text-center">
                        <p className="text-[0.9rem] text-ink-3">No articles</p>
                    </div>
                )}
            </Container>

            {/* 
//////////

s
s
s
s
s
s

s
s
s
ss

ss





            //////////
            <SelectionBar /> */}

            {/* <div className="flex flex-col items-center gap-4 p-6 text-sm lg:p-8">
                {auth.user ? (
                    <Link
                        href={dashboard()}
                        className="inline-block rounded-sm border border-rule px-5 py-1.5 text-sm leading-normal text-ink hover:bg-paper-deep"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            href={login()}
                            className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-ink hover:border-rule"
                        >
                            Log in
                        </Link>
=                        <Link
                            href={register()}
                            className="inline-block rounded-sm border border-rule px-5 py-1.5 text-sm leading-normal text-ink hover:bg-paper-deep"
                        >
                            Register
                        </Link>
=                    </div>
                )}
            </div> */}
        </>
    );
}
