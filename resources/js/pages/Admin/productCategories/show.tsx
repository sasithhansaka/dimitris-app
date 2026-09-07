import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dashboard } from '@/routes';
import productCategoriesRoutes from '@/routes/product-categories';
import type { BreadcrumbItem, ProductCategory } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PencilIcon, Tags } from 'lucide-react';

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

function StatusBadge({ status }: { status: ProductCategory['status'] }) {
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

export default function ProductCategoriesShow({
    productCategory,
}: {
    productCategory: ProductCategory;
}) {
    return (
        <>
            <Head title={`Product Category: ${productCategory.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl lg:mt-3 lg:px-2">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-foreground text-xl font-semibold tracking-tight">
                                Product category details
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                View this product category's information.
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
                                    href={
                                        productCategoriesRoutes.edit(
                                            productCategory.id,
                                        ).url
                                    }
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
                                <Link
                                    href={productCategoriesRoutes.index().url}
                                >
                                    Back to Product Categories
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card className="gap-0 border py-0 shadow-none">
                        <CardHeader className="border-border border-b px-6 py-5">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="border-border bg-muted flex size-10 items-center justify-center rounded-md border">
                                        <Tags className="text-muted-foreground size-4.5" />
                                    </div>
                                    <span className="text-foreground text-sm font-semibold">
                                        {productCategory.name}
                                    </span>
                                </div>
                                <StatusBadge status={productCategory.status} />
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-8 px-6 py-6">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <InfoRow
                                    label="Name"
                                    value={productCategory.name}
                                />
                                <InfoRow
                                    label="Created"
                                    value={formatDate(
                                        productCategory.created_at,
                                    )}
                                />
                            </div>

                            <Separator />

                            <InfoRow
                                label="Description"
                                value={productCategory.description ?? '-'}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Product Categories', href: productCategoriesRoutes.index() },
    { title: 'View Product Category', href: '#' },
];

ProductCategoriesShow.layout = {
    breadcrumbs,
};
