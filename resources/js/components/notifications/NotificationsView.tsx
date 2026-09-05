import { useState } from "react";
import { BellOff, CheckCheck } from "lucide-react";
import { EmptyState } from "../ui/EmptyState";
import { NotificationItem, type AppNotification } from "./NotificationItem";

const NORTHWIND = {
    id: "1",
    name: "Northwind",
    logo: { monogram: "N", accent: "#2563eb", ink: "#ffffff" },
};
const CIRCUIT = {
    id: "3",
    name: "Circuit",
    logo: { monogram: "C", accent: "#d97706", ink: "#ffffff" },
};

const now = Date.now();
const NOTIFICATIONS: AppNotification[] = [
    {
        id: "1",
        kind: "brand",
        title: "Northwind added a new storewide sale",
        body: "20% off your first order — no minimum spend required.",
        href: "/offers/northwind-storewide-sale",
        timestamp: new Date(now - 25 * 60 * 1000).toISOString(),
        brand: NORTHWIND,
    },
    {
        id: "2",
        kind: "expiry",
        title: "A saved coupon expires soon",
        body: "5% cashback on electronics purchases ends in 3 days.",
        href: "/coupons/5-cashback-electronics",
        timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "3",
        kind: "match",
        title: "New match for your preferences",
        body: "A new competition from Circuit matches your Electronics interest.",
        href: "/competitions/headphones-giveaway",
        timestamp: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "4",
        kind: "brand",
        title: "Circuit gift cards are back in stock",
        body: "Choose from $50, $100, or $200 denominations.",
        href: "/gift-cards/circuit-gift-card",
        timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
        brand: CIRCUIT,
    },
    {
        id: "5",
        kind: "digest",
        title: "Your weekly digest is ready",
        body: "See this week's best new offers and coupons.",
        href: "/offers",
        timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

function isToday(timestamp: string) {
    const date = new Date(timestamp);
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

export function NotificationsView() {
    const [readIds, setReadIds] = useState<string[]>([]);

    const isRead = (id: string) => readIds.includes(id);
    const toggleRead = (id: string) =>
        setReadIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    const markAllRead = () => setReadIds(NOTIFICATIONS.map((n) => n.id));

    const unreadCount = NOTIFICATIONS.filter((n) => !isRead(n.id)).length;

    if (NOTIFICATIONS.length === 0) {
        return (
            <EmptyState
                icon={BellOff}
                title="No notifications yet"
                body="You'll see updates about your saved coupons and brands here."
                actionLabel="Discover offers"
                actionHref="/offers"
                className="mt-8"
            />
        );
    }

    const today = NOTIFICATIONS.filter((n) => isToday(n.timestamp));
    const earlier = NOTIFICATIONS.filter((n) => !isToday(n.timestamp));

    const groups = [
        { label: "Today", items: today },
        { label: "Earlier", items: earlier },
    ].filter((g) => g.items.length > 0);

    return (
        <>
            <div className="mt-6 flex items-center justify-between gap-4 border-b border-rule pb-4">
                <p className="u-nums text-[0.9375rem] text-ink-2">
                    <span className="font-semibold text-ink">
                        {unreadCount}
                    </span>{" "}
                    unread
                </p>
                <button
                    type="button"
                    onClick={markAllRead}
                    disabled={unreadCount === 0}
                    className="inline-flex min-h-10 items-center gap-2 rounded-md border border-rule bg-surface px-3.5 py-2 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink-3 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-rule"
                >
                    <CheckCheck
                        className="size-4 shrink-0"
                        aria-hidden="true"
                    />
                    <span className="truncate">Mark all read</span>
                </button>
            </div>

            <div className="mt-8 space-y-9">
                {groups.map((group) => (
                    <section key={group.label}>
                        <h2 className="u-label mb-3 text-ink-3">
                            {group.label}
                        </h2>
                        <ul className="divide-rule divide-y overflow-hidden rounded-lg border border-rule bg-surface">
                            {group.items.map((n) => (
                                <NotificationItem
                                    key={n.id}
                                    notification={n}
                                    read={isRead(n.id)}
                                    onToggleRead={() => toggleRead(n.id)}
                                />
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </>
    );
}
