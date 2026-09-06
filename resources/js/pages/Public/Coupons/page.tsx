import { Head } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import { CouponsView } from "@/components/coupons/CouponsView";

export default function CouponsPage() {
    return (
        <>
            <Head title="Coupons" />
            <Container className="pt-9 pb-24 lg:pt-12 lg:pb-28">
                <header className="grid gap-5 lg:grid-cols-[1fr_380px] lg:items-end">
                    <div>
                        <h1 className="u-display text-[2.35rem] leading-[1.03] text-ink sm:text-[3.1rem]">
                            Coupons
                        </h1>
                        <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-ink-2">
                            Select one or more coupons and register them with
                            one purchase receipt.
                        </p>
                    </div>
                    <div className="border-t border-rule pt-4 text-[0.82rem] leading-relaxed text-ink-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
                        <p>
                            <strong className="text-ink">1.</strong> Select
                            coupon(s)
                        </p>
                        <p className="mt-1">
                            <strong className="text-ink">2.</strong> Purchase
                            the product(s)
                        </p>
                        <p className="mt-1">
                            <strong className="text-ink">3.</strong> Upload one
                            clear receipt for validation
                        </p>
                    </div>
                </header>
                <CouponsView />
            </Container>
        </>
    );
}
