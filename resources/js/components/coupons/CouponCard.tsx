import { Link } from "@inertiajs/react";
import { CalendarDays } from "lucide-react";
import { PromoPlate, type PlatePattern } from "@/components/ui/PromoPlate";
import { BrandLogo, type Brand } from "@/components/brands/BrandLogo";
import { CouponActions } from "./CouponActions";

export type Coupon = {
    id: string;
    slug: string;
    title: string;
    reward: string;
    rewardKind: string;
    validUntil: string;
    brand: Brand;
    productName?: string;
    image: {
        pattern: PlatePattern;
        accent: string;
        tone?: "light" | "dark";
    };
};

const DATE_FORMAT = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
});

export function CouponCard({ coupon }: { coupon: Coupon }) {
    return (
        <article className="u-lift flex h-full flex-col overflow-hidden rounded-md border border-rule bg-surface">
            <Link
                href={`/coupons/${coupon.slug}`}
                className="group block focus-visible:outline-offset-[-2px]"
            >
                <div className="relative aspect-16/10 overflow-hidden bg-paper-deep">
                    <PromoPlate {...coupon.image} className="size-full" />
                    <div className="absolute top-3 left-3 max-w-[75%] rounded-sm bg-white px-3 py-2 shadow-[0_1px_3px_rgba(20,21,28,0.12)]">
                        <p className="u-value text-[1.45rem] leading-none text-ink">
                            {coupon.reward}
                        </p>
                        <p className="u-label mt-1 text-brand-ink">
                            {coupon.rewardKind}
                        </p>
                    </div>
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2">
                    <BrandLogo brand={coupon.brand} size="xs" />
                    <span className="u-label truncate text-ink-2">
                        {coupon.brand.name}
                    </span>
                    <span className="u-label ml-auto text-ink-3">Coupon</span>
                </div>
                <Link
                    href={`/coupons/${coupon.slug}`}
                    className="mt-3 rounded-sm"
                >
                    <h3 className="line-clamp-2 min-h-[2.64em] text-[0.975rem] leading-[1.32] font-semibold tracking-[-0.015em] text-ink hover:text-brand">
                        {coupon.title}
                    </h3>
                </Link>
                {coupon.productName && (
                    <p className="mt-1 line-clamp-1 text-[0.81rem] text-ink-3">
                        {coupon.productName}
                    </p>
                )}
                <p className="mt-3 flex items-center gap-1.5 border-t border-rule pt-3 text-[0.79rem] font-medium text-ink-2">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    Valid until{" "}
                    {DATE_FORMAT.format(
                        new Date(`${coupon.validUntil}T12:00:00`),
                    )}
                </p>
                <div className="mt-3">
                    <CouponActions
                        couponId={coupon.id}
                        title={coupon.title}
                        stacked
                    />
                </div>
            </div>
        </article>
    );
}
