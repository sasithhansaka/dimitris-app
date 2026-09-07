import Confirm from '@/components/Models/Confirm';
import MasterTab, { TableBody, TableTd } from '@/components/shared/masterTab';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import distributorsRoutes from '@/routes/distributors';
import type { BreadcrumbItem, Distributor } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

const tableColumns = [
    { label: 'ID', sortField: 'id', sortable: false, width: 4 },
    { label: 'Name', sortField: 'name', sortable: false, width: '18%' },
    { label: 'Country', sortField: 'country', sortable: false, width: '15%' },
    { label: 'Email', sortField: 'email', sortable: false, width: '20%' },
    { label: 'Phone', sortField: 'phone', sortable: false, width: '15%' },
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

export default function DistributorsIndex({
    distributors,
    filters,
}: {
    distributors: {
        data: Distributor[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    const [distributorToDelete, setDistributorToDelete] =
        useState<Distributor | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!distributorToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(distributorsRoutes.destroy(distributorToDelete.id).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDistributorToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Distributors" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={distributorsRoutes.index().url}
                    createLink={{
                        label: 'Create Distributor',
                        url: distributorsRoutes.create().url,
                    }}
                    search={{
                        placeholder: 'Search by name, country or email...',
                    }}
                    statusFilter={{
                        options: [
                            { label: 'All', value: '' },
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                            { label: 'Draft', value: 'draft' },
                        ],
                    }}
                    links={distributors.links}
                >
                    {distributors.data.map((distributor) => (
                        <TableBody
                            key={distributor.id}
                            buttons={
                                <>
                                    <Link
                                        href={
                                            distributorsRoutes.show(
                                                distributor.id,
                                            ).url
                                        }
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        View
                                    </Link>
                                    <Link
                                        href={
                                            distributorsRoutes.edit(
                                                distributor.id,
                                            ).url
                                        }
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDistributorToDelete(distributor)
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-red-600 hover:underline"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Delete
                                    </button>
                                </>
                            }
                        >
                            <TableTd width={80}>{distributor.id}</TableTd>
                            <TableTd>
                                <span
                                    className="line-clamp-2"
                                    title={distributor.name}
                                >
                                    {distributor.name}
                                </span>
                            </TableTd>
                            <TableTd>{distributor.country}</TableTd>
                            <TableTd>
                                <span
                                    className="block truncate"
                                    title={distributor.email ?? undefined}
                                >
                                    {distributor.email ?? '-'}
                                </span>
                            </TableTd>
                            <TableTd>{distributor.phone ?? '-'}</TableTd>
                            <TableTd>
                                <Badge
                                    className={`capitalize ${statusClassName(distributor.status)}`}
                                >
                                    {distributor.status}
                                </Badge>
                            </TableTd>
                            <TableTd width={140}>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={
                                            distributorsRoutes.show(
                                                distributor.id,
                                            ).url
                                        }
                                        title="View"
                                        className="text-[#073BBC] transition-colors hover:text-[#0433ac]"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={
                                            distributorsRoutes.edit(
                                                distributor.id,
                                            ).url
                                        }
                                        title="Edit"
                                        className="text-[#073BBC] transition-colors hover:text-[#0433ac]"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        title="Delete"
                                        onClick={() =>
                                            setDistributorToDelete(distributor)
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
                isOpen={distributorToDelete !== null}
                onClose={() => setDistributorToDelete(null)}
                onConfirm={handleDelete}
                title="Delete distributor"
                message={
                    distributorToDelete
                        ? `Are you sure you want to delete "${distributorToDelete.name}"?`
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
    { title: 'Distributors', href: distributorsRoutes.index() },
];

DistributorsIndex.layout = {
    breadcrumbs,
};
