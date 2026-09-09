import Confirm from "@/components/Models/Confirm";
import MasterTab, { TableBody, TableTd } from "@/components/shared/masterTab";
import { Badge } from "@/components/ui/badge";
import { dashboard } from "@/routes";
import productCategoriesRoutes from "@/routes/product-categories";
import type { BreadcrumbItem, ProductCategory } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

const tableColumns = [
    {
        label: "Category ID",
        sortField: "category_code",
        sortable: false,
        width: "12%",
    },
    { label: "Name", sortField: "name", sortable: false, width: "22%" },
    {
        label: "Description",
        sortField: "description",
        sortable: false,
        width: "40%",
    },
    { label: "Status", sortField: "status", sortable: false, width: "15%" },
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

export default function ProductCategoriesIndex({
    productCategories,
    filters,
}: {
    productCategories: {
        data: ProductCategory[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    const [productCategoryToDelete, setProductCategoryToDelete] =
        useState<ProductCategory | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!productCategoryToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(
            productCategoriesRoutes.destroy(productCategoryToDelete.id).url,
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsDeleting(false);
                    setProductCategoryToDelete(null);
                },
            },
        );
    };

    return (
        <>
            <Head title="Product Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={productCategoriesRoutes.index().url}
                    createLink={{
                        label: "Create Product Category",
                        url: productCategoriesRoutes.create().url,
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
                    links={productCategories.links}
                >
                    {productCategories.data.map((productCategory) => (
                        <TableBody
                            key={productCategory.id}
                            buttons={
                                <>
                                    <Link
                                        href={
                                            productCategoriesRoutes.show(
                                                productCategory.id,
                                            ).url
                                        }
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        View
                                    </Link>
                                    <Link
                                        href={
                                            productCategoriesRoutes.edit(
                                                productCategory.id,
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
                                            setProductCategoryToDelete(
                                                productCategory,
                                            )
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
                                {productCategory.category_code}
                            </TableTd>
                            <TableTd>
                                <span
                                    className="line-clamp-2"
                                    title={productCategory.name}
                                >
                                    {productCategory.name}
                                </span>
                            </TableTd>
                            <TableTd>
                                <span
                                    className="block truncate"
                                    title={
                                        productCategory.description ?? undefined
                                    }
                                >
                                    {productCategory.description
                                        ? truncateWords(
                                              productCategory.description,
                                              6,
                                          )
                                        : "-"}
                                </span>
                            </TableTd>
                            <TableTd>
                                <Badge
                                    className={`capitalize ${statusClassName(productCategory.status)}`}
                                >
                                    {productCategory.status}
                                </Badge>
                            </TableTd>
                            <TableTd width={140}>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={
                                            productCategoriesRoutes.show(
                                                productCategory.id,
                                            ).url
                                        }
                                        title="View"
                                        className="text-[#073BBC] transition-colors hover:text-[#0433ac]"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={
                                            productCategoriesRoutes.edit(
                                                productCategory.id,
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
                                            setProductCategoryToDelete(
                                                productCategory,
                                            )
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
                isOpen={productCategoryToDelete !== null}
                onClose={() => setProductCategoryToDelete(null)}
                onConfirm={handleDelete}
                title="Delete product category"
                message={
                    productCategoryToDelete
                        ? `Are you sure you want to delete "${productCategoryToDelete.name}"?`
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
    { title: "Product Categories", href: productCategoriesRoutes.index() },
];

ProductCategoriesIndex.layout = {
    breadcrumbs,
};
