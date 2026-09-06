import { Link } from "@inertiajs/react";
import { ArrowRight, CalendarClock, ScanLine } from "lucide-react";
import { BrandLogo, type Brand } from "@/components/brands/BrandLogo";
import { PromoPlate, type PlatePattern } from "@/components/ui/PromoPlate";

export type Competition = {
  id: string;
  slug: string;
  title: string;
  prize: string;
  validUntil: string;
  entryMethod: "receipt" | "code" | "qr" | "barcode";
  brand: Brand;
  image: {
    pattern: PlatePattern;
    accent: string;
    tone?: "light" | "dark";
  };
};

const LABELS: Record<Competition["entryMethod"], string> = {
  receipt: "Receipt upload",
  code: "Entry code",
  qr: "QR scan",
  barcode: "Barcode scan",
};
const DATE_FORMAT = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" });

export function CompetitionCard({ competition, featured = false }: { competition: Competition; featured?: boolean }) {
  return (
    <article className="u-lift group relative flex h-full flex-col overflow-hidden rounded-lg border border-rule bg-surface">
      <div className={featured ? "relative aspect-16/8 overflow-hidden" : "relative aspect-16/10 overflow-hidden"}>
        <PromoPlate {...competition.image} className="size-full" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-sm bg-white px-2.5 py-1.5 text-[0.72rem] font-semibold text-ink shadow-[0_1px_3px_rgba(20,21,28,0.12)]">
          <ScanLine className="size-3.5 text-brand" aria-hidden="true" />
          {LABELS[competition.entryMethod]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <BrandLogo brand={competition.brand} size="xs" />
          <span className="u-label truncate text-ink-2">{competition.brand.name}</span>
          <span className="u-label ml-auto text-brand-ink">Competition</span>
        </div>
        <h3 className="u-display mt-4 text-[1.45rem] leading-[1.08] text-ink">{competition.title}</h3>
        <p className="mt-3 text-[0.82rem] leading-relaxed text-ink-3">Prize</p>
        <p className="mt-0.5 text-[0.95rem] leading-snug font-semibold text-ink">{competition.prize}</p>
        <div className="mt-4 flex items-center gap-2 border-t border-rule pt-3 text-[0.8rem] font-medium text-ink-2">
          <CalendarClock className="size-4 text-ink-3" aria-hidden="true" />
          Closes {DATE_FORMAT.format(new Date(`${competition.validUntil}T12:00:00`))}
        </div>
        <div className="mt-auto pt-4">
          <Link
            href={`/competitions/${competition.slug}`}
            className="inline-flex min-h-11 w-full items-center justify-between rounded-md bg-ink px-4 py-2.5 text-[0.85rem] font-semibold text-paper transition-colors hover:bg-brand"
          >
            View competition
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
