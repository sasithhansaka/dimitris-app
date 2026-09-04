import Confirm from "@/components/Models/Confirm";
import MasterTab, { TableBody, TableTd } from "@/components/shared/masterTab";
import { Badge } from "@/components/ui/badge";
import { dashboard } from "@/routes";
import articleCategoriesRoutes from "@/routes/article-categories";
import type { ArticleCategory, BreadcrumbItem } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

const tableColumns = [
    { label: "ID", sortField: "id", sortable: false, width: 4 },
    { label: "Category Name", sortField: "name", sortable: false, width: "16%" },
    {
        label: "Description",
        sortField: "description",
        sortable: false,
        width: "30%",
    },
    { label: "Status", sortField: "status", sortable: false, width: "15%" },
    {
        label: "Created Date",
        sortField: "created_at",
        sortable: false,
        width: "15%",
    },
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

function formatDate(date: string): string {
    return date.split("T")[0];
}

function truncateWords(text: string, limit: number): string {
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) {
        return text;
    }
    return `${words.slice(0, limit).join(" ")} ...`;
}

export default function ArticleCategoriesIndex({
    categories,
    filters,
}: {
    categories: {
        data: ArticleCategory[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    const [categoryToDelete, setCategoryToDelete] =
        useState<ArticleCategory | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!categoryToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(
            articleCategoriesRoutes.destroy(categoryToDelete.id).url,
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsDeleting(false);
                    setCategoryToDelete(null);
                },
            },
        );
    };

    return (
        <>
            <Head title="Articles Category" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={articleCategoriesRoutes.index().url}
                    createLink={{
                        label: "Create Category",
                        url: articleCategoriesRoutes.create().url,
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
                                            articleCategoriesRoutes.edit(
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
                            <TableTd width={80}>{category.id}</TableTd>
                            <TableTd>{category.name}</TableTd>
                            <TableTd>
                                <span
                                    className="block truncate"
                                    title={category.description ?? undefined}
                                >
                                    {category.description
                                        ? truncateWords(
                                              category.description,
                                              7,
                                          )
                                        : "-"}
                                </span>
                            </TableTd>
                            <TableTd>
                                <Badge
                                    className={`capitalize ${statusClassName(category.status)}`}
                                >
                                    {category.status}
                                </Badge>
                            </TableTd>
                            <TableTd>
                                {formatDate(category.created_at)}
                            </TableTd>
                            <TableTd width={120}>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={
                                            articleCategoriesRoutes.edit(
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
                title="Delete article category"
                message={
                    categoryToDelete
                        ? `Are you sure you want to delete "${categoryToDelete.name}"?`
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
    { title: "Articles Category", href: articleCategoriesRoutes.index() },
];

ArticleCategoriesIndex.layout = {
    breadcrumbs,
};
