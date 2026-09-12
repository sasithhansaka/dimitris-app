import { ArrowRight, Tag } from "lucide-react";

export type Product = {
    id: number;
    name: string;
    description: string;
    image: string;
    brand: {
        id: number;
        name: string;
        logo: string | null;
    };
    category: {
        id: number;
        name: string;
    };
    coupons_count: number;
};

export function ProductCard({ product }: { product: Product }) {
    const hasCoupons = product.coupons_count > 0;

    return (
        <article className="u-lift group flex h-full flex-col overflow-hidden rounded-md border border-rule bg-surface">
            <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-white">
                <img
                    src={`/storage/${product.image}`}
                    alt={product.name}
                    className="h-4/5 w-4/5 object-contain"
                />
                {hasCoupons && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-sm bg-white px-2.5 py-1.5 text-[0.72rem] font-semibold text-brand-ink shadow-[0_1px_3px_rgba(20,21,28,0.12)]">
                        <Tag className="size-3.5" aria-hidden="true" />
                        Coupon available
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2">
                    {product.brand.logo ? (
                        <img
                            src={`/storage/${product.brand.logo}`}
                            alt=""
                            className="size-5 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <span className="u-display flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-[0.6rem] font-bold text-paper">
                            {product.brand.name.slice(0, 2).toUpperCase()}
                        </span>
                    )}
                    <span className="u-label truncate text-ink-2">
                        {product.brand.name}
                    </span>
                    <span className="u-label ml-auto text-ink-3">
                        {product.category.name}
                    </span>
                </div>
                <h3 className="mt-3 text-[1.025rem] leading-snug font-semibold tracking-[-0.015em] text-ink">
                    {product.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-[0.82rem] leading-relaxed text-ink-3">
                    {product.description}
                </p>

                <div className="mt-4 border-t border-rule pt-3">
                    {hasCoupons ? (
                        <button
                            type="button"
                            className="inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-md bg-brand px-4 py-2.5 text-[0.85rem] font-semibold text-paper transition-colors hover:bg-brand-hover"
                        >
                            <span className="truncate">See details</span>
                            <ArrowRight
                                className="size-4 shrink-0"
                                aria-hidden="true"
                            />
                        </button>
                    ) : (
                        <p className="flex min-h-11 items-center text-[0.82rem] leading-snug text-ink-3">
                            No coupons available
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}
