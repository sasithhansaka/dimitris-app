import { Head } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Article } from "@/types/article";

export default function ArticlesPage({
  featuredArticles,
  recentArticles,
}: {
  featuredArticles: Article[];
  recentArticles: Article[];
}) {
  return (
    <>
      <Head title="Articles" />
      <Container className="pt-9 pb-8 lg:pt-12">
        <header>
          <h1 className="text-[2.35rem] leading-[1.03] font-extrabold tracking-[-0.03em] text-foreground sm:text-[3.1rem]">
            Articles
          </h1>
          <p className="mt-4 max-w-[58ch] text-[1rem] leading-relaxed text-muted-foreground">
            Guides and ideas for coupons, receipts and competitions.
          </p>
        </header>

        <section className="mt-8">
          <SectionHeading title="Featured" />
          {featuredArticles.length > 0 ? (
            <div className="mt-6 flex flex-col gap-5">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} featured />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-[0.9rem] text-muted-foreground">No featured articles.</p>
          )}
        </section>

        <section className="mt-14 lg:mt-20">
          <SectionHeading title="Recent" />
          {recentArticles.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-[0.9rem] text-muted-foreground">No recent articles.</p>
          )}
        </section>
      </Container>
    </>
  );
}
