import { useEffect, useRef, useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Search, X } from "lucide-react";

const SUGGESTIONS = ["Galaxy", "Air Max", "Coffee", "Speaker", "Desk", "Serum"];

const CATEGORIES = [
  { slug: "electronics", name: "Electronics" },
  { slug: "fashion", name: "Fashion" },
  { slug: "home", name: "Home & Living" },
  { slug: "beauty", name: "Beauty" },
  { slug: "grocery", name: "Grocery" },
];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function goToSearch(q: string) {
    onClose();
    router.visit(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    goToSearch(value.trim());
  }

  return (
    <div className="fixed inset-0 z-80" role="dialog" aria-modal="true" aria-label="Search">
      <button
        type="button"
        className="animate-in fade-in absolute inset-0 w-full cursor-default bg-foreground/35 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="animate-in fade-in relative border-b border-border bg-background">
        <div className="mx-auto w-full max-w-335 px-5 py-5 sm:px-8 lg:px-10">
          <form onSubmit={submit} className="flex items-center gap-3">
            <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent py-2 text-[1.05rem] text-foreground outline-none sm:text-[1.25rem]"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => goToSearch(s)}
                className="rounded-full border border-border bg-secondary px-3.5 py-1.5 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Categories
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-5">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  onClick={onClose}
                  className="truncate py-1.5 text-[0.9rem] text-muted-foreground transition-colors hover:text-primary"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
