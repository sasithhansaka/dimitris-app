import { Head, usePage } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import { ProductsView } from "@/components/products/ProductsView";

export default function ProductsPage() {
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1] ?? "");

  return (
    <>
      <Head title="Products" />
      <Container className="pt-9 pb-8 lg:pt-12">
        <header className="max-w-190">
          <h1 className="u-display text-[2.35rem] leading-[1.03] text-ink sm:text-[3.1rem]">
            Products
          </h1>
          <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-ink-2">
            Find eligible products by brand, category or product name.
          </p>
        </header>
        <ProductsView
          initialQuery={params.get("q") ?? ""}
          initialCategory={params.get("category") ?? ""}
          initialBrand={params.get("brand") ?? ""}
        />
      </Container>
    </>
  );
}
