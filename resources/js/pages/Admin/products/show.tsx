import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dashboard } from "@/routes";
import productsRoutes from "@/routes/products";
import type { BreadcrumbItem, Product } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { PencilIcon, Package, Store, Tags, Truck } from "lucide-react";

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

function StatusBadge({ status }: { status: Product["status"] }) {
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

export default function ProductsShow({ product }: { product: Product }) {
    const retailers = [...(product.retailers ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name),
    );
    const receiptAliases = (product.receipt_aliases ?? "")
        .split(",")
        .map((alias) => alias.trim())
        .filter(Boolean);

    return (
        <>
            <Head title={`Product: ${product.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl lg:mt-3 lg:px-2">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-foreground text-xl font-semibold tracking-tight">
                                Product details
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                View this product's information.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-10 text-[#000000] hover:text-[#000000]/80"
                            >
                                <Link
                                    href={productsRoutes.edit(product.id).url}
                                >
                                    <PencilIcon className="size-4" />
                                    Edit
                                </Link>
                            </Button> */}
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-10 text-[#000000] hover:text-[#000000]/80"
                            >
                                <Link href={productsRoutes.index().url}>
                                    Back to Products
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card className="gap-0 border py-0 shadow-none">
                        <CardHeader className="border-border border-b px-6 py-5">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    {product.image ? (
                                        <img
                                            src={`/storage/${product.image}`}
                                            alt={product.name}
                                            className="border-border size-10 rounded-md border object-cover"
                                        />
                                    ) : (
                                        <div className="border-border bg-muted flex size-10 items-center justify-center rounded-md border">
                                            <Package className="text-muted-foreground size-4.5" />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-foreground text-sm font-semibold">
                                            {product.name}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                            {product.product_code}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {product.featured && (
                                        <Badge className="border-transparent bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
                                            Featured Product
                                        </Badge>
                                    )}
                                    <StatusBadge status={product.status} />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-8 px-6 py-6">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <InfoRow
                                    label="Product ID"
                                    value={product.product_code}
                                />
                                <InfoRow label="Name" value={product.name} />
                                <InfoRow
                                    label="Brand"
                                    value={
                                        product.brand ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Truck className="text-muted-foreground size-3.5" />
                                                {product.brand.name}
                                            </span>
                                        ) : (
                                            "-"
                                        )
                                    }
                                />
                                <InfoRow
                                    label="Category"
                                    value={
                                        product.category ? (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Tags className="text-muted-foreground size-3.5" />
                                                {product.category.name}
                                            </span>
                                        ) : (
                                            "-"
                                        )
                                    }
                                />
                                <InfoRow
                                    label="Pack Size"
                                    value={product.pack_size ?? "-"}
                                />
                                <InfoRow
                                    label="Variant"
                                    value={product.variant ?? "-"}
                                />
                                <InfoRow
                                    label="SKU"
                                    value={product.sku ?? "-"}
                                />
                                <InfoRow
                                    label="Barcode"
                                    value={product.barcode ?? "-"}
                                />
                                <InfoRow
                                    label="Created"
                                    value={formatDate(product.created_at)}
                                />
                            </div>

                            <Separator />

                            <InfoRow
                                label="Description"
                                value={product.description ?? "-"}
                            />

                            <Separator />

                            <div className="grid gap-2">
                                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                    Receipt Aliases
                                </span>
                                {receiptAliases.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {receiptAliases.map((alias) => (
                                            <span
                                                key={alias}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                                            >
                                                {alias}
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
    { title: "Dashboard", href: dashboard() },
    { title: "Products", href: productsRoutes.index() },
    { title: "View Product", href: "#" },
];

ProductsShow.layout = {
    breadcrumbs,
};
