import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import distributorsRoutes from '@/routes/distributors';
import type { BreadcrumbItem, Distributor } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Building2, X } from 'lucide-react';
import { useRef, useState } from 'react';

export default function EditDistributor({
    distributor,
}: {
    distributor: Distributor;
}) {
    const isLinkedToBrands = (distributor.brands_count ?? 0) > 0;

    const { data, setData, post, processing, errors } = useForm({
        name: distributor.name,
        country: distributor.country,
        description: distributor.description ?? '',
        logo: null as File | null,
        email: distributor.email ?? '',
        phone: distributor.phone ?? '',
        address: distributor.address ?? '',
        status: distributor.status,
        remove_logo: false,
        _method: 'put',
    });

    const originalLogo = distributor.logo
        ? `/storage/${distributor.logo}`
        : null;
    const [logoPreview, setLogoPreview] = useState<string | null>(originalLogo);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            fileInputRef.current.value = '';
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(distributorsRoutes.update(distributor.id).url, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Edit Distributor" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-5 space-y-1">
                        <h1 className="text-foreground text-xl font-semibold tracking-tight">
                            Edit distributor
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Update the details of this distributor.
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <Card className="gap-0 border py-0 shadow-none">
                            <CardHeader className="border-border border-b px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <Building2 className="text-muted-foreground size-4.5" />
                                    <span className="text-foreground text-sm font-semibold">
                                        Edit distributor
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8 px-6 py-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Distributor Name{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            autoFocus
                                            placeholder="e.g. Acme Distribution Ltd"
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
                                            placeholder="A short description of this distributor"
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
                                                setData(
                                                    'status',
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
                                                    disabled={isLinkedToBrands}
                                                >
                                                    Inactive
                                                </SelectItem>
                                                <SelectItem
                                                    value="draft"
                                                    disabled={isLinkedToBrands}
                                                >
                                                    Draft
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {isLinkedToBrands && (
                                            <p className="text-muted-foreground text-xs">
                                                This distributor is linked to
                                                one or more brands and must stay
                                                active.
                                            </p>
                                        )}
                                        <InputError message={errors.status} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="e.g. contact@distributor.com"
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
    { title: 'Dashboard', href: dashboard() },
    { title: 'Distributors', href: distributorsRoutes.index() },
    { title: 'Edit', href: '#' },
];

EditDistributor.layout = {
    breadcrumbs,
};
