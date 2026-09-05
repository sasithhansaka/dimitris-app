import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { CouponCard, type Coupon } from "./CouponCard";
import { SelectionBar } from "./SelectionBar";
import { CouponsSelectionProvider } from "./CouponsSelectionContext";

const COUPONS: Coupon[] = [
  {
    id: "1",
    slug: "20-off-first-order",
    title: "20% off your first order storewide",
    reward: "20% OFF",
    rewardKind: "Discount",
    validUntil: "2026-12-31",
    brand: { id: "1", name: "Northwind", logo: { monogram: "N", accent: "#2563eb", ink: "#ffffff" } },
    productName: "Storewide",
    category: { id: "fashion", name: "Fashion" },
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
    category: { id: "grocery", name: "Grocery" },
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
    category: { id: "electronics", name: "Electronics" },
    image: { pattern: "stack", accent: "#d97706" },
  },
  {
    id: "4",
    slug: "10-off-home-decor",
    title: "10% off home decor collections",
    reward: "10% OFF",
    rewardKind: "Discount",
    validUntil: "2026-12-10",
    brand: { id: "4", name: "Hearth", logo: { monogram: "H", accent: "#7c3aed", ink: "#ffffff" } },
    productName: "Home & living",
    category: { id: "home", name: "Home & Living" },
    image: { pattern: "bloom", accent: "#7c3aed" },
  },
  {
    id: "5",
    slug: "free-shipping-orders",
    title: "Free shipping on all orders over $30",
    reward: "FREE SHIP",
    rewardKind: "Shipping",
    validUntil: "2026-11-15",
    brand: { id: "2", name: "Fresco", logo: { monogram: "F", accent: "#059669", ink: "#ffffff" } },
    productName: "Storewide",
    category: { id: "grocery", name: "Grocery" },
    image: { pattern: "wave", accent: "#059669" },
  },
  {
    id: "6",
    slug: "15-off-tech-accessories",
    title: "15% off tech accessories bundle",
    reward: "15% OFF",
    rewardKind: "Discount",
    validUntil: "2026-10-25",
    brand: { id: "3", name: "Circuit", logo: { monogram: "C", accent: "#d97706", ink: "#ffffff" } },
    productName: "Accessories",
    category: { id: "electronics", name: "Electronics" },
    image: { pattern: "tile", accent: "#d97706" },
  },
];

const BRANDS = Array.from(new Map(COUPONS.map((c) => [c.brand.id, c.brand])).values());
const CATEGORIES = Array.from(
  new Map(COUPONS.filter((c) => c.category).map((c) => [c.category!.id, c.category!])).values(),
);

export function CouponsView() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return COUPONS.filter((coupon) => {
      const haystack = `${coupon.title} ${coupon.reward} ${coupon.brand.name} ${coupon.productName ?? ""}`.toLowerCase();
      return (
        (!needle || haystack.includes(needle)) &&
        (!brand || coupon.brand.id === brand) &&
        (!category || coupon.category?.id === category)
      );
    });
  }, [brand, category, query]);

  return (
    <CouponsSelectionProvider>
      <section className="mt-8 grid gap-4 rounded-lg border border-rule bg-surface p-4 sm:p-5 lg:grid-cols-[1fr_230px_230px] lg:items-end">
        <label>
          <span className="u-label text-ink-2">Search coupons</span>
          <span className="mt-2 flex min-h-12 items-center gap-3 rounded-md border border-rule-strong bg-paper px-4 focus-within:border-brand">
            <Search className="size-4.5 text-ink-3" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, brand or product"
              className="min-w-0 flex-1 bg-transparent text-[0.9rem] outline-none"
            />
          </span>
        </label>
        <label>
          <span className="u-label text-ink-2">Brand</span>
          <select
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-md border border-rule-strong bg-paper px-3 text-[0.9rem] outline-none focus:border-brand"
          >
            <option value="">All brands</option>
            {BRANDS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="u-label text-ink-2">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-md border border-rule-strong bg-paper px-3 text-[0.9rem] outline-none focus:border-brand"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="u-display text-[1.65rem] leading-tight">Available coupons</h2>
          <p className="u-nums mt-1 text-[0.85rem] text-ink-3">
            {filtered.length} campaign{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <span className={cn("u-label hidden text-ink-3 sm:block", filtered.length === 0 && "opacity-0")}>
          Select up to 3 per receipt
        </span>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 min-[1400px]:grid-cols-4">
        {filtered.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
      <SelectionBar />
    </CouponsSelectionProvider>
  );
}
