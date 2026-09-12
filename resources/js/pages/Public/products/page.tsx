import { Head } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import { ProductsView } from "@/components/products/ProductsView";
import type { Product } from "@/components/products/ProductCard";

export type ProductBrandOption = {
    id: number;
    name: string;
    logo: string | null;
};

export type ProductCategoryOption = {
    id: number;
    name: string;
};

type Props = {
    products: Product[];
    brands: ProductBrandOption[];
    categories: ProductCategoryOption[];
    filters: {
        q?: string;
        brand?: string;
        category?: string;
    };
};

export default function ProductsPage({
    products,
    brands,
    categories,
    filters,
}: Props) {
    return (
        <>
            <Head title="Products" />
            <Container className="pt-9 pb-8 lg:pt-12">
                <header className="max-w-190">
                    <h1 className="u-display text-[2.35rem] leading-[1.03] text-ink sm:text-[3.1rem]">
                        Products
                    </h1>
                    <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-ink-2">
                        Search by product name, choose a brand, or start with a category. Eligible products connect directly to their coupon campaigns.
                    </p>
                </header>
                <ProductsView
                    products={products}
                    brands={brands}
                    categories={categories}
                    initialQuery={filters.q ?? ""}
                    initialCategory={filters.category ?? ""}
                    initialBrand={filters.brand ?? ""}
                />
            </Container>
        </>
    );
}
