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
import offersRoutes from "@/routes/offers";
import type { BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Percent, Plus, X } from "lucide-react";
import { useRef, useState } from "react";

type OfferBrandOption = {
    id: number;
    name: string;
    distributors?: { id: number; name: string }[];
};

function brandOptionLabel(brand: OfferBrandOption): string {
    const distributorNames = (brand.distributors ?? [])
        .map((d) => d.name)
        .join(", ");

    return distributorNames
        ? `${brand.name} - Distributor: ${distributorNames}`
        : brand.name;
}

export default function CreateOffer({
    brands,
    nextOfferCode,
}: {
    brands: OfferBrandOption[];
    nextOfferCode: string;
}) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        brand_id: "",
        description: "",
        image: null as File | null,
        status: "active",
        featured: false,
        start_date: "",
        end_date: "",
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sortedBrands = [...brands].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData("image", file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const removeImage = () => {
        setData("image", null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(offersRoutes.store().url, { forceFormData: true });
    };

    return (
        <>
            <Head title="Create Offer" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-5 space-y-1">
                        <h1 className="text-foreground text-xl font-semibold tracking-tight">
                            Create offer
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Add a new offer and assign its brand.
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <Card className="gap-0 border py-0 shadow-none">
                            <CardHeader className="border-border border-b px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <Percent className="text-muted-foreground size-4.5" />
                                    <span className="text-foreground text-sm font-semibold">
                                        New offer
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8 px-6 py-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="offer_code">
                                            Offer ID
                                        </Label>
                                        <Input
                                            id="offer_code"
                                            type="text"
                                            value={nextOfferCode}
                                            disabled
                                            readOnly
                                        />
                                        <p className="text-muted-foreground text-xs">
                                            Automatically assigned when the
                                            offer is created.
                                        </p>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="title">
                                            Title{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            autoFocus
                                            placeholder="e.g. Summer Sale"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                        />
                                        <InputError message={errors.title} />
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
                                        <Label htmlFor="status">
                                            Status{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) =>
                                                setData("status", value)
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
                                            Featured offer
                                        </Label>
                                        <InputError message={errors.featured} />
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
                                            placeholder="A short description of this offer"
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
                                    Create offer
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
    { title: "Offers", href: offersRoutes.index() },
    { title: "Create", href: offersRoutes.create() },
];

CreateOffer.layout = {
    breadcrumbs,
};
