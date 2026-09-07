import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dashboard } from '@/routes';
import distributorsRoutes from '@/routes/distributors';
import type { BreadcrumbItem, Distributor } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Building2, Mail, MapPin, Phone, Tag } from 'lucide-react';

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

function StatusBadge({ status }: { status: Distributor['status'] }) {
    if (status === 'active') {
        return (
            <Badge className="border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                Active
            </Badge>
        );
    }

    if (status === 'inactive') {
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
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function DistributorsShow({
    distributor,
}: {
    distributor: Distributor;
}) {
    const brands = [...(distributor.brands ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    return (
        <>
            <Head title={`Distributor: ${distributor.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl lg:mt-3 lg:px-2">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-foreground text-xl font-semibold tracking-tight">
                                Distributor details
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                View this distributor's information.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-10 text-[#000000] hover:text-[#000000]/80"
                            >
                                <Link href={distributorsRoutes.index().url}>
                                    Back to Distributors
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card className="gap-0 border py-0 shadow-none">
                        <CardHeader className="border-border border-b px-6 py-5">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    {distributor.logo ? (
                                        <img
                                            src={`/storage/${distributor.logo}`}
                                            alt={distributor.name}
                                            className="border-border size-10 rounded-md border object-cover"
                                        />
                                    ) : (
                                        <div className="border-border bg-muted flex size-10 items-center justify-center rounded-md border">
                                            <Building2 className="text-muted-foreground size-4.5" />
                                        </div>
                                    )}
                                    <span className="text-foreground text-sm font-semibold">
                                        {distributor.name}
                                    </span>
                                </div>
                                <StatusBadge status={distributor.status} />
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-8 px-6 py-6">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <InfoRow
                                    label="Name"
                                    value={distributor.name}
                                />
                                <InfoRow
                                    label="Country"
                                    value={
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPin className="text-muted-foreground size-3.5" />
                                            {distributor.country}
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label="Email address"
                                    value={
                                        distributor.email ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Mail className="text-muted-foreground size-3.5" />
                                                {distributor.email}
                                            </span>
                                        ) : (
                                            '-'
                                        )
                                    }
                                />
                                <InfoRow
                                    label="Phone"
                                    value={
                                        distributor.phone ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Phone className="text-muted-foreground size-3.5" />
                                                {distributor.phone}
                                            </span>
                                        ) : (
                                            '-'
                                        )
                                    }
                                />
                                <InfoRow
                                    label="Address"
                                    value={distributor.address ?? '-'}
                                />
                                <InfoRow
                                    label="Created"
                                    value={formatDate(distributor.created_at)}
                                />
                            </div>

                            <Separator />

                            <InfoRow
                                label="Description"
                                value={distributor.description ?? '-'}
                            />

                            <Separator />

                            <div className="grid gap-2">
                                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                    Brands
                                </span>
                                {brands.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {brands.map((brand) => (
                                            <span
                                                key={brand.id}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                                            >
                                                <Tag className="text-muted-foreground size-3.5" />
                                                {brand.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-foreground text-sm">
                                        No brands linked.
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Distributors', href: distributorsRoutes.index() },
    { title: 'View Distributor', href: '#' },
];

DistributorsShow.layout = {
    breadcrumbs,
};
