import { Head } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import { NotificationsView } from "@/components/notifications/NotificationsView";

export default function NotificationsPage() {
    return (
        <>
            <Head title="Notifications" />
            <Container className="max-w-215 pt-9 pb-6 lg:pt-12">
                <header>
                    <h1 className="u-display text-[2.1rem] leading-tight text-ink sm:text-[2.6rem]">
                        Notifications
                    </h1>
                    <p className="mt-3 max-w-[52ch] text-[1.0125rem] leading-relaxed text-ink-2">
                        Updates about your saved coupons, brands, and account
                        activity.
                    </p>
                </header>
                <NotificationsView />
            </Container>
        </>
    );
}
