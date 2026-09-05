import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
  Bell,
  CreditCard,
  FileText,
  Menu,
  PackageSearch,
  Tags,
  TicketCheck,
  Trophy,
  User,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/products", label: "Products", icon: PackageSearch },
  { href: "/coupons", label: "Coupons", icon: TicketCheck },
  { href: "/competitions", label: "Competitions", icon: Trophy },
];

const MORE_LINKS = [
  { href: "/offers", label: "Offers", description: "Deals worth a look", icon: Tags },
  { href: "/gift-cards", label: "Gift Cards", description: "Buy and redeem gift cards", icon: CreditCard },
  { href: "/articles", label: "Articles", description: "Guides and buying tips", icon: FileText },
  { href: "/wallet", label: "Wallet", description: "Your saved items", icon: Wallet },
  { href: "/notifications", label: "Notifications", description: "Updates and alerts", icon: Bell },
  { href: "/account", label: "Profile", description: "Account settings", icon: User },
];

export function MobileNav() {
  const { url } = usePage();
  const [open, setOpen] = useState(false);
  const moreActive = MORE_LINKS.some((item) => url.startsWith(item.href));

  return (
    <>
      {open && (
        <>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close more menu"
            className="fixed inset-0 z-40 bg-foreground/28 lg:hidden"
          />
          <aside className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+58px)] z-50 rounded-t-xl border-t border-border bg-background p-5 shadow-[0_-18px_42px_-24px_rgba(20,21,28,0.55)] lg:hidden">
            <div className="mx-auto max-w-md">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[1.35rem] font-extrabold tracking-[-0.03em]">More</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close more menu"
                  className="flex size-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav aria-label="More destinations" className="mt-4 grid grid-cols-2 gap-2">
                {MORE_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-md border border-border bg-secondary p-4 transition-colors hover:border-foreground/30"
                    >
                      <span className="flex size-9 items-center justify-center rounded-md bg-muted text-primary">
                        <Icon className="size-4.5" />
                      </span>
                      <span className="mt-3 block text-[0.88rem] font-semibold text-foreground">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-[0.72rem] leading-snug text-muted-foreground">
                        {item.description}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        </>
      )}

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <ul className="mx-auto flex max-w-md items-stretch">
          {TABS.map((tab) => {
            const active = url.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex min-h-14.5 flex-col items-center justify-center gap-1 px-1 pt-1.5 pb-1 transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5.5" strokeWidth={active ? 2.3 : 1.9} />
                  <span className="max-w-full truncate text-[0.6875rem] leading-none font-medium">
                    {tab.label}
                  </span>
                  <span
                    className={cn(
                      "absolute inset-x-5 top-0 h-0.5 bg-primary transition-opacity",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                </Link>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              className={cn(
                "relative flex min-h-14.5 w-full flex-col items-center justify-center gap-1 px-1 pt-1.5 pb-1 transition-colors",
                open || moreActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Menu className="size-5.5" strokeWidth={open || moreActive ? 2.3 : 1.9} />
              <span className="text-[0.6875rem] leading-none font-medium">More</span>
              <span
                className={cn(
                  "absolute inset-x-5 top-0 h-0.5 bg-primary transition-opacity",
                  open || moreActive ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
