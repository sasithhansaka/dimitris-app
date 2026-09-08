import Confirm from '@/components/Models/Confirm';
import MasterTab, { TableBody, TableTd } from '@/components/shared/masterTab';
import { Badge } from '@/components/ui/badge';
import { currencyLabel } from '@/lib/currencies';
import { dashboard } from '@/routes';
import couponsRoutes from '@/routes/coupons';
import type { BreadcrumbItem, Coupon } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

const tableColumns = [
    { label: 'ID', sortField: 'id', sortable: false, width: 4 },
    { label: 'Name', sortField: 'name', sortable: false, width: '20%' },
    {
        label: 'Currency',
        sortField: 'currency',
        sortable: false,
        width: '10%',
    },
    {
        label: 'Products',
        sortField: 'products',
        sortable: false,
        width: '16%',
    },
    {
        label: 'Start Date',
        sortField: 'start_date',
        sortable: false,
        width: '12%',
    },
    {
        label: 'End Date',
        sortField: 'end_date',
        sortable: false,
        width: '12%',
    },
    { label: 'Status', sortField: 'status', sortable: false, width: '10%' },
    { label: 'Actions', sortField: 'actions', sortable: false, width: '15%' },
];

function statusClassName(status: string): string {
    switch (status) {
        case 'active':
            return 'bg-gray-100 text-[#073BBC]';
        case 'inactive':
            return 'bg-gray-100 text-black';
        default:
            return 'bg-gray-100 text-red-500';
    }
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function CouponsIndex({
    coupons,
    filters,
}: {
    coupons: {
        data: Coupon[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!couponToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(couponsRoutes.destroy(couponToDelete.id).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setCouponToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Coupons" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={couponsRoutes.index().url}
                    createLink={{
                        label: 'Create Coupon',
                        url: couponsRoutes.create().url,
                    }}
                    search={{ placeholder: 'Search by name or description...' }}
                    statusFilter={{
                        options: [
                            { label: 'All', value: '' },
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                            { label: 'Draft', value: 'draft' },
                        ],
                    }}
                    links={coupons.links}
                >
                    {coupons.data.map((coupon) => (
                        <TableBody
                            key={coupon.id}
                            buttons={
                                <>
                                    <Link
                                        href={couponsRoutes.show(coupon.id).url}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        View
                                    </Link>
                                    <Link
                                        href={couponsRoutes.edit(coupon.id).url}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCouponToDelete(coupon)
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-red-600 hover:underline"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Delete
                                    </button>
                                </>
                            }
                        >
                            <TableTd width={80}>{coupon.id}</TableTd>
                            <TableTd>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`/storage/${coupon.image}`}
                                        alt={coupon.name}
                                        className="border-border size-8 shrink-0 rounded-md border object-cover"
                                    />
                                    <span
                                        className="line-clamp-2"
                                        title={coupon.name}
                                    >
                                        {coupon.name}
                                    </span>
                                </div>
                            </TableTd>
                            <TableTd>
                                {currencyLabel(coupon.currency)}
                            </TableTd>
                            <TableTd>
                                {coupon.products &&
                                coupon.products.length > 0 ? (
                                    <span
                                        className="block truncate"
                                        title={coupon.products
                                            .map((p) => p.name)
                                            .join(', ')}
                                    >
                                        {coupon.products[0].name}
                                        {coupon.products.length > 1 &&
                                            ` +${coupon.products.length - 1} more`}
                                    </span>
                                ) : (
                                    '-'
                                )}
                            </TableTd>
                            <TableTd>{formatDate(coupon.start_date)}</TableTd>
                            <TableTd>{formatDate(coupon.end_date)}</TableTd>
                            <TableTd>
                                <Badge
                                    className={`capitalize ${statusClassName(coupon.status)}`}
                                >
                                    {coupon.status}
                                </Badge>
                            </TableTd>
                            <TableTd width={140}>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={couponsRoutes.show(coupon.id).url}
                                        title="View"
                                        className="text-[#073BBC] transition-colors hover:text-[#0433ac]"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={couponsRoutes.edit(coupon.id).url}
                                        title="Edit"
                                        className="text-[#073BBC] transition-colors hover:text-[#0433ac]"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        title="Delete"
                                        onClick={() =>
                                            setCouponToDelete(coupon)
                                        }
                                        className="cursor-pointer text-red-400 transition-colors hover:text-red-600"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </TableTd>
                        </TableBody>
                    ))}
                </MasterTab>
            </div>

            <Confirm
                isOpen={couponToDelete !== null}
                onClose={() => setCouponToDelete(null)}
                onConfirm={handleDelete}
                title="Delete coupon"
                message={
                    couponToDelete
                        ? `Are you sure you want to delete "${couponToDelete.name}"?`
                        : ''
                }
                confirmText="Delete"
                variant="danger"
                isProcessing={isDeleting}
            />
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Coupons', href: couponsRoutes.index() },
];

CouponsIndex.layout = {
    breadcrumbs,
};
