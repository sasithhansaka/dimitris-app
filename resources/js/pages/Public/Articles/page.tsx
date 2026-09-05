import { Head } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import { ArticleCard, type ArticlePreview } from "@/components/articles/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ARTICLES: ArticlePreview[] = [
  {
    id: "1",
    slug: "how-to-stack-coupons",
    title: "How to stack coupons for maximum savings",
    excerpt: "A quick guide to combining store offers, manufacturer coupons, and cashback for the biggest discount.",
    category: "Guides",
    readTime: "5 min read",
    featured: true,
    image: { pattern: "arcs", accent: "#2563eb" },
  },
  {
    id: "2",
    slug: "gift-card-tricks",
    title: "5 gift card tricks most shoppers miss",
    excerpt: "Simple ways to get more value out of gift cards before they expire.",
    category: "Tips",
    readTime: "4 min read",
    image: { pattern: "orbit", accent: "#059669" },
  },
  {
    id: "3",
    slug: "competition-entry-checklist",
    title: "The competition entry checklist",
    excerpt: "What to check before you submit an entry so you don't get disqualified.",
    category: "Competitions",
    readTime: "3 min read",
    image: { pattern: "stack", accent: "#d97706" },
  },
  {
    id: "4",
    slug: "seasonal-sale-calendar",
    title: "The seasonal sale calendar every shopper should know",
    excerpt: "Mark these dates — the biggest sale events throughout the year.",
    category: "Guides",
    readTime: "6 min read",
    image: { pattern: "wave", accent: "#7c3aed" },
  },
  {
    id: "5",
    slug: "reading-the-fine-print",
    title: "Reading the fine print on offers",
    excerpt: "The terms and conditions details that actually matter before you buy.",
    category: "Tips",
    readTime: "4 min read",
    image: { pattern: "peak", accent: "#dc2626" },
  },
];

export default function ArticlesPage() {
  const featured = ARTICLES.find((article) => article.featured) ?? ARTICLES[0];
  const recent = ARTICLES.filter((article) => article.id !== featured.id);

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
          <div className="mt-6">
            <ArticleCard article={featured} featured />
          </div>
        </section>

        <section className="mt-14 lg:mt-20">
          <SectionHeading title="Recent" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {recent.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
