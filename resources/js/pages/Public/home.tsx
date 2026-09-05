import { Head, Link, usePage } from "@inertiajs/react";
import { dashboard, login } from "@/routes";
/* @chisel-registration */
import { register } from "@/routes";
/* @end-chisel-registration */
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CouponCard, type Coupon } from "@/components/coupons/CouponCard";
import { ArrowRight, Search, TicketCheck, Trophy } from "lucide-react";

const FEATURED_COUPONS: Coupon[] = [
    {
        id: "1",
        slug: "20-off-first-order",
        title: "20% off your first order storewide",
        reward: "20% OFF",
        rewardKind: "Discount",
        validUntil: "2026-12-31",
        brand: { id: "1", name: "Northwind", logo: { monogram: "N", accent: "#2563eb", ink: "#ffffff" } },
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
        brand: { id: "2", name: "Fresco", logo: { monogram: "F", accent: "#059669", ink: "#ffffff" } },
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
        brand: { id: "3", name: "Circuit", logo: { monogram: "C", accent: "#d97706", ink: "#ffffff" } },
        productName: "Electronics",
        image: { pattern: "stack", accent: "#d97706" },
    },
];

export default function Home() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Home" />

            <section className="border-b border-rule">
                <Container className="py-9 lg:py-14">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-stretch lg:gap-12">
                        <div className="flex flex-col justify-center">
                            <h1 className="u-display max-w-[15ch] text-[2.45rem] leading-[1.01] text-ink sm:text-[3.3rem] lg:text-[3.85rem]">
                                Find the product. Claim the benefit. Enter to
                                win.
                            </h1>
                            <p className="mt-5 max-w-[55ch] text-[1.02rem] leading-relaxed text-ink-2">
                                Two clear ways to take part: register product
                                coupons with a receipt, or enter prize
                                competitions using the method shown.{" "}
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
                                    placeholder="Search products, brands, stores…"
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

            <div className="flex flex-col items-center gap-4 p-6 text-sm lg:p-8">
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
                        {/* @chisel-registration */}
                        <Link
                            href={register()}
                            className="inline-block rounded-sm border border-rule px-5 py-1.5 text-sm leading-normal text-ink hover:bg-paper-deep"
                        >
                            Register
                        </Link>
                        {/* @end-chisel-registration */}
                    </div>
                )}
            </div>
        </>
    );
}
