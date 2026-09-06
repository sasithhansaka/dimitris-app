import { Head } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import { GiftCardCard, type GiftCard } from "@/components/gift-cards/GiftCardCard";

const GIFT_CARDS: GiftCard[] = [
  {
    id: "1",
    slug: "northwind-gift-card",
    title: "Northwind gift card",
    description: "Redeemable storewide, online and in every location.",
    valueLabels: ["$25", "$50", "$100"],
    brand: { id: "1", name: "Northwind", logo: { monogram: "N", accent: "#2563eb", ink: "#ffffff" } },
    image: { pattern: "wave", accent: "#2563eb" },
  },
  {
    id: "2",
    slug: "fresco-gift-card",
    title: "Fresco gift card",
    description: "Perfect for groceries, gifting, or weekly essentials.",
    valueLabels: ["$20", "$40", "$75"],
    brand: { id: "2", name: "Fresco", logo: { monogram: "F", accent: "#059669", ink: "#ffffff" } },
    image: { pattern: "field", accent: "#059669" },
  },
  {
    id: "3",
    slug: "circuit-gift-card",
    title: "Circuit gift card",
    description: "Put toward electronics, accessories, and more.",
    valueLabels: ["$50", "$100", "$200"],
    brand: { id: "3", name: "Circuit", logo: { monogram: "C", accent: "#d97706", ink: "#ffffff" } },
    image: { pattern: "tile", accent: "#d97706" },
  },
  {
    id: "4",
    slug: "hearth-gift-card",
    title: "Hearth gift card",
    description: "A flexible gift for home and living purchases.",
    valueLabels: ["$25", "$50", "$100"],
    brand: { id: "4", name: "Hearth", logo: { monogram: "H", accent: "#7c3aed", ink: "#ffffff" } },
    image: { pattern: "bloom", accent: "#7c3aed" },
  },
];

export default function GiftCardsPage() {
  return (
    <>
      <Head title="Gift Cards" />
      <Container className="pt-9 pb-8 lg:pt-12">
        <header className="max-w-180">
          <h1 className="u-display text-[2.35rem] leading-[1.03] text-ink sm:text-[3.1rem]">Gift Cards</h1>
          <p className="mt-4 max-w-[58ch] text-[1rem] leading-relaxed text-ink-2">
            Gift cards from brands and businesses you like. Browse what is available and save an
            idea to your Wallet for later.
          </p>
        </header>
        <div className="mt-8 flex items-end justify-between gap-4 border-t border-rule pt-5">
          <div>
            <h2 className="u-display text-[1.65rem] leading-tight">Available gift cards</h2>
            <p className="mt-1 text-[0.85rem] text-ink-3">Discovery and saving only</p>
          </div>
          <p className="u-nums hidden text-[0.82rem] text-ink-3 sm:block">{GIFT_CARDS.length} cards</p>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {GIFT_CARDS.map((giftCard) => (
            <GiftCardCard key={giftCard.id} giftCard={giftCard} />
          ))}
        </div>
      </Container>
    </>
  );
}
