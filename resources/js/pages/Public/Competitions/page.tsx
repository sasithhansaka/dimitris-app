import { Head } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import { CompetitionCard, type Competition } from "@/components/competitions/CompetitionCard";

const COMPETITIONS: Competition[] = [
  {
    id: "1",
    slug: "win-a-year-of-coffee",
    title: "Win a year's supply of coffee",
    prize: "12x monthly coffee subscription boxes",
    validUntil: "2026-12-15",
    entryMethod: "receipt",
    brand: { id: "2", name: "Fresco", logo: { monogram: "F", accent: "#059669", ink: "#ffffff" } },
    image: { pattern: "peak", accent: "#059669" },
  },
  {
    id: "2",
    slug: "headphones-giveaway",
    title: "Premium headphones giveaway",
    prize: "1x Wireless Noise-Cancelling Headphones",
    validUntil: "2026-11-20",
    entryMethod: "code",
    brand: { id: "3", name: "Circuit", logo: { monogram: "C", accent: "#d97706", ink: "#ffffff" } },
    image: { pattern: "beam", accent: "#d97706" },
  },
  {
    id: "3",
    slug: "home-makeover-prize",
    title: "Home makeover prize draw",
    prize: "$1,000 home decor voucher",
    validUntil: "2026-10-05",
    entryMethod: "qr",
    brand: { id: "4", name: "Hearth", logo: { monogram: "H", accent: "#7c3aed", ink: "#ffffff" } },
    image: { pattern: "bloom", accent: "#7c3aed" },
  },
  {
    id: "4",
    slug: "storewide-shopping-spree",
    title: "$500 storewide shopping spree",
    prize: "1x $500 Northwind gift card",
    validUntil: "2026-12-01",
    entryMethod: "barcode",
    brand: { id: "1", name: "Northwind", logo: { monogram: "N", accent: "#2563eb", ink: "#ffffff" } },
    image: { pattern: "arcs", accent: "#2563eb" },
  },
];

export default function CompetitionsPage() {
  return (
    <>
      <Head title="Competitions" />
      <Container className="pt-9 pb-8 lg:pt-12">
        <header className="grid gap-5 border-b border-rule pb-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <h1 className="u-display text-[2.35rem] leading-[1.03] text-ink sm:text-[3.1rem]">
              Competitions
            </h1>
            <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-ink-2">
              Enter for a chance to win great prizes from brands you know.
            </p>
          </div>
          <p className="text-[0.84rem] leading-relaxed text-ink-3 lg:border-l lg:border-rule lg:pl-6">
            Demo data shown below — entries are for preview purposes only.
          </p>
        </header>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COMPETITIONS.map((competition) => (
            <CompetitionCard key={competition.id} competition={competition} />
          ))}
        </div>
      </Container>
    </>
  );
}
