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
          ? "grid overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-[1.15fr_1fr]"
          : "overflow-hidden rounded-md border border-border bg-card transition-shadow hover:shadow-md"
      }
    >
      <div className={featured ? "min-h-65 overflow-hidden" : "aspect-video overflow-hidden"}>
        {article.banner ? (
          <img src={`/storage/${article.banner}`} alt={article.title} className="w-full h-[320px] md:h-[330px] lg:h-[500px] object-cover" />
        ) : (
          <PromoPlate {...plate} className="size-full" />
        )}
      </div>
      <div className={featured ? "flex flex-col justify-center p-6 sm:p-8" : "p-4"}>
        <div className="flex flex-wrap items-center gap-2 text-[0.75rem] font-medium text-muted-foreground">
          <span className="font-semibold text-primary">{article.category?.name ?? "Articles"}</span>
          <span aria-hidden="true">·</span>
          <span>{article.read_time} min read</span>
        </div>
        <h3
          className={
            featured
              ? "mt-4 text-[1.75rem] leading-[1.08] font-extrabold tracking-[-0.03em] text-foreground line-clamp-2"
              : "mt-3 text-[1rem] leading-snug font-semibold text-foreground line-clamp-1"
          }
        >
          {article.title}
        </h3>
        <p className="mt-3 text-[0.86rem] leading-relaxed text-muted-foreground line-clamp-1">{article.introduction}</p>
        <Link
          href={`/articles/${article.slug}`}
          className="mt-5 inline-flex min-h-11 items-center self-start text-[0.84rem] font-semibold text-primary hover:underline"
        >
          Read article
        </Link>
      </div>
    </article>
  );
}
