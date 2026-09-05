import { Link } from "@inertiajs/react";
import { PromoPlate, type PlatePattern } from "@/components/ui/PromoPlate";
import type { Article } from "@/types/article";

const PLATE_PATTERNS: PlatePattern[] = ["arcs", "orbit", "stack", "wave", "field", "bloom", "peak", "beam", "tile", "loop"];
const PLATE_ACCENTS = ["#2563eb", "#059669", "#d97706", "#7c3aed", "#dc2626"];

function plateFor(id: number) {
  return {
    pattern: PLATE_PATTERNS[id % PLATE_PATTERNS.length],
    accent: PLATE_ACCENTS[id % PLATE_ACCENTS.length],
  };
}

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const plate = plateFor(article.id);

  return (
    <article
      className={
        featured
          ? "grid overflow-hidden rounded-lg border border-rule bg-surface sm:grid-cols-[1.15fr_1fr]"
          : "u-lift overflow-hidden rounded-md border border-rule bg-surface"
      }
    >
      <div className={featured ? "min-h-65 overflow-hidden" : "aspect-video overflow-hidden"}>
        {article.banner ? (
          <img src={`/storage/${article.banner}`} alt={article.title} className="h-80 w-full object-cover md:h-82.5 lg:h-125" />
        ) : (
          <PromoPlate {...plate} className="size-full" />
        )}
      </div>
      <div className={featured ? "flex flex-col justify-center p-6 sm:p-8" : "p-4"}>
        <div className="flex flex-wrap items-center gap-2 text-[0.75rem] font-medium text-ink-3">
          <span className="u-label text-brand-ink">{article.category?.name ?? "Articles"}</span>
          <span aria-hidden="true">·</span>
          <span>{article.read_time} min read</span>
        </div>
        <h3
          className={
            featured
              ? "u-display mt-4 line-clamp-2 text-[1.75rem] leading-[1.08] text-ink"
              : "mt-3 line-clamp-1 text-[1rem] leading-snug font-semibold text-ink"
          }
        >
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-1 text-[0.86rem] leading-relaxed text-ink-3">{article.introduction}</p>
        <Link
          href={`/articles/${article.slug}`}
          className="mt-5 inline-flex min-h-11 items-center self-start text-[0.84rem] font-semibold text-brand hover:underline"
        >
          Read article
        </Link>
      </div>
    </article>
  );
}
