import Confirm from "@/components/Models/Confirm";
import MasterTab, { TableBody, TableTd } from "@/components/shared/masterTab";
import { Badge } from "@/components/ui/badge";
import { dashboard } from "@/routes";
import stampProgramsRoutes from "@/routes/stamp-programs";
import type { BreadcrumbItem, StampProgram } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

const tableColumns = [
    { label: "Code", sortField: "stamp_code", sortable: false, width: "12%" },
    { label: "Program Name", sortField: "name", sortable: false, width: "26%" },
    {
        label: "Required Stamps",
        sortField: "required_stamps",
        sortable: false,
        width: "12%",
    },
    { label: "Start Date", sortField: "start_date", sortable: false, width: "10%" },
    { label: "End Date", sortField: "end_date", sortable: false, width: "10%" },
    { label: "Status", sortField: "status", sortable: false, width: "10%" },
    { label: "Actions", sortField: "actions", sortable: false, width: "12%" },
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
    return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function StampProgramsIndex({
    stampPrograms,
    filters,
}: {
    stampPrograms: {
        data: StampProgram[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    const [programToDelete, setProgramToDelete] =
        useState<StampProgram | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!programToDelete) {
            return;
        }

        setIsDeleting(true);

        router.delete(stampProgramsRoutes.destroy(programToDelete.id).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setProgramToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Stamp Programs" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={stampProgramsRoutes.index().url}
                    createLink={{
                        label: "Create Stamp Program",
                        url: stampProgramsRoutes.create().url,
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
                    links={stampPrograms.links}
                >
                    {stampPrograms.data.map((program) => (
                        <TableBody
                            key={program.id}
                            buttons={
                                <>
                                    <Link
                                        href={
                                            stampProgramsRoutes.edit(
                                                program.id,
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
                                            setProgramToDelete(program)
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-red-600 hover:underline"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Delete
                                    </button>
                                </>
                            }
                        >
                            <TableTd>{program.stamp_code}</TableTd>
                            <TableTd>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`/storage/${program.image}`}
                                        alt={program.name}
                                        className="size-8 shrink-0 rounded-md border border-border object-cover"
                                    />
                                    <span
                                        className="line-clamp-2"
                                        title={program.name}
                                    >
                                        {program.name}
                                    </span>
                                    {program.featured && (
                                        <Badge className="bg-amber-100 text-amber-700">
                                            Featured
                                        </Badge>
                                    )}
                                </div>
                            </TableTd>
                            <TableTd>{program.required_stamps}</TableTd>
                            <TableTd>{formatDate(program.start_date)}</TableTd>
                            <TableTd>{formatDate(program.end_date)}</TableTd>
                            <TableTd>
                                <Badge
                                    className={`capitalize ${statusClassName(program.status)}`}
                                >
                                    {program.status}
                                </Badge>
                            </TableTd>
                            <TableTd width={120}>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={
                                            stampProgramsRoutes.edit(
                                                program.id,
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
                                            setProgramToDelete(program)
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
                isOpen={programToDelete !== null}
                onClose={() => setProgramToDelete(null)}
                onConfirm={handleDelete}
                title="Delete stamp program"
                message={
                    programToDelete
                        ? `Are you sure you want to delete "${programToDelete.name}"?`
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
    { title: "Stamp Programs", href: stampProgramsRoutes.index() },
];

StampProgramsIndex.layout = {
    breadcrumbs,
};
