import Confirm from '@/components/Models/Confirm';
import MasterTab, { TableBody, TableTd } from '@/components/shared/masterTab';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import offersRoutes from '@/routes/offers';
import type { BreadcrumbItem, Offer } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

const tableColumns = [
    { label: 'ID', sortField: 'id', sortable: false, width: 4 },
    { label: 'Title', sortField: 'title', sortable: false, width: '22%' },
    { label: 'Brand', sortField: 'brand', sortable: false, width: '16%' },
    {
        label: 'Start Date',
        sortField: 'start_date',
        sortable: false,
        width: '14%',
    },
    {
        label: 'End Date',
        sortField: 'end_date',
        sortable: false,
        width: '14%',
    },
    { label: 'Status', sortField: 'status', sortable: false, width: '12%' },
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

export default function OffersIndex({
    offers,
    filters,
}: {
    offers: {
        data: Offer[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!offerToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(offersRoutes.destroy(offerToDelete.id).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setOfferToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Offers" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={offersRoutes.index().url}
                    createLink={{
                        label: 'Create Offer',
                        url: offersRoutes.create().url,
                    }}
                    search={{ placeholder: 'Search by title or description...' }}
                    statusFilter={{
                        options: [
                            { label: 'All', value: '' },
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                            { label: 'Draft', value: 'draft' },
                        ],
                    }}
                    links={offers.links}
                >
                    {offers.data.map((offer) => (
                        <TableBody
                            key={offer.id}
                            buttons={
                                <>
                                    <Link
                                        href={offersRoutes.show(offer.id).url}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        View
                                    </Link>
                                    <Link
                                        href={offersRoutes.edit(offer.id).url}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setOfferToDelete(offer)}
                                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-red-600 hover:underline"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Delete
                                    </button>
                                </>
                            }
                        >
                            <TableTd width={80}>{offer.id}</TableTd>
                            <TableTd>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`/storage/${offer.image}`}
                                        alt={offer.title}
                                        className="border-border size-8 shrink-0 rounded-md border object-cover"
                                    />
                                    <span
                                        className="line-clamp-2"
                                        title={offer.title}
                                    >
                                        {offer.title}
                                    </span>
                                </div>
                            </TableTd>
                            <TableTd>{offer.brand?.name ?? '-'}</TableTd>
                            <TableTd>{formatDate(offer.start_date)}</TableTd>
                            <TableTd>{formatDate(offer.end_date)}</TableTd>
                            <TableTd>
                                <Badge
                                    className={`capitalize ${statusClassName(offer.status)}`}
                                >
                                    {offer.status}
                                </Badge>
                            </TableTd>
                            <TableTd width={140}>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={offersRoutes.show(offer.id).url}
                                        title="View"
                                        className="text-[#073BBC] transition-colors hover:text-[#0433ac]"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={offersRoutes.edit(offer.id).url}
                                        title="Edit"
                                        className="text-[#073BBC] transition-colors hover:text-[#0433ac]"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        title="Delete"
                                        onClick={() => setOfferToDelete(offer)}
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
                isOpen={offerToDelete !== null}
                onClose={() => setOfferToDelete(null)}
                onConfirm={handleDelete}
                title="Delete offer"
                message={
                    offerToDelete
                        ? `Are you sure you want to delete "${offerToDelete.title}"?`
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
    { title: 'Offers', href: offersRoutes.index() },
];

OffersIndex.layout = {
    breadcrumbs,
};
