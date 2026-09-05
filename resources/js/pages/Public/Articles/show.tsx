import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
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

export default function ArticleShowPage({ article }: { article: Article }) {
  const plate = plateFor(article.id);
  const keywords = (article.keywords ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return (
    <>
      <Head title={article.title} />
      <Container className="pt-8 pb-8 lg:pt-12">
        <article className="mx-auto max-w-225">
          <Link
            href="/articles"
            className="inline-flex min-h-11 items-center gap-2 text-[0.84rem] font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            All articles
          </Link>
          <header className="mt-5">
            <div className="flex flex-wrap items-center gap-2 text-[0.8rem] text-muted-foreground">
              <span className="font-semibold text-primary">{article.category?.name ?? "Articles"}</span>
              <span aria-hidden="true">·</span>
              <span>{article.read_time} min read</span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.created_at}>
                {new Date(article.created_at).toLocaleDateString("en", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </div>
            <h1 className="mt-5 max-w-[18ch] text-[2.35rem] leading-[1.03] font-extrabold tracking-[-0.03em] text-foreground sm:text-[3.2rem]">
              {article.title}
            </h1>
            {article.introduction && (
              <p className="mt-5 max-w-[62ch] text-[1.05rem] leading-relaxed text-muted-foreground">
                {article.introduction}
              </p>
            )}
          </header>

          <div className="mt-8 aspect-16/8 overflow-hidden rounded-lg border border-border">
            {article.banner ? (
              <img src={`/storage/${article.banner}`} alt={article.title} className="size-full object-cover" />
            ) : (
              <PromoPlate {...plate} className="size-full" />
            )}
          </div>

          {keywords.length > 0 && (
            <div className="mt-6 flex max-w-full gap-2 overflow-x-auto">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="shrink-0 rounded-full border border-border bg-muted px-3 py-1 text-[0.75rem] font-medium whitespace-nowrap text-muted-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}

          <div
            className="mx-auto mt-10 max-w-[70ch] space-y-6 text-[1rem] leading-[1.75] text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mt-8 [&_h2]:text-[1.4rem] [&_h2]:font-bold [&_h2]:text-foreground [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </Container>
    </>
  );
}
