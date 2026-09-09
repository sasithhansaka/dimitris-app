import Confirm from "@/components/Models/Confirm";
import MasterTab, { TableBody, TableTd } from "@/components/shared/masterTab";
import { Badge } from "@/components/ui/badge";
import { dashboard } from "@/routes";
import retailersRoutes from "@/routes/retailers";
import type { BreadcrumbItem, Retailer } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

const tableColumns = [
    {
        label: "Retailer ID",
        sortField: "retailer_code",
        sortable: false,
        width: "12%",
    },
    { label: "Name", sortField: "name", sortable: false, width: "14%" },
    // {
    //     label: "Description",
    //     sortField: "description",
    //     sortable: false,
    //     width: "22%",
    // },
    { label: "Phone", sortField: "phone", sortable: false, width: "14%" },
    {
        label: "Products",
        sortField: "products",
        sortable: false,
        width: "20%",
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

function truncateWords(text: string, limit: number): string {
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) {
        return text;
    }
    return `${words.slice(0, limit).join(" ")} ...`;
}

export default function RetailersIndex({
    retailers,
    filters,
}: {
    retailers: {
        data: Retailer[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    const [retailerToDelete, setRetailerToDelete] = useState<Retailer | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!retailerToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(retailersRoutes.destroy(retailerToDelete.id).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setRetailerToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Retailers" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={retailersRoutes.index().url}
                    createLink={{
                        label: "Create Retailer",
                        url: retailersRoutes.create().url,
                    }}
                    search={{
                        placeholder: "Search by name, description or email...",
                    }}
                    statusFilter={{
                        options: [
                            { label: "All", value: "" },
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                            { label: "Draft", value: "draft" },
                        ],
                    }}
                    links={retailers.links}
                >
                    {retailers.data.map((retailer) => (
                        <TableBody
                            key={retailer.id}
                            buttons={
                                <>
                                    <Link
                                        href={
                                            retailersRoutes.show(retailer.id)
                                                .url
                                        }
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        View
                                    </Link>
                                    <Link
                                        href={
                                            retailersRoutes.edit(retailer.id)
                                                .url
                                        }
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setRetailerToDelete(retailer)
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-red-600 hover:underline"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Delete
                                    </button>
                                </>
                            }
                        >
                            <TableTd width={110}>
                                {retailer.retailer_code}
                            </TableTd>
                            <TableTd>
                                <span
                                    className="line-clamp-2"
                                    title={retailer.name}
                                >
                                    {retailer.name}
                                </span>
                            </TableTd>
                            {/* <TableTd>
                                <span
                                    className="block truncate"
                                    title={retailer.description ?? undefined}
                                >
                                    {retailer.description
                                        ? truncateWords(retailer.description, 6)
                                        : "-"}
                                </span>
                            </TableTd> */}
                            <TableTd>{retailer.phone ?? "-"}</TableTd>
                            <TableTd>
                                {retailer.products &&
                                retailer.products.length > 0 ? (
                                    <span
                                        className="block truncate"
                                        title={retailer.products
                                            .map((p) => p.name)
                                            .join(", ")}
                                    >
                                        {retailer.products[0].name}
                                        {retailer.products.length > 1 &&
                                            ` +${retailer.products.length - 1} more`}
                                    </span>
                                ) : (
                                    "-"
                                )}
                            </TableTd>
                            <TableTd>
                                <Badge
                                    className={`capitalize ${statusClassName(retailer.status)}`}
                                >
                                    {retailer.status}
                                </Badge>
                            </TableTd>
                            <TableTd width={140}>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={
                                            retailersRoutes.show(retailer.id)
                                                .url
                                        }
                                        title="View"
                                        className="text-[#073BBC] transition-colors hover:text-[#0433ac]"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={
                                            retailersRoutes.edit(retailer.id)
                                                .url
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
                                            setRetailerToDelete(retailer)
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
                isOpen={retailerToDelete !== null}
                onClose={() => setRetailerToDelete(null)}
                onConfirm={handleDelete}
                title="Delete retailer"
                message={
                    retailerToDelete
                        ? `Are you sure you want to delete "${retailerToDelete.name}"?`
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
    { title: "Retailers", href: retailersRoutes.index() },
];

RetailersIndex.layout = {
    breadcrumbs,
};
