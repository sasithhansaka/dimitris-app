import Confirm from "@/components/Models/Confirm";
import MasterTab, { TableBody, TableTd } from "@/components/shared/masterTab";
import { Badge } from "@/components/ui/badge";
import { dashboard } from "@/routes";
import articlesRoutes from "@/routes/articles";
import type { Article, BreadcrumbItem } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

const tableColumns = [
    { label: "ID", sortField: "id", sortable: false, width: 4 },
    { label: "Title", sortField: "title", sortable: false, width: "20%" },
    {
        label: "Introduction",
        sortField: "introduction",
        sortable: false,
        width: "28%",
    },
    { label: "Status", sortField: "status", sortable: false, width: "12%" },
    {
        label: "Category",
        sortField: "category",
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

function truncateWords(text: string, limit: number): string {
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) {
        return text;
    }
    return `${words.slice(0, limit).join(" ")} ...`;
}

export default function ArticlesIndex({
    articles,
    filters,
}: {
    articles: {
        data: Article[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    const [articleToDelete, setArticleToDelete] = useState<Article | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!articleToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(articlesRoutes.destroy(articleToDelete.id).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setArticleToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Articles" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={articlesRoutes.index().url}
                    createLink={{
                        label: "Create Article",
                        url: articlesRoutes.create().url,
                    }}
                    search={{ placeholder: "Search by title or introduction..." }}
                    statusFilter={{
                        options: [
                            { label: "All", value: "" },
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                            { label: "Draft", value: "draft" },
                        ],
                    }}
                    links={articles.links}
                >
                    {articles.data.map((article) => (
                        <TableBody
                            key={article.id}
                            buttons={
                                <>
                                    <Link
                                        href={
                                            articlesRoutes.edit(article.id)
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
                                            setArticleToDelete(article)
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-red-600 hover:underline"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Delete
                                    </button>
                                </>
                            }
                        >
                            <TableTd width={80}>{article.id}</TableTd>
                            <TableTd>
                                <span
                                    className="line-clamp-2"
                                    title={article.title}
                                >
                                    {article.title}
                                </span>
                            </TableTd>
                            <TableTd>
                                <span
                                    className="block truncate"
                                    title={article.introduction ?? undefined}
                                >
                                    {article.introduction
                                        ? truncateWords(
                                              article.introduction,
                                              6,
                                          )
                                        : "-"}
                                </span>
                            </TableTd>
                            <TableTd>
                                <Badge
                                    className={`capitalize ${statusClassName(article.status)}`}
                                >
                                    {article.status}
                                </Badge>
                            </TableTd>
                            <TableTd>{article.category?.name ?? "-"}</TableTd>
                            <TableTd width={120}>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={
                                            articlesRoutes.edit(article.id)
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
                                            setArticleToDelete(article)
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
                isOpen={articleToDelete !== null}
                onClose={() => setArticleToDelete(null)}
                onConfirm={handleDelete}
                title="Delete article"
                message={
                    articleToDelete
                        ? `Are you sure you want to delete "${articleToDelete.title}"?`
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
    { title: "Articles", href: articlesRoutes.index() },
];

ArticlesIndex.layout = {
    breadcrumbs,
};
