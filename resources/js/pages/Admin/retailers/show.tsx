import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dashboard } from '@/routes';
import retailersRoutes from '@/routes/retailers';
import type { BreadcrumbItem, Retailer } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Mail, MapPin, Package, PencilIcon, Phone, Store } from 'lucide-react';

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

function StatusBadge({ status }: { status: Retailer['status'] }) {
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

export default function RetailersShow({ retailer }: { retailer: Retailer }) {
    const products = [...(retailer.products ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    return (
        <>
            <Head title={`Retailer: ${retailer.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl lg:mt-3 lg:px-2">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-foreground text-xl font-semibold tracking-tight">
                                Retailer details
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                View this retailer's information and products.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-10 text-[#000000] hover:text-[#000000]/80"
                            >
                                <Link
                                    href={retailersRoutes.edit(retailer.id).url}
                                >
                                    <PencilIcon className="size-4" />
                                    Edit
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-10 text-[#000000] hover:text-[#000000]/80"
                            >
                                <Link href={retailersRoutes.index().url}>
                                    Back to Retailers
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card className="gap-0 border py-0 shadow-none">
                        <CardHeader className="border-border border-b px-6 py-5">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    {retailer.logo ? (
                                        <img
                                            src={`/storage/${retailer.logo}`}
                                            alt={retailer.name}
                                            className="border-border size-10 rounded-md border object-cover"
                                        />
                                    ) : (
                                        <div className="border-border bg-muted flex size-10 items-center justify-center rounded-md border">
                                            <Store className="text-muted-foreground size-4.5" />
                                        </div>
                                    )}
                                    <span className="text-foreground text-sm font-semibold">
                                        {retailer.name}
                                    </span>
                                </div>
                                <StatusBadge status={retailer.status} />
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-8 px-6 py-6">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <InfoRow label="Name" value={retailer.name} />
                                <InfoRow
                                    label="Country"
                                    value={
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPin className="text-muted-foreground size-3.5" />
                                            {retailer.country}
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label="Email address"
                                    value={
                                        retailer.email ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Mail className="text-muted-foreground size-3.5" />
                                                {retailer.email}
                                            </span>
                                        ) : (
                                            '-'
                                        )
                                    }
                                />
                                <InfoRow
                                    label="Phone"
                                    value={
                                        retailer.phone ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Phone className="text-muted-foreground size-3.5" />
                                                {retailer.phone}
                                            </span>
                                        ) : (
                                            '-'
                                        )
                                    }
                                />
                                <InfoRow
                                    label="Address"
                                    value={retailer.address ?? '-'}
                                />
                                <InfoRow
                                    label="Created"
                                    value={formatDate(retailer.created_at)}
                                />
                            </div>

                            <Separator />

                            <InfoRow
                                label="Description"
                                value={retailer.description ?? '-'}
                            />

                            <Separator />

                            <div className="grid gap-2">
                                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                    Products
                                </span>
                                {products.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {products.map((product) => (
                                            <span
                                                key={product.id}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                                            >
                                                <Package className="text-muted-foreground size-3.5" />
                                                {product.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-foreground text-sm">
                                        -
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
    { title: 'Retailers', href: retailersRoutes.index() },
    { title: 'View Retailer', href: '#' },
];

RetailersShow.layout = {
    breadcrumbs,
};
