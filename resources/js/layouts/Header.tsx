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
            <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur-md supports-backdrop-filter:bg-paper/88">
                <div className="mx-auto flex h-14 w-full max-w-shell items-center gap-3 px-5 sm:px-8 lg:h-header lg:px-6 xl:gap-5 xl:px-8 2xl:gap-6 2xl:px-10">
                    <Link
                        href="/"
                        className="shrink-0 rounded-sm py-1"
                        aria-label="Kuponi.al — Home"
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
                                            ? "text-ink"
                                            : "text-ink-2 hover:text-ink",
                                    )}
                                >
                                    {item.label}
                                    <span
                                        className={cn(
                                            "absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-brand transition-opacity duration-200 xl:inset-x-3",
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
                        className="ml-auto hidden min-w-0 max-w-[210px] flex-1 items-center gap-2 rounded-md border border-rule bg-surface px-3 py-2 transition-colors focus-within:border-brand lg:flex xl:max-w-70"
                    >
                        <Search
                            className="size-4 shrink-0 text-ink-3"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search products"
                            aria-label="Search products by name"
                            className="min-w-0 flex-1 bg-transparent text-[0.875rem] text-ink outline-none"
                        />
                    </form>

                    <div className="ml-auto flex items-center gap-0.5 lg:ml-0 lg:gap-1">
                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            aria-label="Search"
                            className="flex size-10 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-paper-deep hover:text-ink lg:hidden"
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
                                "flex size-10 items-center justify-center rounded-md transition-colors hover:bg-paper-deep",
                                isActive("/wallet")
                                    ? "text-brand"
                                    : "text-ink-2 hover:text-ink",
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
                                "flex size-10 items-center justify-center rounded-md transition-colors hover:bg-paper-deep",
                                isActive("/notifications")
                                    ? "text-brand"
                                    : "text-ink-2 hover:text-ink",
                            )}
                        >
                            <Bell className="size-[21px]" aria-hidden="true" />
                        </Link>

                        <Link
                            href="/account"
                            aria-label="Account"
                            className="ml-1 flex items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                        >
                            <span
                                className={cn(
                                    "flex size-9 items-center justify-center rounded-full text-[0.75rem] font-bold tracking-[0.02em] transition-colors",
                                    isActive("/account")
                                        ? "bg-brand text-paper"
                                        : "bg-ink text-paper hover:bg-brand",
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
