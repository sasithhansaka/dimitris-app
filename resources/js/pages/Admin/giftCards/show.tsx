import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currencySymbol } from "@/lib/currencies";
import { dashboard } from "@/routes";
import giftCardsRoutes from "@/routes/gift-cards";
import type { BreadcrumbItem, GiftCard } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Gift, Truck } from "lucide-react";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid gap-1.5">
            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {label}
            </span>
            <span className="text-foreground text-sm">{value}</span>
        </div>
    );
}

function StatusBadge({ status }: { status: GiftCard["status"] }) {
    if (status === "active") {
        return (
            <Badge className="border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                Active
            </Badge>
        );
    }

    if (status === "inactive") {
        return (
            <Badge className="border-transparent bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400">
                Inactive
            </Badge>
        );
    }

    return (
        <Badge className="border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
            Draft
        </Badge>
    );
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function GiftCardsShow({ giftCard }: { giftCard: GiftCard }) {
    const symbol = currencySymbol(giftCard.currency);
    const amounts = giftCard.amount
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

    return (
        <>
            <Head title={`Gift Card: ${giftCard.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl lg:mt-3 lg:px-2">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-foreground text-xl font-semibold tracking-tight">
                                Gift card details
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                View this gift card's information.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-10 text-[#000000] hover:text-[#000000]/80"
                            >
                                <Link href={giftCardsRoutes.index().url}>
                                    Back to Gift Cards
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card className="gap-0 border py-0 shadow-none">
                        <CardHeader className="border-border border-b px-6 py-5">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    {giftCard.image ? (
                                        <img
                                            src={`/storage/${giftCard.image}`}
                                            alt={giftCard.name}
                                            className="border-border size-10 rounded-md border object-cover"
                                        />
                                    ) : (
                                        <div className="border-border bg-muted flex size-10 items-center justify-center rounded-md border">
                                            <Gift className="text-muted-foreground size-4.5" />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-foreground text-sm font-semibold">
                                            {giftCard.name}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                            {giftCard.gift_code}
                                        </span>
                                    </div>
                                </div>
                                <StatusBadge status={giftCard.status} />
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-8 px-6 py-6">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <InfoRow
                                    label="Gift ID"
                                    value={giftCard.gift_code}
                                />
                                <InfoRow label="Name" value={giftCard.name} />
                                <InfoRow
                                    label="Brand"
                                    value={
                                        giftCard.brand ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Truck className="text-muted-foreground size-3.5" />
                                                {giftCard.brand.name}
                                            </span>
                                        ) : (
                                            "-"
                                        )
                                    }
                                />
                                <InfoRow
                                    label="Currency"
                                    value={giftCard.currency}
                                />
                                <InfoRow
                                    label="Start Date"
                                    value={formatDate(giftCard.start_date)}
                                />
                                <InfoRow
                                    label="End Date"
                                    value={formatDate(giftCard.end_date)}
                                />
                                <InfoRow
                                    label="Featured"
                                    value={giftCard.featured ? "Yes" : "No"}
                                />
                                <InfoRow
                                    label="Created"
                                    value={formatDate(giftCard.created_at)}
                                />
                            </div>

                            <Separator />

                            <div className="grid gap-2">
                                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                    Amounts
                                </span>
                                {amounts.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {amounts.map((amount) => (
                                            <span
                                                key={amount}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                                            >
                                                {symbol}
                                                {amount}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-foreground text-sm">
                                        -
                                    </span>
                                )}
                            </div>

                            <Separator />

                            <InfoRow
                                label="Description"
                                value={giftCard.description ?? "-"}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: dashboard() },
    { title: "Gift Cards", href: giftCardsRoutes.index() },
    { title: "View Gift Card", href: "#" },
];

GiftCardsShow.layout = {
    breadcrumbs,
};
