import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import productCategoriesRoutes from "@/routes/product-categories";
import type { BreadcrumbItem, ProductCategory } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { Tags, X } from "lucide-react";
import { useRef, useState } from "react";

export default function EditProductCategory({
    productCategory,
}: {
    productCategory: ProductCategory;
}) {
    const isLinkedToProducts = (productCategory.products_count ?? 0) > 0;

    const { data, setData, post, processing, errors } = useForm({
        name: productCategory.name,
        description: productCategory.description ?? "",
        image: null as File | null,
        display_order: String(productCategory.display_order),
        status: productCategory.status,
        remove_image: false,
        _method: "put",
    });

    const originalImage = productCategory.image
        ? `/storage/${productCategory.image}`
        : null;
    const [imagePreview, setImagePreview] = useState<string | null>(
        originalImage,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        post(productCategoriesRoutes.update(productCategory.id).url, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Edit Product Category" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-5 space-y-1">
                        <h1 className="text-foreground text-xl font-semibold tracking-tight">
                            Edit product category
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Update the details of this product category.
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <Card className="gap-0 border py-0 shadow-none">
                            <CardHeader className="border-border border-b px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <Tags className="text-muted-foreground size-4.5" />
                                    <span className="text-foreground text-sm font-semibold">
                                        Edit product category
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8 px-6 py-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="category_code">
                                            Category ID
                                        </Label>
                                        <Input
                                            id="category_code"
                                            type="text"
                                            value={
                                                productCategory.category_code
                                            }
                                            disabled
                                            readOnly
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Category Name{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            autoFocus
                                            placeholder="e.g. Electronics"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                        />
                                        <InputError message={errors.name} />
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
                                                    disabled={
                                                        isLinkedToProducts
                                                    }
                                                >
                                                    Inactive
                                                </SelectItem>
                                                <SelectItem
                                                    value="draft"
                                                    disabled={
                                                        isLinkedToProducts
                                                    }
                                                >
                                                    Draft
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {isLinkedToProducts && (
                                            <p className="text-muted-foreground text-xs">
                                                This product category is linked
                                                to one or more products and must
                                                stay active.
                                            </p>
                                        )}
                                        <InputError message={errors.status} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="display_order">
                                            Display Order{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="display_order"
                                            type="number"
                                            min={1}
                                            placeholder="e.g. 1"
                                            value={data.display_order}
                                            onChange={(e) =>
                                                setData(
                                                    "display_order",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.display_order}
                                        />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            placeholder="A short description of this category"
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

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="image">Image</Label>
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
    { title: "Product Categories", href: productCategoriesRoutes.index() },
    { title: "Edit", href: "#" },
];

EditProductCategory.layout = {
    breadcrumbs,
};
