import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Bell, Search, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/ui/Wordmark";
import { SearchOverlay } from "./SearchOverlay";

const NAV = [
    { href: "/products", label: "Products" },
    { href: "/coupons", label: "Coupons" },
    { href: "/competitions", label: "Competitions" },
    { href: "/offers", label: "Offers" },
    { href: "/gift-cards", label: "Gift Cards" },
    { href: "/articles", label: "Articles" },
];

export function Header() {
    const { url } = usePage();
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");

    const isActive = (href: string) =>
        url === href || url.startsWith(`${href}/`);

    function submitSearch(e: React.FormEvent) {
        e.preventDefault();
        const q = query.trim();
        window.location.href = q
            ? `/products?q=${encodeURIComponent(q)}`
            : "/products";
    }

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/88">
                <div className="mx-auto flex h-14 w-full max-w-335 items-center gap-3 px-5 sm:px-8 lg:h-17 lg:px-6 xl:gap-5 xl:px-8 2xl:gap-6 2xl:px-10">
                    <Link
                        href="/"
                        className="shrink-0 rounded-sm py-1"
                        aria-label="Dimitris — Home"
                    >
                        <Wordmark size="responsive" />
                    </Link>

                    <nav
                        aria-label="Main"
                        className="hidden lg:flex lg:items-center lg:gap-1"
                    >
                        {NAV.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        "relative rounded-sm px-2.5 py-2 text-[0.9rem] font-medium transition-colors xl:px-3 xl:text-[0.9375rem]",
                                        active
                                            ? "text-foreground"
                                            : "text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    {item.label}
                                    <span
                                        className={cn(
                                            "absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-primary transition-opacity duration-200 xl:inset-x-3",
                                            active
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                        aria-hidden="true"
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    <form
                        onSubmit={submitSearch}
                        role="search"
                        className="ml-auto hidden min-w-0 max-w-[210px] flex-1 items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 transition-colors focus-within:border-primary lg:flex xl:max-w-70"
                    >
                        <Search
                            className="size-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search products"
                            aria-label="Search products by name"
                            className="min-w-0 flex-1 bg-transparent text-[0.875rem] text-foreground outline-none"
                        />
                    </form>

                    <div className="ml-auto flex items-center gap-0.5 lg:ml-0 lg:gap-1">
                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            aria-label="Search"
                            className="flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
                        >
                            <Search
                                className="size-[21px]"
                                aria-hidden="true"
                            />
                        </button>

                        <Link
                            href="/wallet"
                            aria-label="Wallet"
                            className={cn(
                                "flex size-10 items-center justify-center rounded-md transition-colors hover:bg-muted",
                                isActive("/wallet")
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <Wallet
                                className="size-[21px]"
                                aria-hidden="true"
                            />
                        </Link>

                        <Link
                            href="/notifications"
                            aria-label="Notifications"
                            className={cn(
                                "flex size-10 items-center justify-center rounded-md transition-colors hover:bg-muted",
                                isActive("/notifications")
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            <Bell className="size-[21px]" aria-hidden="true" />
                        </Link>

                        <Link
                            href="/account"
                            aria-label="Account"
                            className="ml-1 flex items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            <span
                                className={cn(
                                    "flex size-9 items-center justify-center rounded-full text-[0.75rem] font-bold tracking-[0.02em] transition-colors",
                                    isActive("/account")
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
                                )}
                                aria-hidden="true"
                            >
                                AM
                            </span>
                        </Link>
                    </div>
                </div>
            </header>

            <SearchOverlay
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
            />
        </>
    );
}
