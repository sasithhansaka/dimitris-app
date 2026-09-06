import MasterTab, { TableBody, TableTd } from '@/components/shared/masterTab';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import logsRoutes from '@/routes/logs';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2, type LucideIcon } from 'lucide-react';

type ActivityLog = {
    id: number;
    action: string;
    title: string;
    entity: string | null;
    entity_id: number | null;
    user: { id: number; name: string; email: string } | null;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    details: string | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
};

const tableColumns = [
    { label: 'Action', sortField: 'action', sortable: false, width: '10%' },
    { label: 'Entity', sortField: 'entity', sortable: false, width: '11%' },
    { label: 'Title', sortField: 'title', sortable: false, width: '15%' },
    { label: 'User', sortField: 'user', sortable: false, width: '20%' },
    { label: 'Date', sortField: 'created_at', sortable: false, width: '16%' },
    { label: 'Details', sortField: 'details', sortable: false, width: '25%' },
];

function actionClassName(action: string): string {
    switch (action) {
        case 'CREATE':
            return 'bg-gray-100 text-[#073BBC]';
        case 'DELETE':
            return 'bg-gray-100 text-red-500';
        default:
            return 'bg-gray-100 text-black';
    }
}

const actionIcons: Record<string, LucideIcon> = {
    CREATE: Plus,
    UPDATE: Pencil,
    DELETE: Trash2,
    READ: Eye,
};

function ActionIcon({ action }: { action: string }) {
    const Icon = actionIcons[action] ?? Pencil;

    return <Icon className="h-3.5 w-3.5" />;
}

function formatDateTime(date: string): string {
    return new Date(date).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function LogsIndex({
    logs,
    filters,
}: {
    logs: {
        data: ActivityLog[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: any;
}) {
    return (
        <>
            <Head title="System Logs" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex lg:mt-3 items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-xl font-semibold tracking-tight text-foreground">
                            System Logs
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Track all changes made by administrators and users
                        </p>
                    </div>
                </div>
                <MasterTab
                    tableColumns={tableColumns}
                    filters={filters}
                    url={logsRoutes.index().url}
                    links={logs.links}
                >
                    {logs.data.map((log) => (
                        <TableBody
                            key={log.id}
                            buttons={
                                <div className="flex w-full flex-col gap-2 text-sm">
                                    {log.ip_address && (
                                        <div>
                                            <span className="font-medium text-gray-700">
                                                IP address:
                                            </span>{' '}
                                            <span className="text-gray-600">
                                                {log.ip_address}
                                            </span>
                                        </div>
                                    )}
                                    {log.user_agent && (
                                        <div>
                                            <span className="font-medium text-gray-700">
                                                User agent:
                                            </span>{' '}
                                            <span className="text-gray-600">
                                                {log.user_agent}
                                            </span>
                                        </div>
                                    )}
                                    {log.old_values && (
                                        <div>
                                            <span className="font-medium text-gray-700">
                                                Old values:
                                            </span>
                                            <pre className="mt-1 overflow-x-auto rounded bg-gray-50 p-2 text-xs text-gray-600">
                                                {JSON.stringify(
                                                    log.old_values,
                                                    null,
                                                    2,
                                                )}
                                            </pre>
                                        </div>
                                    )}
                                    {log.new_values && (
                                        <div>
                                            <span className="font-medium text-gray-700">
                                                New values:
                                            </span>
                                            <pre className="mt-1 overflow-x-auto rounded bg-gray-50 p-2 text-xs text-gray-600">
                                                {JSON.stringify(
                                                    log.new_values,
                                                    null,
                                                    2,
                                                )}
                                            </pre>
                                        </div>
                                    )}
                                    {!log.ip_address &&
                                        !log.user_agent &&
                                        !log.old_values &&
                                        !log.new_values && (
                                            <span className="text-gray-400">
                                                No additional details.
                                            </span>
                                        )}
                                </div>
                            }
                        >
                            <TableTd width={100}>
                                <Badge
                                    className={`capitalize ${actionClassName(log.action)}`}
                                >
                                    <ActionIcon action={log.action} />
                                    {log.action.toLowerCase()}
                                </Badge>
                            </TableTd>
                            <TableTd>
                                <span className="capitalize">
                                    {log.entity ?? '—'}
                                </span>
                            </TableTd>
                            <TableTd>{log.title}</TableTd>
                            <TableTd>
                                {log.user ? (
                                    log.user.email
                                ) : (
                                    <span className="text-gray-400">
                                        System
                                    </span>
                                )}
                            </TableTd>
                            <TableTd>{formatDateTime(log.created_at)}</TableTd>
                            <TableTd allowOverflow>
                                <span className="text-gray-600">
                                    {log.details ?? '—'}
                                </span>
                            </TableTd>
                        </TableBody>
                    ))}
                </MasterTab>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'System Logs', href: logsRoutes.index() },
];

LogsIndex.layout = {
    breadcrumbs,
};
