import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dashboard } from '@/routes';
import usersRoutes from '@/routes/users';
import type { BreadcrumbItem, User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, Mail, ShieldCheck, UserRound } from 'lucide-react';

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid gap-1.5">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {label}
            </span>
            <span className="text-sm text-foreground">{value}</span>
        </div>
    );
}

function StatusBadge({ status }: { status: User['status'] }) {
    if (status === 'active') {
        return (
            <Badge className="border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                Active
            </Badge>
        );
    }

    if (status === 'suspend') {
        return (
            <Badge className="border-transparent bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400">
                Suspended
            </Badge>
        );
    }

    return (
        <Badge className="border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
            Inactive
        </Badge>
    );
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function UsersShow({ user }: { user: User }) {
    return (
        <>
            <Head title={`User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl lg:px-2 lg:mt-3">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-xl font-semibold tracking-tight text-foreground">
                                User details
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                View this user's account information and
                                access.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" asChild className='h-10 text-[#000000] hover:text-[#000000]/80'>
                            <Link href={usersRoutes.index().url}>
                                {/* <ArrowLeftIcon className="size-4" /> */}
                                Back to Users
                            </Link>
                        </Button>
                    </div>

                    <Card className="gap-0 border py-0 shadow-none">
                        <CardHeader className="border-b border-border px-6 py-5">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <UserRound className="size-4.5 text-muted-foreground" />
                                    <span className="text-sm font-semibold text-foreground">
                                        {user.name}
                                    </span>
                                </div>
                                <StatusBadge status={user.status} />
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-8 px-6 py-6">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <InfoRow label="Full name" value={user.name} />
                                <InfoRow
                                    label="Email address"
                                    value={
                                        <span className="inline-flex items-center gap-1.5">
                                            <Mail className="size-3.5 text-muted-foreground" />
                                            {user.email}
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label="Role"
                                    value={
                                        <span className="inline-flex items-center gap-1.5 capitalize">
                                            <ShieldCheck className="size-3.5 text-muted-foreground" />
                                            {user.role.replace('_', ' ')}
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label="Registered date"
                                    value={formatDate(user.registered_date)}
                                />
                            </div>

                            <Separator />

                           <p>other details will be here , with the developments the details will be added</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Users', href: usersRoutes.index() },
    { title: 'View User', href: '#' },
];

UsersShow.layout = {
    breadcrumbs,
};
