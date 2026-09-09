import { BrandMark } from "@/components/BrandMark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dashboard } from "@/routes";
import offersRoutes from "@/routes/offers";
import type { BreadcrumbItem, Offer } from "@/types";
import { Head, Link } from "@inertiajs/react";

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

function StatusBadge({ status }: { status: Offer["status"] }) {
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

export default function OffersShow({ offer }: { offer: Offer }) {
    return (
        <>
            <Head title={`Offer: ${offer.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl lg:mt-3 lg:px-2">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-foreground text-xl font-semibold tracking-tight">
                                Offer details
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                View this offer's information.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-10 text-[#000000] hover:text-[#000000]/80"
                            >
                                <Link href={offersRoutes.index().url}>
                                    Back to Offers
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card className="gap-0 border py-0 shadow-none">
                        <CardHeader className="border-border border-b px-6 py-5">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={`/storage/${offer.image}`}
                                        alt={offer.title}
                                        className="border-border size-10 rounded-md border object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-foreground text-sm font-semibold">
                                            {offer.title}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                            {offer.offer_code}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {offer.featured && (
                                        <Badge className="border-transparent bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
                                            Featured Offer
                                        </Badge>
                                    )}
                                    <StatusBadge status={offer.status} />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-8 px-6 py-6">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <InfoRow
                                    label="Offer ID"
                                    value={offer.offer_code}
                                />
                                <InfoRow label="Title" value={offer.title} />
                                <InfoRow
                                    label="Brand"
                                    value={
                                        offer.brand ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                <BrandMark
                                                    name={offer.brand.name}
                                                    logo={offer.brand.logo}
                                                    className="size-5 text-[10px]"
                                                />
                                                {offer.brand.name}
                                            </span>
                                        ) : (
                                            "-"
                                        )
                                    }
                                />
                                <InfoRow
                                    label="Start Date"
                                    value={formatDate(offer.start_date)}
                                />
                                <InfoRow
                                    label="End Date"
                                    value={formatDate(offer.end_date)}
                                />
                                <InfoRow
                                    label="Created"
                                    value={formatDate(offer.created_at)}
                                />
                            </div>

                            <Separator />

                            <InfoRow
                                label="Description"
                                value={offer.description}
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
    { title: "Offers", href: offersRoutes.index() },
    { title: "View Offer", href: "#" },
];

OffersShow.layout = {
    breadcrumbs,
};
