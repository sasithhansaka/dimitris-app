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
import distributorsRoutes from "@/routes/distributors";
import type { Brand, BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Plus, Tag, X } from "lucide-react";
import { useRef, useState } from "react";

export default function EditBrand({
    brand,
    distributors,
}: {
    brand: Brand;
    distributors: { id: number; name: string }[];
}) {
    const linkedTo = [
        (brand.products_count ?? 0) > 0 ? "products" : null,
        (brand.offers_count ?? 0) > 0 ? "offers" : null,
    ].filter((item): item is string => item !== null);
    const isLinkedToProducts = linkedTo.length > 0;

    const { data, setData, post, processing, errors } = useForm({
        name: brand.name,
        description: brand.description ?? "",
        logo: null as File | null,
        website: brand.website ?? "",
        status: brand.status,
        featured: brand.featured,
        distributor_ids: (brand.distributors ?? []).map((d) => d.id),
        remove_logo: false,
        _method: "put",
    });

    const originalLogo = brand.logo ? `/storage/${brand.logo}` : null;
    const [logoPreview, setLogoPreview] = useState<string | null>(originalLogo);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sortedDistributors = [...distributors].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    const toggleDistributor = (id: number, checked: boolean) => {
        setData(
            "distributor_ids",
            checked
                ? [...data.distributor_ids, id]
                : data.distributor_ids.filter(
                      (distributorId) => distributorId !== id,
                  ),
        );
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData((prevData) => ({
            ...prevData,
            logo: file,
            remove_logo: false,
        }));
        setLogoPreview(file ? URL.createObjectURL(file) : logoPreview);
    };

    const removeLogo = () => {
        setData((prevData) => ({
            ...prevData,
            logo: null,
            remove_logo: true,
        }));
        setLogoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(brandsRoutes.update(brand.id).url, { forceFormData: true });
    };

    return (
        <>
            <Head title="Edit Brand" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-5 space-y-1">
                        <h1 className="text-foreground text-xl font-semibold tracking-tight">
                            Edit brand
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Update the details of this brand.
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <Card className="gap-0 border py-0 shadow-none">
                            <CardHeader className="border-border border-b px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <Tag className="text-muted-foreground size-4.5" />
                                    <span className="text-foreground text-sm font-semibold">
                                        Edit brand
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8 px-6 py-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="brand_code">
                                            Brand ID
                                        </Label>
                                        <Input
                                            id="brand_code"
                                            type="text"
                                            value={brand.brand_code}
                                            disabled
                                            readOnly
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Brand Name{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            autoFocus
                                            placeholder="e.g. Acme Corp"
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
                                                This brand is linked to one or
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
                                            Featured brand
                                        </Label>
                                        <InputError message={errors.featured} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="website">
                                            Website URL
                                        </Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            placeholder="e.g. https://www.brand.com"
                                            value={data.website}
                                            onChange={(e) =>
                                                setData(
                                                    "website",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.website} />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="description">
                                            Internal Notes
                                        </Label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            placeholder="Internal notes about this brand"
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
                                        <div className="flex items-center gap-3">
                                            <Label>
                                                Distributors{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Link
                                                href={
                                                    distributorsRoutes.create()
                                                        .url
                                                }
                                                title="Create distributor"
                                                className="text-muted-foreground hover:text-foreground bg-secondary inline-flex items-center"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Link>
                                        </div>
                                        <div className="border-border max-h-[100px] overflow-y-auto rounded-md border p-3 md:max-h-[250px] lg:max-h-[350px]">
                                            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                                {sortedDistributors.map(
                                                    (distributor) => (
                                                        <div
                                                            key={distributor.id}
                                                            className="flex min-w-0 items-center gap-2"
                                                        >
                                                            <Checkbox
                                                                id={`distributor-${distributor.id}`}
                                                                checked={data.distributor_ids.includes(
                                                                    distributor.id,
                                                                )}
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    toggleDistributor(
                                                                        distributor.id,
                                                                        checked ===
                                                                            true,
                                                                    )
                                                                }
                                                                className="shrink-0"
                                                            />
                                                            <Label
                                                                htmlFor={`distributor-${distributor.id}`}
                                                                className="min-w-0 flex-1 truncate leading-normal font-normal"
                                                                title={
                                                                    distributor.name
                                                                }
                                                            >
                                                                {
                                                                    distributor.name
                                                                }
                                                            </Label>
                                                        </div>
                                                    ),
                                                )}
                                                {sortedDistributors.length ===
                                                    0 && (
                                                    <p className="text-muted-foreground col-span-3 text-sm">
                                                        No distributors
                                                        available.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <InputError
                                            message={errors.distributor_ids}
                                        />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="logo">Logo</Label>
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleLogoChange}
                                        />
                                        {logoPreview && (
                                            <div className="relative mt-2 w-fit">
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    className="border-border h-40 w-40 rounded-md border object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeLogo}
                                                    title="Remove logo"
                                                    className="absolute -top-2 -right-2 cursor-pointer rounded-full bg-gray-100 p-1 text-black hover:opacity-90"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                        <InputError message={errors.logo} />
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
    { title: "Brands", href: brandsRoutes.index() },
    { title: "Edit", href: "#" },
];

EditBrand.layout = {
    breadcrumbs,
};
