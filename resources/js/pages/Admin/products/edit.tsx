import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { dashboard } from "@/routes";
import brandsRoutes from "@/routes/brands";
import productCategoriesRoutes from "@/routes/product-categories";
import productsRoutes from "@/routes/products";
import type { BreadcrumbItem, Product } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Package, Plus, X } from "lucide-react";
import { useRef, useState } from "react";

type ProductBrandOption = {
    id: number;
    name: string;
    distributors?: { id: number; name: string }[];
};

function brandOptionLabel(brand: ProductBrandOption): string {
    const distributorNames = (brand.distributors ?? [])
        .map((d) => d.name)
        .join(", ");

    return distributorNames
        ? `${brand.name} - Distributor: ${distributorNames}`
        : brand.name;
}

export default function EditProduct({
    product,
    brands,
    categories,
}: {
    product: Product;
    brands: ProductBrandOption[];
    categories: { id: number; name: string }[];
}) {
    const linkedTo = [
        (product.retailers_count ?? 0) > 0 ? "retailers" : null,
        (product.coupons_count ?? 0) > 0 ? "coupons" : null,
    ].filter((item): item is string => item !== null);
    const isLinked = linkedTo.length > 0;

    const { data, setData, post, processing, errors } = useForm({
        name: product.name,
        brand_id: String(product.brand_id),
        category_id: String(product.category_id),
        description: product.description ?? "",
        pack_size: product.pack_size ?? "",
        sku: product.sku ?? "",
        barcode: product.barcode ?? "",
        variant: product.variant ?? "",
        receipt_aliases: product.receipt_aliases ?? "",
        image: null as File | null,
        status: product.status,
        featured: product.featured,
        remove_image: false,
        _method: "put",
    });

    const originalImage = product.image ? `/storage/${product.image}` : null;
    const [imagePreview, setImagePreview] = useState<string | null>(
        originalImage,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [receiptAliasInput, setReceiptAliasInput] = useState("");

    const receiptAliasList = data.receipt_aliases
        ? data.receipt_aliases.split(",").filter((k) => k.trim() !== "")
        : [];

    const addReceiptAlias = () => {
        const value = receiptAliasInput.trim();
        if (!value) {
            return;
        }
        if (receiptAliasList.includes(value)) {
            setReceiptAliasInput("");
            return;
        }
        setData("receipt_aliases", [...receiptAliasList, value].join(","));
        setReceiptAliasInput("");
    };

    const removeReceiptAlias = (alias: string) => {
        setData(
            "receipt_aliases",
            receiptAliasList.filter((k) => k !== alias).join(","),
        );
    };

    const handleReceiptAliasKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addReceiptAlias();
        }
    };

    const sortedBrands = [...brands].sort((a, b) =>
        a.name.localeCompare(b.name),
    );
    const sortedCategories = [...categories].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData((prevData) => ({
            ...prevData,
            image: file,
            remove_image: false,
        }));
        setImagePreview(file ? URL.createObjectURL(file) : imagePreview);
    };

    const removeImage = () => {
        setData((prevData) => ({
            ...prevData,
            image: null,
            remove_image: true,
        }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(productsRoutes.update(product.id).url, { forceFormData: true });
    };

    return (
        <>
            <Head title="Edit Product" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-5 space-y-1">
                        <h1 className="text-foreground text-xl font-semibold tracking-tight">
                            Edit product
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Update the details of this product.
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <Card className="gap-0 border py-0 shadow-none">
                            <CardHeader className="border-border border-b px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <Package className="text-muted-foreground size-4.5" />
                                    <span className="text-foreground text-sm font-semibold">
                                        Edit product
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8 px-6 py-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="product_code">
                                            Product ID
                                        </Label>
                                        <Input
                                            id="product_code"
                                            type="text"
                                            value={product.product_code}
                                            disabled
                                            readOnly
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Product Name{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            autoFocus
                                            placeholder="e.g. Wireless Mouse"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-3">
                                            <Label htmlFor="brand_id">
                                                Brand{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Link
                                                href={brandsRoutes.create().url}
                                                title="Create brand"
                                                className="text-muted-foreground hover:text-foreground bg-secondary inline-flex items-center"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Link>
                                        </div>
                                        {sortedBrands.length > 0 ? (
                                            <Select
                                                value={data.brand_id}
                                                onValueChange={(value) =>
                                                    setData("brand_id", value)
                                                }
                                            >
                                                <SelectTrigger
                                                    id="brand_id"
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Select brand" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sortedBrands.map(
                                                        (brand) => (
                                                            <SelectItem
                                                                key={brand.id}
                                                                value={String(
                                                                    brand.id,
                                                                )}
                                                            >
                                                                {brandOptionLabel(
                                                                    brand,
                                                                )}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p className="border-border text-muted-foreground rounded-md border border-dashed px-3 py-2 text-sm">
                                                No brands available. Create a
                                                brand first.
                                            </p>
                                        )}
                                        <InputError message={errors.brand_id} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="category_id">
                                                Category{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Link
                                                href={
                                                    productCategoriesRoutes.create()
                                                        .url
                                                }
                                                title="Create product category"
                                                className="text-muted-foreground hover:text-foreground bg-secondary inline-flex items-center"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Link>
                                        </div>
                                        {sortedCategories.length > 0 ? (
                                            <Select
                                                value={data.category_id}
                                                onValueChange={(value) =>
                                                    setData(
                                                        "category_id",
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id="category_id"
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sortedCategories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={
                                                                    category.id
                                                                }
                                                                value={String(
                                                                    category.id,
                                                                )}
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p className="border-border text-muted-foreground rounded-md border border-dashed px-3 py-2 text-sm">
                                                No categories available. Create
                                                a category first.
                                            </p>
                                        )}
                                        <InputError
                                            message={errors.category_id}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="status">
                                            Status{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) =>
                                                setData(
                                                    "status",
                                                    value as typeof data.status,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="status"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">
                                                    Active
                                                </SelectItem>
                                                <SelectItem
                                                    value="inactive"
                                                    disabled={isLinked}
                                                >
                                                    Inactive
                                                </SelectItem>
                                                <SelectItem
                                                    value="draft"
                                                    disabled={isLinked}
                                                >
                                                    Draft
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {isLinked && (
                                            <p className="text-muted-foreground text-xs">
                                                This product is linked to one or
                                                more {linkedTo.join(", ")} and
                                                must stay active.
                                            </p>
                                        )}
                                        <InputError message={errors.status} />
                                    </div>

                                    <div className="flex items-center gap-2 pt-7">
                                        <Checkbox
                                            id="featured"
                                            checked={data.featured}
                                            onCheckedChange={(checked) =>
                                                setData(
                                                    "featured",
                                                    checked === true,
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor="featured"
                                            className="font-normal"
                                        >
                                            Featured product
                                        </Label>
                                        <InputError message={errors.featured} />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="description">
                                            Description
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            placeholder="Description of this product"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm"
                                        />
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="pack_size">
                                            Pack Size
                                        </Label>
                                        <Input
                                            id="pack_size"
                                            type="text"
                                            placeholder="e.g. 500ml, 12-pack"
                                            value={data.pack_size}
                                            onChange={(e) =>
                                                setData(
                                                    "pack_size",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.pack_size}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="variant">Variant</Label>
                                        <Input
                                            id="variant"
                                            type="text"
                                            placeholder="e.g. Original, Blue"
                                            value={data.variant}
                                            onChange={(e) =>
                                                setData(
                                                    "variant",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.variant} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="sku">SKU</Label>
                                        <Input
                                            id="sku"
                                            type="text"
                                            placeholder="e.g. SKU-12345"
                                            value={data.sku}
                                            onChange={(e) =>
                                                setData("sku", e.target.value)
                                            }
                                        />
                                        <InputError message={errors.sku} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="barcode">Barcode</Label>
                                        <Input
                                            id="barcode"
                                            type="text"
                                            placeholder="e.g. 0123456789012"
                                            value={data.barcode}
                                            onChange={(e) =>
                                                setData(
                                                    "barcode",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.barcode} />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="receipt_aliases">
                                            Receipt Aliases
                                        </Label>
                                        <Input
                                            id="receipt_aliases"
                                            type="text"
                                            placeholder="Type an alias and press Enter"
                                            value={receiptAliasInput}
                                            onChange={(e) =>
                                                setReceiptAliasInput(
                                                    e.target.value,
                                                )
                                            }
                                            onKeyDown={
                                                handleReceiptAliasKeyDown
                                            }
                                        />
                                        {receiptAliasList.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {receiptAliasList.map(
                                                    (alias) => (
                                                        <span
                                                            key={alias}
                                                            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                                                        >
                                                            {alias}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeReceiptAlias(
                                                                        alias,
                                                                    )
                                                                }
                                                                className="cursor-pointer text-gray-500 hover:text-red-600"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                        <InputError
                                            message={errors.receipt_aliases}
                                        />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="image">
                                            Image{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                        />
                                        {imagePreview && (
                                            <div className="relative mt-2 w-fit">
                                                <img
                                                    src={imagePreview}
                                                    alt="Image preview"
                                                    className="border-border h-40 w-40 rounded-md border object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    title="Remove image"
                                                    className="absolute -top-2 -right-2 cursor-pointer rounded-full bg-gray-100 p-1 text-black hover:opacity-90"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                        <InputError message={errors.image} />
                                    </div>
                                </div>
                            </CardContent>

                            <div className="border-border bg-muted/30 flex items-center justify-end gap-3 rounded-b-xl border-t px-6 py-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    disabled={processing}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer"
                                >
                                    {processing && <Spinner />}
                                    Save changes
                                </Button>
                            </div>
                        </Card>
                    </form>
                </div>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: dashboard() },
    { title: "Products", href: productsRoutes.index() },
    { title: "Edit", href: "#" },
];

EditProduct.layout = {
    breadcrumbs,
};
