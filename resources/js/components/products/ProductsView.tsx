import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brands/BrandLogo";
import { ProductCard, type Product } from "./ProductCard";

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Cancelling Headphones",
    description: "Over-ear headphones with adaptive noise cancellation and 30-hour battery life.",
    brand: { id: "3", name: "Circuit", logo: { monogram: "C", accent: "#d97706", ink: "#ffffff" } },
    category: { id: "electronics", name: "Electronics" },
    coupon: { slug: "5-cashback-electronics", reward: "5% BACK" },
    image: { pattern: "beam", accent: "#d97706" },
  },
  {
    id: "2",
    name: "Organic Snack Variety Pack",
    description: "A mix of organic, non-GMO snacks perfect for lunchboxes and travel.",
    brand: { id: "2", name: "Fresco", logo: { monogram: "F", accent: "#059669", ink: "#ffffff" } },
    category: { id: "grocery", name: "Grocery" },
    coupon: { slug: "buy-one-get-one-free", reward: "BOGO" },
    image: { pattern: "field", accent: "#059669" },
  },
  {
    id: "3",
    name: "Everyday Backpack",
    description: "Water-resistant backpack with a padded laptop sleeve and multiple compartments.",
    brand: { id: "1", name: "Northwind", logo: { monogram: "N", accent: "#2563eb", ink: "#ffffff" } },
    category: { id: "fashion", name: "Fashion" },
    image: { pattern: "tile", accent: "#2563eb" },
  },
  {
    id: "4",
    name: "Ceramic Cookware Set",
    description: "A 10-piece non-stick ceramic cookware set, oven-safe up to 450°F.",
    brand: { id: "4", name: "Hearth", logo: { monogram: "H", accent: "#7c3aed", ink: "#ffffff" } },
    category: { id: "home", name: "Home & Living" },
    image: { pattern: "bloom", accent: "#7c3aed" },
  },
  {
    id: "5",
    name: "Bluetooth Portable Speaker",
    description: "Compact speaker with 360° sound and 12-hour playtime.",
    brand: { id: "3", name: "Circuit", logo: { monogram: "C", accent: "#d97706", ink: "#ffffff" } },
    category: { id: "electronics", name: "Electronics" },
    image: { pattern: "orbit", accent: "#d97706" },
  },
  {
    id: "6",
    name: "Cold-Pressed Juice Bundle",
    description: "A weekly bundle of six cold-pressed juices, delivered fresh.",
    brand: { id: "2", name: "Fresco", logo: { monogram: "F", accent: "#059669", ink: "#ffffff" } },
    category: { id: "grocery", name: "Grocery" },
    coupon: { slug: "free-shipping-orders", reward: "FREE SHIP" },
    image: { pattern: "wave", accent: "#059669" },
  },
  {
    id: "7",
    name: "Classic Denim Jacket",
    description: "A timeless denim jacket with a relaxed fit, available in three washes.",
    brand: { id: "1", name: "Northwind", logo: { monogram: "N", accent: "#2563eb", ink: "#ffffff" } },
    category: { id: "fashion", name: "Fashion" },
    coupon: { slug: "20-off-first-order", reward: "20% OFF" },
    image: { pattern: "stack", accent: "#2563eb" },
  },
  {
    id: "8",
    name: "Scented Soy Candle Set",
    description: "A set of three hand-poured soy candles in seasonal scents.",
    brand: { id: "4", name: "Hearth", logo: { monogram: "H", accent: "#7c3aed", ink: "#ffffff" } },
    category: { id: "home", name: "Home & Living" },
    coupon: { slug: "10-off-home-decor", reward: "10% OFF" },
    image: { pattern: "peak", accent: "#7c3aed" },
  },
];

const BRANDS = Array.from(new Map(PRODUCTS.map((p) => [p.brand.id, p.brand])).values());
const CATEGORIES = Array.from(new Map(PRODUCTS.map((p) => [p.category.id, p.category])).values());

export function ProductsView({
  initialQuery = "",
  initialCategory = "",
  initialBrand = "",
}: {
  initialQuery?: string;
  initialCategory?: string;
  /** Lets brand cards and notifications land on a pre-filtered product list. */
  initialBrand?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [brandId, setBrandId] = useState(initialBrand);
  const [categoryId, setCategoryId] = useState(initialCategory);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      return (
        (!brandId || product.brand.id === brandId) &&
        (!categoryId || product.category.id === categoryId) &&
        (!needle || `${product.name} ${product.brand.name}`.toLowerCase().includes(needle))
      );
    });
  }, [brandId, categoryId, query]);

  const clear = () => {
    setQuery("");
    setBrandId("");
    setCategoryId("");
  };

  return (
    <>
      <section className="mt-8 grid gap-5 border-y border-rule py-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-8 lg:py-8">
        <div className="min-w-0">
          <h2 className="u-display text-[1.25rem] text-ink">By name</h2>
          <p className="mt-1.5 text-[0.82rem] text-ink-3">Search for a specific product</p>
          <label className="mt-4 flex min-h-12 items-center gap-3 rounded-md border border-rule-strong bg-surface px-4 focus-within:border-brand">
            <Search className="size-4.5 text-ink-3" aria-hidden="true" />
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
          <h2 className="u-display text-[1.25rem] text-ink">By brand</h2>
          <p className="mt-1.5 text-[0.82rem] text-ink-3">Filter to a business you trust</p>
          <div className="u-rail mt-4 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
            {BRANDS.map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() => setBrandId(brandId === brand.id ? "" : brand.id)}
                aria-pressed={brandId === brand.id}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-[0.82rem] font-semibold transition-colors",
                  brandId === brand.id
                    ? "border-ink bg-ink text-paper"
                    : "border-rule bg-surface text-ink hover:border-ink-3",
                )}
              >
                <BrandLogo brand={brand} size="xs" />
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="u-display text-[1.25rem] text-ink">By category</h2>
          <p className="mt-1.5 text-[0.82rem] text-ink-3">Browse a product category</p>
          <div className="u-rail mt-4 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setCategoryId(categoryId === category.id ? "" : category.id)}
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
          <h2 className="u-display text-[1.65rem] leading-tight text-ink">Results</h2>
          <p className="u-nums mt-1 text-[0.85rem] text-ink-3">
            {results.length} matching product{results.length === 1 ? "" : "s"}
          </p>
        </div>
        {(query || brandId || categoryId) && (
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

      {results.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-rule-strong bg-surface px-6 py-14 text-center">
          <h3 className="u-display text-[1.25rem]">No products found</h3>
          <p className="mt-2 text-[0.86rem] text-ink-3">Try adjusting your search or filters.</p>
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
