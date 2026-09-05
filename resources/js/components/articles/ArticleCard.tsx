import { Link } from "@inertiajs/react";
import { PromoPlate, type PlatePattern } from "@/components/ui/PromoPlate";

export type ArticlePreview = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  featured?: boolean;
  image: {
    pattern: PlatePattern;
    accent: string;
    tone?: "light" | "dark";
  };
};

export function ArticleCard({ article, featured = false }: { article: ArticlePreview; featured?: boolean }) {
  return (
    <article
      className={
        featured
          ? "grid overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-[1.15fr_1fr]"
          : "overflow-hidden rounded-md border border-border bg-card transition-shadow hover:shadow-md"
      }
    >
      <div className={featured ? "min-h-65 overflow-hidden" : "aspect-video overflow-hidden"}>
        <PromoPlate {...article.image} className="size-full" />
      </div>
      <div className={featured ? "flex flex-col justify-center p-6 sm:p-8" : "p-4"}>
        <div className="flex flex-wrap items-center gap-2 text-[0.75rem] font-medium text-muted-foreground">
          <span className="font-semibold text-primary">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
        </div>
        <h3
          className={
            featured
              ? "mt-4 text-[1.75rem] leading-[1.08] font-extrabold tracking-[-0.03em] text-foreground"
              : "mt-3 text-[1rem] leading-snug font-semibold text-foreground"
          }
        >
          {article.title}
        </h3>
        <p className="mt-3 text-[0.86rem] leading-relaxed text-muted-foreground">{article.excerpt}</p>
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
