import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { COUNTRIES } from '@/lib/countries';
import { dashboard } from '@/routes';
import productsRoutes from '@/routes/products';
import retailersRoutes from '@/routes/retailers';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Store, X } from 'lucide-react';
import { useRef, useState } from 'react';

export default function CreateRetailer({
    products,
}: {
    products: { id: number; name: string }[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        country: '',
        description: '',
        logo: null as File | null,
        email: '',
        phone: '',
        address: '',
        status: 'active',
        product_ids: [] as number[],
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sortedProducts = [...products].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    const toggleProduct = (id: number, checked: boolean) => {
        setData(
            'product_ids',
            checked
                ? [...data.product_ids, id]
                : data.product_ids.filter((productId) => productId !== id),
        );
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
        setLogoPreview(file ? URL.createObjectURL(file) : null);
    };

    const removeLogo = () => {
        setData('logo', null);
        setLogoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(retailersRoutes.store().url, { forceFormData: true });
    };

    return (
        <>
            <Head title="Create Retailer" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-5 space-y-1">
                        <h1 className="text-foreground text-xl font-semibold tracking-tight">
                            Create retailer
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Add a new retailer and assign its products.
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <Card className="gap-0 border py-0 shadow-none">
                            <CardHeader className="border-border border-b px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <Store className="text-muted-foreground size-4.5" />
                                    <span className="text-foreground text-sm font-semibold">
                                        New retailer
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8 px-6 py-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Retailer Name{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            autoFocus
                                            placeholder="e.g. ABC Supermarket"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="country">
                                            Country{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.country}
                                            onValueChange={(value) =>
                                                setData('country', value)
                                            }
                                        >
                                            <SelectTrigger
                                                id="country"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-72">
                                                {COUNTRIES.map((country) => (
                                                    <SelectItem
                                                        key={country}
                                                        value={country}
                                                    >
                                                        {country}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.country} />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            placeholder="A short description of this retailer"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
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
                                        <Label htmlFor="status">
                                            Status{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) =>
                                                setData('status', value)
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
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="e.g. contact@retailer.com"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            inputMode="tel"
                                            placeholder="e.g. +1 555 123 4567"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData(
                                                    'phone',
                                                    e.target.value.replace(
                                                        /[^0-9+\-()\s]/g,
                                                        '',
                                                    ),
                                                )
                                            }
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            type="text"
                                            placeholder="e.g. 123 Main Street, City"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    'address',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <div className="flex items-center gap-3">
                                            <Label>
                                                Products{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Link
                                                href={
                                                    productsRoutes.create().url
                                                }
                                                title="Create product"
                                                className="text-muted-foreground hover:text-foreground bg-secondary inline-flex items-center"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Link>
                                        </div>
                                        <div className="border-border max-h-[100px] overflow-y-auto rounded-md border p-3 md:max-h-[250px] lg:max-h-[350px]">
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
                                                {sortedProducts.length ===
                                                    0 && (
                                                    <p className="text-muted-foreground col-span-3 text-sm">
                                                        No products available.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <InputError
                                            message={errors.product_ids}
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
                                    Create retailer
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
    { title: 'Dashboard', href: dashboard() },
    { title: 'Retailers', href: retailersRoutes.index() },
    { title: 'Create', href: retailersRoutes.create() },
];

CreateRetailer.layout = {
    breadcrumbs,
};
