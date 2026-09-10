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
import stampProgramsRoutes from "@/routes/stamp-programs";
import type { BreadcrumbItem, StampProgram } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { Award, Package, X } from "lucide-react";
import { useRef, useState } from "react";

function toDateInputValue(date: string): string {
    return date.slice(0, 10);
}

export default function EditStampProgram({
    stampProgram,
    products,
    linked_product_ids: linkedProductIds,
}: {
    stampProgram: StampProgram;
    products: { id: number; name: string }[];
    linked_product_ids: number[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        name: stampProgram.name,
        description: stampProgram.description,
        required_stamps: String(stampProgram.required_stamps),
        image: null as File | null,
        remove_image: false,
        featured: stampProgram.featured,
        start_date: toDateInputValue(stampProgram.start_date),
        end_date: toDateInputValue(stampProgram.end_date),
        status: stampProgram.status,
        product_ids: linkedProductIds,
        _method: "put",
    });

    const originalImage = stampProgram.image
        ? `/storage/${stampProgram.image}`
        : null;
    const [imagePreview, setImagePreview] = useState<string | null>(
        originalImage,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sortedProducts = [...products].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    const allProductsSelected =
        sortedProducts.length > 0 &&
        data.product_ids.length === sortedProducts.length;

    const toggleAllProducts = (checked: boolean) => {
        setData(
            "product_ids",
            checked ? sortedProducts.map((p) => p.id) : [],
        );
    };

    const toggleProduct = (id: number, checked: boolean) => {
        setData(
            "product_ids",
            checked
                ? [...data.product_ids, id]
                : data.product_ids.filter((productId) => productId !== id),
        );
    };

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
        post(stampProgramsRoutes.update(stampProgram.id).url, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Edit Stamp Program" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-5 space-y-1">
                        <h1 className="text-xl font-semibold tracking-tight text-foreground">
                            Edit stamp program
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Update the stamp program and its linked products.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <Card className="gap-0 border py-0 shadow-none">
                            <CardHeader className="border-b border-border px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <Award className="size-4.5 text-muted-foreground" />
                                    <span className="text-sm font-semibold text-foreground">
                                        Edit stamp program
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8 px-6 py-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="stamp_code">
                                            Stamp Code
                                        </Label>
                                        <Input
                                            id="stamp_code"
                                            type="text"
                                            value={stampProgram.stamp_code}
                                            disabled
                                            readOnly
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Name{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            autoFocus
                                            placeholder="e.g. Coffee Lovers Stamp Card"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="required_stamps">
                                            Required Stamps{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="required_stamps"
                                            type="number"
                                            min={1}
                                            value={data.required_stamps}
                                            onChange={(e) =>
                                                setData(
                                                    "required_stamps",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.required_stamps}
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
                                                <SelectItem value="inactive">
                                                    Inactive
                                                </SelectItem>
                                                <SelectItem value="draft">
                                                    Draft
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="start_date">
                                            Start Date{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) =>
                                                setData(
                                                    "start_date",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.start_date}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="end_date">
                                            End Date{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) =>
                                                setData(
                                                    "end_date",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.end_date} />
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
                                            Featured program
                                        </Label>
                                        <InputError
                                            message={errors.featured}
                                        />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="description">
                                            Description{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            placeholder="A short description of this stamp program"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            className="border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive md:text-sm"
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
                                                    className="h-40 w-40 rounded-md border border-border object-cover"
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
                        </Card>

                        <Card className="gap-0 border py-0 shadow-none">
                            <CardHeader className="border-b border-border px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <Package className="size-4.5 text-muted-foreground" />
                                    <span className="text-sm font-semibold text-foreground">
                                        Products{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4 px-6 py-6">
                                {sortedProducts.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No active products available. Please
                                        create a product first.
                                    </p>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 border-b pb-3">
                                            <Checkbox
                                                id="select_all_products"
                                                checked={allProductsSelected}
                                                onCheckedChange={(checked) =>
                                                    toggleAllProducts(
                                                        checked === true,
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor="select_all_products"
                                                className="font-normal"
                                            >
                                                Select all products
                                            </Label>
                                        </div>
                                        <div className="max-h-[250px] overflow-y-auto rounded-md border border-border p-3">
                                            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                                {sortedProducts.map(
                                                    (product) => (
                                                        <div
                                                            key={product.id}
                                                            className="flex min-w-0 items-center gap-2"
                                                        >
                                                            <Checkbox
                                                                id={`product-${product.id}`}
                                                                checked={data.product_ids.includes(
                                                                    product.id,
                                                                )}
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    toggleProduct(
                                                                        product.id,
                                                                        checked ===
                                                                            true,
                                                                    )
                                                                }
                                                                className="shrink-0"
                                                            />
                                                            <Label
                                                                htmlFor={`product-${product.id}`}
                                                                className="min-w-0 flex-1 truncate leading-normal font-normal"
                                                                title={
                                                                    product.name
                                                                }
                                                            >
                                                                {product.name}
                                                            </Label>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                                <InputError message={errors.product_ids} />
                            </CardContent>

                            <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-border bg-muted/30 px-6 py-4">
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
    { title: "Stamp Programs", href: stampProgramsRoutes.index() },
    { title: "Edit", href: "#" },
];

EditStampProgram.layout = {
    breadcrumbs,
};
