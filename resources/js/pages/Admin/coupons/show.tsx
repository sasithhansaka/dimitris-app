import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { currencyLabel } from '@/lib/currencies';
import { dashboard } from '@/routes';
import couponsRoutes from '@/routes/coupons';
import type { BreadcrumbItem, Coupon } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, MapPin, Package, Store } from 'lucide-react';

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

function StatusBadge({ status }: { status: Coupon['status'] }) {
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

export default function CouponsShow({ coupon }: { coupon: Coupon }) {
    const products = [...(coupon.products ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name),
    );
    const retailers = [...(coupon.retailers ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    return (
        <>
            <Head title={`Coupon: ${coupon.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl lg:mt-3 lg:px-2">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-foreground text-xl font-semibold tracking-tight">
                                Coupon details
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                View this coupon's information, products and
                                retailers.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-10 text-[#000000] hover:text-[#000000]/80"
                            >
                                <Link href={couponsRoutes.index().url}>
                                    Back to Coupons
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card className="gap-0 border py-0 shadow-none">
                        <CardHeader className="border-border border-b px-6 py-5">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={`/storage/${coupon.image}`}
                                        alt={coupon.name}
                                        className="border-border size-10 rounded-md border object-cover"
                                    />
                                    <span className="text-foreground text-sm font-semibold">
                                        {coupon.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {coupon.featured && (
                                        <Badge className="border-transparent bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
                                            Featured Coupon
                                        </Badge>
                                    )}
                                    <StatusBadge status={coupon.status} />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-8 px-6 py-6">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <InfoRow label="Name" value={coupon.name} />
                                <InfoRow
                                    label="Country"
                                    value={
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPin className="text-muted-foreground size-3.5" />
                                            {coupon.country}
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label="Currency"
                                    value={currencyLabel(coupon.currency)}
                                />
                                <InfoRow
                                    label="Start Date"
                                    value={formatDate(coupon.start_date)}
                                />
                                <InfoRow
                                    label="End Date"
                                    value={formatDate(coupon.end_date)}
                                />
                                <InfoRow
                                    label="Created"
                                    value={formatDate(coupon.created_at)}
                                />
                            </div>

                            <Separator />

                            <InfoRow
                                label="Description"
                                value={coupon.description}
                            />

                            <Separator />

                            <div className="grid gap-2">
                                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                    Products
                                </span>
                                {products.length > 0 ? (
                                    <div className="grid gap-3 pt-1 sm:grid-cols-2">
                                        {products.map((product) => (
                                            <div
                                                key={product.id}
                                                className="border-border rounded-md border p-3"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                                                        <Package className="text-muted-foreground size-3.5" />
                                                        {product.name}
                                                    </span>
                                                    {product.pivot
                                                        .required && (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                                                            <CheckCircle2 className="size-3.5" />
                                                            Mandatory
                                                        </span>
                                                    )}
                                                </div>
                                                <dl className="text-muted-foreground mt-2 grid gap-1 text-xs">
                                                    <div>
                                                        <dt className="inline font-medium">
                                                            OCR name:
                                                        </dt>{' '}
                                                        <dd className="inline">
                                                            {
                                                                product.pivot
                                                                    .ocr_name
                                                            }
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="inline font-medium">
                                                            Keywords:
                                                        </dt>{' '}
                                                        <dd className="inline">
                                                            {product.pivot.ocr_keywords
                                                                .split(',')
                                                                .filter(
                                                                    (k) =>
                                                                        k.trim() !==
                                                                        '',
                                                                )
                                                                .join(', ')}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="inline font-medium">
                                                            Quantity:
                                                        </dt>{' '}
                                                        <dd className="inline">
                                                            {
                                                                product.pivot
                                                                    .quantity
                                                            }
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-foreground text-sm">
                                        -
                                    </span>
                                )}
                            </div>

                            <Separator />

                            <div className="grid gap-2">
                                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                    Retailers
                                </span>
                                {retailers.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {retailers.map((retailer) => (
                                            <span
                                                key={retailer.id}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                                            >
                                                <Store className="text-muted-foreground size-3.5" />
                                                {retailer.name}
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
    { title: 'Coupons', href: couponsRoutes.index() },
    { title: 'View Coupon', href: '#' },
];

CouponsShow.layout = {
    breadcrumbs,
};
