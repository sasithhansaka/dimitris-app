import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountView } from "@/components/account/AccountView";

export type AccountUser = {
    name: string;
    email: string;
    country: string | null;
    created_at: string;
};

export type AccountCategory = {
    id: number;
    name: string;
    image: string | null;
    display_order: number;
};

export type AccountBrand = {
    id: number;
    name: string;
    logo: string | null;
};

type Props = {
    user: AccountUser;
    favoriteCategoryCount: number;
    favoriteBrandCount: number;
    categories: AccountCategory[];
    brands: AccountBrand[];
    favoriteCategoryIds: number[];
    favoriteBrandIds: number[];
};

function AccountSkeleton() {
    return (
        <div
            className="space-y-11"
            aria-busy="true"
            aria-label="Loading account"
        >
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="space-y-4 border-t border-rule pt-6">
                <Skeleton className="h-6 w-40" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-23 rounded-md" />
                    ))}
                </div>
            </div>
            <div className="space-y-4 border-t border-rule pt-6">
                <Skeleton className="h-6 w-48" />
                <div className="flex flex-wrap gap-2.5">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-11 w-32 rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function AccountPage({
    user,
    favoriteCategoryCount,
    favoriteBrandCount,
    categories,
    brands,
    favoriteCategoryIds,
    favoriteBrandIds,
}: Props) {
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        const removeStart = router.on("start", (event) => {
            if (event.detail.visit.method === "get") {
                setIsNavigating(true);
            }
        });
        const removeFinish = router.on("finish", () => setIsNavigating(false));

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    return (
        <>
            <Head title="Account" />
            <Container className="max-w-260 pt-9 pb-6 lg:pt-12">
                <header className="mb-10">
                    <h1 className="u-display text-[2.1rem] leading-tight text-ink sm:text-[2.6rem]">
                        Account
                    </h1>
                    <p className="mt-3 max-w-[52ch] text-[1.0125rem] leading-relaxed text-ink-2">
                       Your profile, your preferences and how offers reach you.
                    </p>
                </header>
                {isNavigating ? (
                    <AccountSkeleton />
                ) : (
                    <AccountView
                        user={user}
                        favoriteCategoryCount={favoriteCategoryCount}
                        favoriteBrandCount={favoriteBrandCount}
                        categories={categories}
                        brands={brands}
                        favoriteCategoryIds={favoriteCategoryIds}
                        favoriteBrandIds={favoriteBrandIds}
                    />
                )}
            </Container>
        </>
    );
}
