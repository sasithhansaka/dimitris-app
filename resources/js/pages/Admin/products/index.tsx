import Confirm from '@/components/Models/Confirm';
import MasterTab, { TableBody, TableTd } from '@/components/shared/masterTab';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import productsRoutes from '@/routes/products';
import type { BreadcrumbItem, Product } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

const tableColumns = [
    { label: 'ID', sortField: 'id', sortable: false, width: 4 },
    { label: 'Name', sortField: 'name', sortable: false, width: '22%' },
    { label: 'Brand', sortField: 'brand', sortable: false, width: '18%' },
    { label: 'Category', sortField: 'category', sortable: false, width: '18%' },
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

export default function ProductsIndex({
    products,
    filters,
}: {
    products: {
        data: Product[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    const [productToDelete, setProductToDelete] = useState<Product | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!productToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(productsRoutes.destroy(productToDelete.id).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setProductToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={productsRoutes.index().url}
                    createLink={{
                        label: 'Create Product',
                        url: productsRoutes.create().url,
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
                    links={products.links}
                >
                    {products.data.map((product) => (
                        <TableBody
                            key={product.id}
                            buttons={
                                <>
                                    <Link
                                        href={
                                            productsRoutes.show(product.id).url
                                        }
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        View
                                    </Link>
                                    <Link
                                        href={
                                            productsRoutes.edit(product.id).url
                                        }
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProductToDelete(product)
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-red-600 hover:underline"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Delete
                                    </button>
                                </>
                            }
                        >
                            <TableTd width={80}>{product.id}</TableTd>
                            <TableTd>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`/storage/${product.image}`}
                                        alt={product.name}
                                        className="border-border size-8 shrink-0 rounded-md border object-cover"
                                    />
                                    <span
                                        className="line-clamp-2"
                                        title={product.name}
                                    >
                                        {product.name}
                                    </span>
                                </div>
                            </TableTd>
                            <TableTd>{product.brand?.name ?? '-'}</TableTd>
                            <TableTd>{product.category?.name ?? '-'}</TableTd>
                            <TableTd>
                                <Badge
                                    className={`capitalize ${statusClassName(product.status)}`}
                                >
                                    {product.status}
                                </Badge>
                            </TableTd>
                            <TableTd width={140}>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={
                                            productsRoutes.show(product.id).url
                                        }
                                        title="View"
                                        className="text-[#073BBC] transition-colors hover:text-[#0433ac]"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={
                                            productsRoutes.edit(product.id).url
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
                                            setProductToDelete(product)
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
                isOpen={productToDelete !== null}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleDelete}
                title="Delete product"
                message={
                    productToDelete
                        ? `Are you sure you want to delete "${productToDelete.name}"?`
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
    { title: 'Products', href: productsRoutes.index() },
];

ProductsIndex.layout = {
    breadcrumbs,
};
