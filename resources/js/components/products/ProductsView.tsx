import { router } from "@inertiajs/react";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import PublicProductController from "@/actions/App/Http/Controllers/Public/ProductController";
import { ProductCard, type Product } from "./ProductCard";
import type {
    ProductBrandOption,
    ProductCategoryOption,
} from "@/pages/Public/products/page";

export function ProductsView({
    products,
    brands,
    categories,
    initialQuery = "",
    initialCategory = "",
    initialBrand = "",
}: {
    products: Product[];
    brands: ProductBrandOption[];
    categories: ProductCategoryOption[];
    initialQuery?: string;
    initialCategory?: string;
    /** Lets brand cards and notifications land on a pre-filtered product list. */
    initialBrand?: string;
}) {
    const [query, setQuery] = useState(initialQuery);
    const [brandId, setBrandId] = useState<number | "">(
        initialBrand ? Number(initialBrand) : "",
    );
    const [categoryId, setCategoryId] = useState<number | "">(
        initialCategory ? Number(initialCategory) : "",
    );
    const isFirstRender = useRef(true);

    const applyFilters = (next: {
        query: string;
        brandId: number | "";
        categoryId: number | "";
    }) => {
        router.get(
            PublicProductController.index.url(),
            {
                q: next.query || undefined,
                brand: next.brandId || undefined,
                category: next.categoryId || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            applyFilters({ query, brandId, categoryId });
        }, 350);

        return () => clearTimeout(timeout);
    }, [query]);

    const toggleBrand = (id: number) => {
        const next = brandId === id ? "" : id;
        setBrandId(next);
        applyFilters({ query, brandId: next, categoryId });
    };

    const toggleCategory = (id: number) => {
        const next = categoryId === id ? "" : id;
        setCategoryId(next);
        applyFilters({ query, brandId, categoryId: next });
    };

    const clear = () => {
        setQuery("");
        setBrandId("");
        setCategoryId("");
        applyFilters({ query: "", brandId: "", categoryId: "" });
    };

    const hasActiveFilters = Boolean(query || brandId || categoryId);

    return (
        <>
            <section className="mt-8 grid gap-5 border-y border-rule py-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-8 lg:py-8">
                <div className="min-w-0">
                    <h2 className="u-display text-[1.25rem] text-ink">
                        Find by name
                    </h2>
                    <p className="mt-1.5 text-[0.82rem] text-ink-3">
                        Search the product you already have in mind.
                    </p>
                    <label className="mt-4 flex min-h-12 items-center gap-3 rounded-md border border-rule-strong bg-surface px-4 focus-within:border-brand">
                        <Search
                            className="size-4.5 text-ink-3"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search products"
                            className="min-w-0 flex-1 bg-transparent text-[0.9rem] outline-none"
                        />
                    </label>
                </div>

                <div className="min-w-0">
                    <h2 className="u-display text-[1.25rem] text-ink">
                        Browse by brand
                    </h2>
                    <p className="mt-1.5 text-[0.82rem] text-ink-3">
                        See products from a brand you recognise.
                    </p>
                    <div className="u-rail mt-4 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
                        {brands.map((brand) => (
                            <button
                                key={brand.id}
                                type="button"
                                onClick={() => toggleBrand(brand.id)}
                                aria-pressed={brandId === brand.id}
                                className={cn(
                                    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-[0.82rem] font-semibold transition-colors",
                                    brandId === brand.id
                                        ? "border-ink bg-ink text-paper"
                                        : "border-rule bg-surface text-ink hover:border-ink-3",
                                )}
                            >
                                {brand.logo ? (
                                    <img
                                        src={`/storage/${brand.logo}`}
                                        alt=""
                                        className="size-5 shrink-0 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="u-display flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-[0.55rem] font-bold text-paper">
                                        {brand.name.slice(0, 2).toUpperCase()}
                                    </span>
                                )}
                                {brand.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="min-w-0">
                    <h2 className="u-display text-[1.25rem] text-ink">
                        Browse by category
                    </h2>
                    <p className="mt-1.5 text-[0.82rem] text-ink-3">
                        Start with the type of product you need.
                    </p>
                    <div className="u-rail mt-4 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => toggleCategory(category.id)}
                                aria-pressed={categoryId === category.id}
                                className={cn(
                                    "min-h-11 shrink-0 rounded-md border px-3 py-2 text-[0.82rem] font-semibold transition-colors",
                                    categoryId === category.id
                                        ? "border-ink bg-ink text-paper"
                                        : "border-rule bg-surface text-ink hover:border-ink-3",
                                )}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 className="u-display text-[1.65rem] leading-tight text-ink">
                        Product results
                    </h2>
                    <p className="u-nums mt-1 text-[0.85rem] text-ink-3">
                        {products.length} matching product
                        {products.length === 1 ? "" : "s"}
                    </p>
                </div>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clear}
                        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-rule px-3 text-[0.82rem] font-semibold text-ink-2 hover:border-ink-3 hover:text-ink"
                    >
                        <X className="size-4" aria-hidden="true" />
                        Clear
                    </button>
                )}
            </div>

            {products.length > 0 ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="mt-6 rounded-lg border border-dashed border-rule-strong bg-surface px-6 py-14 text-center">
                    <h3 className="u-display text-[1.25rem]">
                        No products found
                    </h3>
                    <p className="mt-2 text-[0.86rem] text-ink-3">
                        Try adjusting your search or filters.
                    </p>
                    <button
                        type="button"
                        onClick={clear}
                        className="mt-5 min-h-11 rounded-md bg-brand px-5 text-[0.85rem] font-semibold text-paper"
                    >
                        Show all products
                    </button>
                </div>
            )}
        </>
    );
}
