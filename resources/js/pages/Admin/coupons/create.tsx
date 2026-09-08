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
import { CURRENCIES, currencyLabel } from '@/lib/currencies';
import { dashboard } from '@/routes';
import couponsRoutes from '@/routes/coupons';
import retailersRoutes from '@/routes/retailers';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Package, Plus, Ticket, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type CouponProductForm = {
    product_id: string;
    ocr_name: string;
    ocr_keywords: string;
    quantity: string;
    required: boolean;
};

const emptyProduct = (): CouponProductForm => ({
    product_id: '',
    ocr_name: '',
    ocr_keywords: '',
    quantity: '1',
    required: false,
});

function ProductKeywordsInput({
    value,
    onChange,
    error,
}: {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}) {
    const [keywordInput, setKeywordInput] = useState('');

    const keywordList = value
        ? value.split(',').filter((k) => k.trim() !== '')
        : [];

    const addKeyword = () => {
        const trimmed = keywordInput.trim();
        if (!trimmed) {
            return;
        }
        if (keywordList.includes(trimmed)) {
            setKeywordInput('');
            return;
        }
        onChange([...keywordList, trimmed].join(','));
        setKeywordInput('');
    };

    const removeKeyword = (keyword: string) => {
        onChange(keywordList.filter((k) => k !== keyword).join(','));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addKeyword();
        }
    };

    return (
        <div className="grid gap-2">
            <Label>
                OCR Keywords{' '}
                <span className="text-destructive">*</span>
            </Label>
            <Input
                type="text"
                placeholder="Type a keyword and press Enter"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            {keywordList.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {keywordList.map((keyword) => (
                        <span
                            key={keyword}
                            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                        >
                            {keyword}
                            <button
                                type="button"
                                onClick={() => removeKeyword(keyword)}
                                className="cursor-pointer text-gray-500 hover:text-red-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <InputError message={error} />
        </div>
    );
}

export default function CreateCoupon({
    products,
}: {
    products: { id: number; name: string }[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        image: null as File | null,
        country: '',
        currency: '',
        start_date: '',
        end_date: '',
        status: 'active',
        featured: false,
        products: [emptyProduct()] as CouponProductForm[],
        retailer_ids: [] as number[],
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [retailers, setRetailers] = useState<
        { id: number; name: string }[]
    >([]);
    const [loadingRetailers, setLoadingRetailers] = useState(false);

    const sortedProducts = [...products].sort((a, b) =>
        a.name.localeCompare(b.name),
    );

    useEffect(() => {
        if (!data.country) {
            setRetailers([]);
            setData('retailer_ids', []);
            return;
        }

        setLoadingRetailers(true);

        router.reload({
            data: { country: data.country },
            only: ['retailers'],
            onSuccess: (page) => {
                const fetched =
                    (page.props.retailers as
                        | { id: number; name: string }[]
                        | undefined) ?? [];
                setRetailers(fetched);
                setData('retailer_ids', []);
                setLoadingRetailers(false);
            },
            onError: () => setLoadingRetailers(false),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.country]);

    const allRetailersSelected =
        retailers.length > 0 && data.retailer_ids.length === retailers.length;

    const toggleAllRetailers = (checked: boolean) => {
        setData('retailer_ids', checked ? retailers.map((r) => r.id) : []);
    };

    const toggleRetailer = (id: number, checked: boolean) => {
        setData(
            'retailer_ids',
            checked
                ? [...data.retailer_ids, id]
                : data.retailer_ids.filter((retailerId) => retailerId !== id),
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image', file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const updateProduct = (
        index: number,
        field: keyof CouponProductForm,
        value: string | boolean,
    ) => {
        setData(
            'products',
            data.products.map((product, i) =>
                i === index ? { ...product, [field]: value } : product,
            ),
        );
    };

    const addProduct = () => {
        setData('products', [...data.products, emptyProduct()]);
    };

    const removeProduct = (index: number) => {
        setData(
            'products',
            data.products.filter((_, i) => i !== index),
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(couponsRoutes.store().url, { forceFormData: true });
    };

    return (
        <>
            <Head title="Create Coupon" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-5 space-y-1">
                        <h1 className="text-foreground text-xl font-semibold tracking-tight">
                            Create coupon
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Add a new coupon, its products and eligible
                            retailers.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <Card className="gap-0 border py-0 shadow-none">
                            <CardHeader className="border-border border-b px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <Ticket className="text-muted-foreground size-4.5" />
                                    <span className="text-foreground text-sm font-semibold">
                                        Coupon information
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8 px-6 py-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="name">
                                            Name{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            autoFocus
                                            placeholder="e.g. Back to School Bundle"
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
                                        <InputError
                                            message={errors.country}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="currency">
                                            Currency{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.currency}
                                            onValueChange={(value) =>
                                                setData('currency', value)
                                            }
                                        >
                                            <SelectTrigger
                                                id="currency"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-72">
                                                {CURRENCIES.map((currency) => (
                                                    <SelectItem
                                                        key={currency}
                                                        value={currency}
                                                    >
                                                        {currencyLabel(
                                                            currency,
                                                        )}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.currency}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="start_date">
                                            Start Date{' '}
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
                                                    'start_date',
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
                                            End Date{' '}
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
                                                    'end_date',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.end_date} />
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

                                    <div className="flex items-center gap-2 pt-7">
                                        <Checkbox
                                            id="featured"
                                            checked={data.featured}
                                            onCheckedChange={(checked) =>
                                                setData(
                                                    'featured',
                                                    checked === true,
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor="featured"
                                            className="font-normal"
                                        >
                                            Featured coupon
                                        </Label>
                                        <InputError
                                            message={errors.featured}
                                        />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="description">
                                            Description{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            placeholder="A short description of this coupon"
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

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="image">
                                            Image{' '}
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
                        </Card>

                        <Card className="gap-0 border py-0 shadow-none">
                            <CardHeader className="border-border border-b px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <Package className="text-muted-foreground size-4.5" />
                                    <span className="text-foreground text-sm font-semibold">
                                        Products
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 px-6 py-6">
                                <InputError message={errors.products} />

                                {data.products.map((product, index) => (
                                    <div
                                        key={index}
                                        className="border-border relative grid gap-5 rounded-md border p-4 sm:grid-cols-2"
                                    >
                                        {data.products.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeProduct(index)
                                                }
                                                title="Remove product"
                                                className="absolute top-3 right-3 cursor-pointer text-red-400 transition-colors hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`product-${index}`}
                                            >
                                                Product{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            {sortedProducts.length > 0 ? (
                                                <Select
                                                    value={product.product_id}
                                                    onValueChange={(value) =>
                                                        updateProduct(
                                                            index,
                                                            'product_id',
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id={`product-${index}`}
                                                        className="w-full"
                                                    >
                                                        <SelectValue placeholder="Select product" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {sortedProducts.map(
                                                            (p) => (
                                                                <SelectItem
                                                                    key={p.id}
                                                                    value={String(
                                                                        p.id,
                                                                    )}
                                                                >
                                                                    {p.name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <p className="border-border text-muted-foreground rounded-md border border-dashed px-3 py-2 text-sm">
                                                    No active products
                                                    available.
                                                </p>
                                            )}
                                            <InputError
                                                message={
                                                    (errors as any)[
                                                        `products.${index}.product_id`
                                                    ]
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`ocr_name-${index}`}
                                            >
                                                OCR Name{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id={`ocr_name-${index}`}
                                                type="text"
                                                placeholder="Text to match on receipts"
                                                value={product.ocr_name}
                                                onChange={(e) =>
                                                    updateProduct(
                                                        index,
                                                        'ocr_name',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={
                                                    (errors as any)[
                                                        `products.${index}.ocr_name`
                                                    ]
                                                }
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <ProductKeywordsInput
                                                value={product.ocr_keywords}
                                                onChange={(value) =>
                                                    updateProduct(
                                                        index,
                                                        'ocr_keywords',
                                                        value,
                                                    )
                                                }
                                                error={
                                                    (errors as any)[
                                                        `products.${index}.ocr_keywords`
                                                    ]
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`quantity-${index}`}
                                            >
                                                Quantity{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id={`quantity-${index}`}
                                                type="number"
                                                min={1}
                                                value={product.quantity}
                                                onChange={(e) =>
                                                    updateProduct(
                                                        index,
                                                        'quantity',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={
                                                    (errors as any)[
                                                        `products.${index}.quantity`
                                                    ]
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 pt-7">
                                            <Checkbox
                                                id={`required-${index}`}
                                                checked={product.required}
                                                onCheckedChange={(checked) =>
                                                    updateProduct(
                                                        index,
                                                        'required',
                                                        checked === true,
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`required-${index}`}
                                                className="font-normal"
                                            >
                                                Mandatory
                                            </Label>
                                            <span className="text-muted-foreground text-xs">
                                                (unchecked = optional)
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addProduct}
                                    className="cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add another product
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="gap-0 border py-0 shadow-none">
                            <CardHeader className="border-border border-b px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <Ticket className="text-muted-foreground size-4.5" />
                                    <span className="text-foreground text-sm font-semibold">
                                        Retailers{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4 px-6 py-6">
                                {!data.country ? (
                                    <p className="text-muted-foreground text-sm">
                                        Select a country above to see its
                                        active retailers.
                                    </p>
                                ) : loadingRetailers ? (
                                    <p className="text-muted-foreground text-sm">
                                        Loading retailers...
                                    </p>
                                ) : retailers.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">
                                        No active retailers found for this
                                        country. At least one retailer is
                                        required, so please{' '}
                                        <Link
                                            href={
                                                retailersRoutes.create().url
                                            }
                                            className="text-[#073BBC] hover:underline"
                                        >
                                            create a retailer
                                        </Link>{' '}
                                        in this country first.
                                    </p>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 border-b pb-3">
                                            <Checkbox
                                                id="select_all_retailers"
                                                checked={allRetailersSelected}
                                                onCheckedChange={(checked) =>
                                                    toggleAllRetailers(
                                                        checked === true,
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor="select_all_retailers"
                                                className="font-normal"
                                            >
                                                Select all retailers in{' '}
                                                {data.country}
                                            </Label>
                                        </div>
                                        <div className="border-border max-h-[250px] overflow-y-auto rounded-md border p-3">
                                            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                                {retailers.map((retailer) => (
                                                    <div
                                                        key={retailer.id}
                                                        className="flex min-w-0 items-center gap-2"
                                                    >
                                                        <Checkbox
                                                            id={`retailer-${retailer.id}`}
                                                            checked={data.retailer_ids.includes(
                                                                retailer.id,
                                                            )}
                                                            onCheckedChange={(
                                                                checked,
                                                            ) =>
                                                                toggleRetailer(
                                                                    retailer.id,
                                                                    checked ===
                                                                        true,
                                                                )
                                                            }
                                                            className="shrink-0"
                                                        />
                                                        <Label
                                                            htmlFor={`retailer-${retailer.id}`}
                                                            className="min-w-0 flex-1 truncate leading-normal font-normal"
                                                            title={
                                                                retailer.name
                                                            }
                                                        >
                                                            {retailer.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                <InputError message={errors.retailer_ids} />
                                {retailers.length > 0 && (
                                    <p className="text-muted-foreground text-xs">
                                        Select at least one retailer for this
                                        coupon.
                                    </p>
                                )}
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
                                    Create coupon
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
    { title: 'Coupons', href: couponsRoutes.index() },
    { title: 'Create', href: couponsRoutes.create() },
];

CreateCoupon.layout = {
    breadcrumbs,
};
