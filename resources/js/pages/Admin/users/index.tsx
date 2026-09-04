import Confirm from "@/components/Models/Confirm";
import MasterTab, { TableBody, TableTd } from "@/components/shared/masterTab";
import { Badge } from "@/components/ui/badge";
import { dashboard } from "@/routes";
import usersRoutes from "@/routes/users";
import type { BreadcrumbItem, User } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { EyeIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

const tableColumns = [
    { label: "ID", sortField: "id", sortable: false, width: 4 },
    { label: "Full Name", sortField: "name", sortable: false, width: "20%" },
    { label: "Email", sortField: "email", sortable: false, width: "25%" },
    { label: "Status", sortField: "status", sortable: false, width: "20%" },
    {
        label: "Registered Date",
        sortField: "registered_date",
        sortable: false,
        width: "20%",
    },
    { label: "Actions", sortField: "actions", sortable: false, width: "20%" },
];

function statusClassName(status: string): string {
    switch (status) {
        case "active":
            return "bg-gray-100 text-[#073BBC]";
        case "suspend":
            return "bg-gray-100 text-black";
        default:
            return "bg-gray-100 text-red-500";
    }
}

function formatDate(date: string): string {
    return date.split("T")[0];
}

export default function UsersIndex({
    users,
    filters,
}: {
    users: {
        data: User[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!userToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(usersRoutes.destroy(userToDelete.id).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setUserToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={usersRoutes.index().url}
                    search={{ placeholder: "Search by name or email..." }}
                    statusFilter={{
                        options: [
                            { label: "All", value: "" },
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                            { label: "Suspend", value: "suspend" },
                        ],
                    }}
                    links={users.links}
                >
                    {users.data.map((user) => (
                        <TableBody
                            key={user.id}
                            buttons={
                                <>
                                    <Link
                                        href={usersRoutes.show(user.id).url}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#007A7A] hover:underline"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        View
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setUserToDelete(user)}
                                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-red-600 hover:underline"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Delete
                                    </button>
                                </>
                            }
                        >
                            <TableTd width={80}>{user.id}</TableTd>
                            <TableTd>{user.name}</TableTd>
                            <TableTd>{user.email}</TableTd>
                            <TableTd>
                                <Badge
                                    className={`capitalize ${statusClassName(user.status)}`}
                                >
                                    {user.status}
                                </Badge>
                            </TableTd>
                            <TableTd>
                                {formatDate(user.registered_date)}
                            </TableTd>
                            <TableTd width={120}>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={usersRoutes.show(user.id).url}
                                        title="View"
                                        className="text-[#073BBC] transition-colors hover:text-[#0433ac]"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        title="Delete"
                                        onClick={() => setUserToDelete(user)}
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
                isOpen={userToDelete !== null}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleDelete}
                title="Delete user"
                message={
                    userToDelete
                        ? `Are you sure you want to delete "${userToDelete.name}"?`
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
    { title: "Users", href: usersRoutes.index() },
];

UsersIndex.layout = {
    breadcrumbs,
};
