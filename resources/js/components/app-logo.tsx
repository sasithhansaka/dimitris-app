import { usePage } from "@inertiajs/react";

import AppLogoIcon from "@/components/app-logo-icon";

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <div className="flex w-full flex-col items-center gap-1.5 py-1">
            <div className="text-sidebar-primary-foreground flex aspect-square size-12 items-center justify-center rounded-md group-data-[collapsible=icon]:size-8">
                <AppLogoIcon className="size-10 fill-current group-data-[collapsible=icon]:size-6" />
            </div>
            <span className="truncate text-center text-sm leading-tight font-semibold group-data-[collapsible=icon]:hidden">
                administration
            </span>
        </div>
    );
}
