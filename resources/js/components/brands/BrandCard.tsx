import { Link } from "@inertiajs/react";

export type Brand = {
    id: number;
    name: string;
    logo: string | null;
    offers_count: number;
};

export function BrandCard({ brand }: { brand: Brand }) {
    return (
        <article className="u-lift flex h-full flex-col overflow-hidden rounded-md border border-rule bg-surface">
            <div className="relative flex aspect-16/10 items-center justify-center overflow-hidden bg-white">
                {brand.logo ? (
                    <img
                        src={`/storage/${brand.logo}`}
                        alt={brand.name}
                        className="h-4/5 w-4/5 object-contain"
                    />
                ) : (
                    <span className="u-display flex size-14 items-center justify-center rounded-full bg-ink text-[1.1rem] font-bold text-paper">
                        {brand.name.slice(0, 2).toUpperCase()}
                    </span>
                )}
            </div>
            <div className="flex flex-1 flex-col p-4">
                <Link
                    href={`/products?brand=${brand.id}`}
                    className="truncate text-[0.975rem] leading-tight font-semibold text-ink hover:text-brand hover:underline"
                >
                    {brand.name}
                </Link>
                <p className="u-nums mt-auto border-t border-rule pt-3 text-[0.8125rem] font-medium text-ink-2">
                    {brand.offers_count}{" "}
                    {brand.offers_count === 1 ? "offer" : "offers"}
                </p>
            </div>
        </article>
    );
}
