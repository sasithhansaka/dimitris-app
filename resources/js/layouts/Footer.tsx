import { Link } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Wordmark";

type FooterItem = {
    label: string;
    href?: string;
};

const COLUMNS: { title: string; links: FooterItem[] }[] = [
    {
        title: "Explore",
        links: [
            { label: "Products", href: "/products" },
            { label: "Coupons", href: "/coupons" },
            { label: "Competitions", href: "/competitions" },
            { label: "Offers", href: "/offers" },
            { label: "Gift Cards", href: "/gift-cards" },
            { label: "Articles", href: "/articles" },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "Wallet", href: "/wallet" },
            { label: "Notifications", href: "/notifications" },
            { label: "Preferences", href: "/account#preferences" },
        ],
    },
    {
        title: "Company",
        links: [{ label: "About" }, { label: "Help" }, { label: "Contact" }],
    },
    {
        title: "Legal",
        links: [{ label: "Privacy" }, { label: "Terms" }, { label: "Cookies" }],
    },
];

export function Footer() {
    return (
        <footer className="mt-56 border-t border-border bg-muted/50 pb-[calc(env(safe-area-inset-bottom)+68px)] lg:mt-28 lg:pb-0">
            <Container className="py-12 lg:py-16">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2.6fr)] lg:gap-16">
                    <div>
                        <Wordmark size="md" />
                        <p className="mt-4 max-w-[36ch] text-[0.9rem] leading-relaxed text-muted-foreground">
                            Discover the best deals, coupons, and offers all in
                            one place.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4">
                        {COLUMNS.map((col) => (
                            <div key={col.title}>
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-foreground">
                                    {col.title}
                                </h3>
                                <ul className="space-y-2.5">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            {link.href ? (
                                                <Link
                                                    href={link.href}
                                                    className="text-[0.9rem] text-muted-foreground transition-colors hover:text-primary"
                                                >
                                                    {link.label}
                                                </Link>
                                            ) : (
                                                <span className="text-[0.9rem] text-muted-foreground">
                                                    {link.label}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-start sm:justify-between lg:mt-16">
                    <p className="text-[0.8125rem] text-muted-foreground">
                        © {new Date().getFullYear()} Kuponi.al. All rights
                        reserved.
                    </p>
                    <p className="max-w-[62ch] text-[0.8125rem] leading-relaxed text-muted-foreground sm:text-right">
                        Prices and availability are subject to change without
                        notice.
                    </p>
                </div>
            </Container>
        </footer>
    );
}
