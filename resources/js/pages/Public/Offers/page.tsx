import { Head } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import { CatalogOfferCard, type Offer } from "@/components/offers/CatalogOfferCard";

const OFFERS: Offer[] = [
  {
    id: "1",
    slug: "northwind-storewide-sale",
    title: "Northwind storewide seasonal sale",
    description: "Save across the full catalog, no minimum spend required.",
    validUntil: "2026-11-15",
    brand: { id: "1", name: "Northwind", logo: { monogram: "N", accent: "#2563eb", ink: "#ffffff" } },
    relatedCouponSlug: "20-off-first-order",
    image: { pattern: "wave", accent: "#2563eb" },
  },
  {
    id: "2",
    slug: "fresco-weekly-groceries",
    title: "Fresco weekly grocery picks",
    description: "Fresh deals on pantry staples, updated every Monday.",
    validUntil: "2026-10-20",
    brand: { id: "2", name: "Fresco", logo: { monogram: "F", accent: "#059669", ink: "#ffffff" } },
    relatedCouponSlug: "buy-one-get-one-free",
    image: { pattern: "field", accent: "#059669" },
  },
  {
    id: "3",
    slug: "circuit-tech-clearance",
    title: "Circuit tech clearance event",
    description: "Last season's electronics at clearance prices, while supplies last.",
    validUntil: "2026-10-05",
    brand: { id: "3", name: "Circuit", logo: { monogram: "C", accent: "#d97706", ink: "#ffffff" } },
    image: { pattern: "tile", accent: "#d97706" },
  },
  {
    id: "4",
    slug: "hearth-home-refresh",
    title: "Hearth home refresh collection",
    description: "A curated set of home and living picks for the new season.",
    validUntil: "2026-11-30",
    brand: { id: "4", name: "Hearth", logo: { monogram: "H", accent: "#7c3aed", ink: "#ffffff" } },
    image: { pattern: "bloom", accent: "#7c3aed" },
  },
];

export default function OffersPage() {
  return (
    <>
      <Head title="Offers" />
      <Container className="pt-9 pb-8 lg:pt-12">
        <header className="max-w-190">
          <h1 className="u-display text-[2.35rem] leading-[1.03] text-ink sm:text-[3.1rem]">
            Offers and catalogs
          </h1>
          <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-ink-2">
            Explore seasonal promotions, product collections and business campaigns. Some offers
            include a separate coupon you can choose to claim.
          </p>
        </header>
        <div className="mt-8 flex items-end justify-between gap-4 border-t border-rule pt-5">
          <div>
            <h2 className="u-display text-[1.65rem] leading-tight">Latest offers</h2>
            <p className="mt-1 text-[0.85rem] text-ink-3">Promotions and product discovery</p>
          </div>
          <p className="u-nums hidden text-[0.82rem] text-ink-3 sm:block">{OFFERS.length} offers</p>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {OFFERS.map((offer) => (
            <CatalogOfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </Container>
    </>
  );
}
