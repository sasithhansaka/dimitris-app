import Confirm from "@/components/Models/Confirm";
import MasterTab, { TableBody, TableTd } from "@/components/shared/masterTab";
import { Badge } from "@/components/ui/badge";
import { currencySymbol } from "@/lib/currencies";
import { dashboard } from "@/routes";
import giftCardsRoutes from "@/routes/gift-cards";
import type { BreadcrumbItem, GiftCard } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { EyeIcon, Gift, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

const tableColumns = [
    {
        label: "Gift ID",
        sortField: "gift_code",
        sortable: false,
        width: "12%",
    },
    { label: "Name", sortField: "name", sortable: false, width: "20%" },
    { label: "Brand", sortField: "brand", sortable: false, width: "16%" },
    { label: "Amount", sortField: "amount", sortable: false, width: "20%" },
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

function formatAmounts(amount: string, currency: string): string {
    const symbol = currencySymbol(currency);
    const values = amount
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

    return values.map((value) => `${symbol}${value}`).join(", ");
}

export default function GiftCardsIndex({
    giftCards,
    filters,
}: {
    giftCards: {
        data: GiftCard[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    const [giftCardToDelete, setGiftCardToDelete] = useState<GiftCard | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!giftCardToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(giftCardsRoutes.destroy(giftCardToDelete.id).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setGiftCardToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Gift Cards" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={giftCardsRoutes.index().url}
                    createLink={{
                        label: "Create Gift Card",
                        url: giftCardsRoutes.create().url,
                    }}
                    search={{ placeholder: "Search by gift ID or name..." }}
                    statusFilter={{
                        options: [
                            { label: "All", value: "" },
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                            { label: "Draft", value: "draft" },
                        ],
                    }}
                    links={giftCards.links}
                >
                    {giftCards.data.map((giftCard) => (
                        <TableBody
                            key={giftCard.id}
                            buttons={
                                <>
                                    <Link
                                        href={
                                            giftCardsRoutes.show(giftCard.id)
                                                .url
                                        }
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#073BBC] hover:underline"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        View
                                    </Link>
                                    <Link
                                        href={
                                            giftCardsRoutes.edit(giftCard.id)
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
                                            setGiftCardToDelete(giftCard)
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-red-600 hover:underline"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Delete
                                    </button>
                                </>
                            }
                        >
                            <TableTd width={110}>{giftCard.gift_code}</TableTd>
                            <TableTd>
                                <div className="flex items-center gap-2">
                                    {giftCard.image ? (
                                        <img
                                            src={`/storage/${giftCard.image}`}
                                            alt={giftCard.name}
                                            className="border-border size-8 shrink-0 rounded-md border object-cover"
                                        />
                                    ) : (
                                        <div className="border-border bg-muted flex size-8 shrink-0 items-center justify-center rounded-md border">
                                            <Gift className="text-muted-foreground size-4" />
                                        </div>
                                    )}
                                    <span
                                        className="line-clamp-2"
                                        title={giftCard.name}
                                    >
                                        {giftCard.name}
                                    </span>
                                </div>
                            </TableTd>
                            <TableTd>{giftCard.brand?.name ?? "-"}</TableTd>
                            <TableTd>
                                <span
                                    className="block truncate"
                                    title={formatAmounts(
                                        giftCard.amount,
                                        giftCard.currency,
                                    )}
                                >
                                    {formatAmounts(
                                        giftCard.amount,
                                        giftCard.currency,
                                    )}
                                </span>
                            </TableTd>
                            <TableTd>
                                <Badge
                                    className={`capitalize ${statusClassName(giftCard.status)}`}
                                >
                                    {giftCard.status}
                                </Badge>
                            </TableTd>
                            <TableTd width={140}>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={
                                            giftCardsRoutes.show(giftCard.id)
                                                .url
                                        }
                                        title="View"
                                        className="text-[#073BBC] transition-colors hover:text-[#0433ac]"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={
                                            giftCardsRoutes.edit(giftCard.id)
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
                                            setGiftCardToDelete(giftCard)
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
                isOpen={giftCardToDelete !== null}
                onClose={() => setGiftCardToDelete(null)}
                onConfirm={handleDelete}
                title="Delete gift card"
                message={
                    giftCardToDelete
                        ? `Are you sure you want to delete "${giftCardToDelete.name}"?`
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
    { title: "Gift Cards", href: giftCardsRoutes.index() },
];

GiftCardsIndex.layout = {
    breadcrumbs,
};
