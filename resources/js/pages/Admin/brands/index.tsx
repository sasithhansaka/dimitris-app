import { BrandMark } from "@/components/BrandMark";
import Confirm from "@/components/Models/Confirm";
import MasterTab, { TableBody, TableTd } from "@/components/shared/masterTab";
import { Badge } from "@/components/ui/badge";
import { dashboard } from "@/routes";
import brandsRoutes from "@/routes/brands";
import type { Brand, BreadcrumbItem } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

const tableColumns = [
    { label: "ID", sortField: "id", sortable: false, width: 4 },
    { label: "Name", sortField: "name", sortable: false, width: "18%" },
    {
        label: "Featured",
        sortField: "featured",
        sortable: false,
        width: "18%",
    },
    {
        label: "Distributors",
        sortField: "distributors",
        sortable: false,
        width: "22%",
    },
    { label: "Status", sortField: "status", sortable: false, width: "12%" },
    { label: "Actions", sortField: "actions", sortable: false, width: "15%" },
];

function statusClassName(status: string): string {
    switch (status) {
        case "active":
            return "bg-gray-100 text-[#073BBC]";
        case "inactive":
            return "bg-gray-100 text-black";
        default:
            return "bg-gray-100 text-red-500";
    }
}

export default function BrandsIndex({
    brands,
    filters,
}: {
    brands: {
        data: Brand[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!brandToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(brandsRoutes.destroy(brandToDelete.id).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setBrandToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Brands" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={brandsRoutes.index().url}
                    createLink={{
                        label: "Create Brand",
                        url: brandsRoutes.create().url,
                    }}
                    search={{ placeholder: "Search by name or description..." }}
                    statusFilter={{
                        options: [
                            { label: "All", value: "" },
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                            { label: "Draft", value: "draft" },
                        ],
                    }}
                    links={brands.links}
                >
                    {brands.data.map((brand) => (
                        <TableBody
                            key={brand.id}
                            buttons={
                                <>
                                    <Link
                                        href={brandsRoutes.show(brand.id).url}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        View
                                    </Link>
                                    <Link
                                        href={brandsRoutes.edit(brand.id).url}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setBrandToDelete(brand)}
                                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-red-600 hover:underline"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Delete
                                    </button>
                                </>
                            }
                        >
                            <TableTd width={80}>{brand.id}</TableTd>
                            <TableTd>
                                <div className="flex items-center gap-2">
                                    <BrandMark
                                        name={brand.name}
                                        logo={brand.logo}
                                    />
                                    <span
                                        className="line-clamp-2"
                                        title={brand.name}
                                    >
                                        {brand.name}
                                    </span>
                                </div>
                            </TableTd>
                            <TableTd>
                                {brand.featured ? (
                                    <Badge className="border-transparent text-black bg-gray-100 dark:text-black">
                                        Featured
                                    </Badge>
                                ) : (
                                    "-"
                                )}
                            </TableTd>
                            <TableTd>
                                {brand.distributors &&
                                brand.distributors.length > 0 ? (
                                    <span
                                        className="block truncate"
                                        title={brand.distributors
                                            .map((d) => d.name)
                                            .join(", ")}
                                    >
                                        {brand.distributors[0].name}
                                        {brand.distributors.length > 1 &&
                                            ` +${brand.distributors.length - 1} more`}
                                    </span>
                                ) : (
                                    "-"
                                )}
                            </TableTd>
                            <TableTd>
                                <Badge
                                    className={`capitalize ${statusClassName(brand.status)}`}
                                >
                                    {brand.status}
                                </Badge>
                            </TableTd>
                            <TableTd width={140}>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={brandsRoutes.show(brand.id).url}
                                        title="View"
                                        className="text-[#073BBC] transition-colors hover:text-[#0433ac]"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={brandsRoutes.edit(brand.id).url}
                                        title="Edit"
                                        className="text-[#073BBC] transition-colors hover:text-[#0433ac]"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        title="Delete"
                                        onClick={() => setBrandToDelete(brand)}
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
                isOpen={brandToDelete !== null}
                onClose={() => setBrandToDelete(null)}
                onConfirm={handleDelete}
                title="Delete brand"
                message={
                    brandToDelete
                        ? `Are you sure you want to delete "${brandToDelete.name}"?`
                        : ""
                }
                confirmText="Delete"
                variant="danger"
                isProcessing={isDeleting}
            />
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: dashboard() },
    { title: "Brands", href: brandsRoutes.index() },
];

BrandsIndex.layout = {
    breadcrumbs,
};
