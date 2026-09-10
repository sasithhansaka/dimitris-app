import Confirm from "@/components/Models/Confirm";
import MasterTab, { TableBody, TableTd } from "@/components/shared/masterTab";
import { Badge } from "@/components/ui/badge";
import { dashboard } from "@/routes";
import faqCategoriesRoutes from "@/routes/faq-categories";
import type { BreadcrumbItem, FaqCategory } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

const tableColumns = [
    { label: "Code", sortField: "faq_code", sortable: false, width: "17%" },
    { label: "Category Name", sortField: "name", sortable: false, width: "17%" },
    { label: "FAQs", sortField: "faqs_count", sortable: false, width: "18%" },
    {
        label: "Display Order",
        sortField: "display_order",
        sortable: false,
        width: "14%",
    },
    { label: "Status", sortField: "status", sortable: false, width: "16%" },
    { label: "Actions", sortField: "actions", sortable: false, width: "18%" },
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

export default function FaqCategoriesIndex({
    categories,
    filters,
}: {
    categories: {
        data: FaqCategory[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    const [categoryToDelete, setCategoryToDelete] =
        useState<FaqCategory | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!categoryToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(faqCategoriesRoutes.destroy(categoryToDelete.id).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setCategoryToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="FAQ Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={faqCategoriesRoutes.index().url}
                    createLink={{
                        label: "Create FAQ Section",
                        url: faqCategoriesRoutes.create().url,
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
                    links={categories.links}
                >
                    {categories.data.map((category) => (
                        <TableBody
                            key={category.id}
                            buttons={
                                <>
                                    <Link
                                        href={
                                            faqCategoriesRoutes.edit(
                                                category.id,
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
                                            setCategoryToDelete(category)
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-red-600 hover:underline"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Delete
                                    </button>
                                </>
                            }
                        >
                            <TableTd>{category.faq_code}</TableTd>
                            <TableTd>
                                <div className="flex items-center gap-3">
                                    {category.banner ? (
                                        <img
                                            src={`/storage/${category.banner}`}
                                            alt={category.name}
                                            className="h-10 w-10 shrink-0 rounded-md border border-border object-cover"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 shrink-0 rounded-md border border-dashed border-border" />
                                    )}
                                    <span>{category.name}</span>
                                </div>
                            </TableTd>
                            <TableTd>{category.faqs_count ?? 0}</TableTd>
                            <TableTd>{category.display_order}</TableTd>
                            <TableTd>
                                <Badge
                                    className={`capitalize ${statusClassName(category.status)}`}
                                >
                                    {category.status}
                                </Badge>
                            </TableTd>
                            <TableTd width={120}>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={
                                            faqCategoriesRoutes.edit(
                                                category.id,
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
                                            setCategoryToDelete(category)
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
                isOpen={categoryToDelete !== null}
                onClose={() => setCategoryToDelete(null)}
                onConfirm={handleDelete}
                title="Delete FAQ category"
                message={
                    categoryToDelete
                        ? `Are you sure you want to delete "${categoryToDelete.name}"? All FAQs in this category will also be deleted.`
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
    { title: "FAQ Categories", href: faqCategoriesRoutes.index() },
];

FaqCategoriesIndex.layout = {
    breadcrumbs,
};
