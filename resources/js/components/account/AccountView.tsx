import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Check, LogOut, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInitials } from "@/hooks/use-initials";
import AccountController from "@/actions/App/Http/Controllers/Public/AccountController";
import { logout } from "@/routes";
import { AccountDetailsDialog } from "./AccountDetailsDialog";
import { VerifyEmailNotice } from "./VerifyEmailNotice";
import type {
    AccountBrand,
    AccountCategory,
    AccountUser,
} from "@/pages/Public/account/page";

type Props = {
    user: AccountUser;
    favoriteCategoryCount: number;
    favoriteBrandCount: number;
    categories: AccountCategory[];
    brands: AccountBrand[];
    favoriteCategoryIds: number[];
    favoriteBrandIds: number[];
    status?: string;
};

function Section({
    id,
    title,
    sub,
    aside,
    children,
}: {
    id?: string;
    title: string;
    sub?: string;
    aside?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-24 border-t border-rule pt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
                <h2 className="u-display text-[1.3rem] text-ink">{title}</h2>
                {aside}
            </div>
            {sub && (
                <p className="mt-1.5 max-w-[62ch] text-[0.9rem] leading-relaxed text-ink-3">
                    {sub}
                </p>
            )}
            <div className="mt-6">{children}</div>
        </section>
    );
}

function formatMemberSince(createdAt: string): string {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return `Member since ${date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    })}`;
}

export function AccountView({
    user,
    favoriteCategoryCount,
    favoriteBrandCount,
    categories,
    brands,
    favoriteCategoryIds,
    favoriteBrandIds,
    status,
}: Props) {
    const getInitials = useInitials();
    const [selectedCategoryIds, setSelectedCategoryIds] =
        useState<number[]>(favoriteCategoryIds);
    const [selectedBrandIds, setSelectedBrandIds] =
        useState<number[]>(favoriteBrandIds);
    const [pendingCategoryIds, setPendingCategoryIds] = useState<Set<number>>(
        new Set(),
    );
    const [pendingBrandIds, setPendingBrandIds] = useState<Set<number>>(
        new Set(),
    );
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    const toggleCategory = (id: number) => {
        if (pendingCategoryIds.has(id)) {
            return;
        }

        setPendingCategoryIds((prev) => new Set(prev).add(id));

        router.post(
            AccountController.toggleCategory.url(id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setSelectedCategoryIds((prev) =>
                        prev.includes(id)
                            ? prev.filter((item) => item !== id)
                            : [...prev, id],
                    );
                },
                onFinish: () => {
                    setPendingCategoryIds((prev) => {
                        const next = new Set(prev);
                        next.delete(id);
                        return next;
                    });
                },
            },
        );
    };

    const toggleBrand = (id: number) => {
        if (pendingBrandIds.has(id)) {
            return;
        }

        setPendingBrandIds((prev) => new Set(prev).add(id));

        router.post(
            AccountController.toggleBrand.url(id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setSelectedBrandIds((prev) =>
                        prev.includes(id)
                            ? prev.filter((item) => item !== id)
                            : [...prev, id],
                    );
                },
                onFinish: () => {
                    setPendingBrandIds((prev) => {
                        const next = new Set(prev);
                        next.delete(id);
                        return next;
                    });
                },
            },
        );
    };

    return (
        <div className="space-y-11">
            {!user.email_verified_at && <VerifyEmailNotice status={status} />}

            <section className="rounded-lg border border-rule bg-surface p-6 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <span
                        className="u-display flex size-16 shrink-0 items-center justify-center rounded-full bg-ink text-[1.25rem] font-bold text-paper"
                        aria-hidden="true"
                    >
                        {getInitials(user.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                        <h2 className="u-display text-[1.4rem] text-ink">
                            {user.name}
                        </h2>
                        <p className="mt-1 truncate text-[0.9375rem] text-ink-2">
                            {user.email}
                        </p>
                    </div>
                    <Link
                        href={logout()}
                        as="button"
                        onClick={() => router.flushAll()}
                        data-test="logout-button"
                        className="inline-flex min-h-9 shrink-0 items-center gap-1.5 self-start rounded-md border border-rule px-3 text-[0.8125rem] font-semibold text-ink-2 transition-colors hover:border-ink-3 hover:text-ink sm:self-center"
                    >
                        <LogOut className="size-3.5" aria-hidden="true" />
                        Log out
                    </Link>
                </div>
                <p className="u-nums mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-rule pt-4 text-[0.875rem] leading-relaxed text-ink-2">
                    <span className="whitespace-nowrap">
                        <span className="font-semibold text-ink">
                            {favoriteCategoryCount}
                        </span>{" "}
                        categories
                    </span>
                    <span className="text-rule-strong" aria-hidden="true">
                        ·
                    </span>
                    <span className="whitespace-nowrap">
                        <span className="font-semibold text-ink">
                            {favoriteBrandCount}
                        </span>{" "}
                        brands followed
                    </span>
                    {user.country && (
                        <>
                            <span
                                className="text-rule-strong"
                                aria-hidden="true"
                            >
                                ·
                            </span>
                            <span className="whitespace-nowrap">
                                {user.country}
                            </span>
                        </>
                    )}
                    <span className="text-rule-strong" aria-hidden="true">
                        ·
                    </span>
                    <span className="whitespace-nowrap text-ink-3">
                        {formatMemberSince(user.created_at)}
                    </span>
                </p>
            </section>

            <section className="rounded-lg border border-rule bg-surface p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="u-display text-[1.3rem] text-ink">
                        Account details{" "}
                    </h2>
                    <button
                        type="button"
                        onClick={() => setDetailsDialogOpen(true)}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-rule px-3 text-[0.8125rem] font-semibold text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
                    >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit
                    </button>
                </div>
                <dl className="mt-5 grid gap-4 border-t border-rule pt-5 sm:grid-cols-2">
                    <div>
                        <dt className="u-label text-ink-3">Name</dt>
                        <dd className="mt-1 text-[0.9375rem] text-ink">
                            {user.name}
                        </dd>
                    </div>
                    <div>
                        <dt className="u-label text-ink-3">Email</dt>
                        <dd className="mt-1 truncate text-[0.9375rem] text-ink">
                            {user.email}
                        </dd>
                    </div>
                    <div>
                        <dt className="u-label text-ink-3">Country</dt>
                        <dd className="mt-1 text-[0.9375rem] text-ink">
                            {user.country ?? "—"}
                        </dd>
                    </div>
                    <div>
                        <dt className="u-label text-ink-3">City</dt>
                        <dd className="mt-1 text-[0.9375rem] text-ink">
                            {user.city ?? "—"}
                        </dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="u-label text-ink-3">Address</dt>
                        <dd className="mt-1 text-[0.9375rem] text-ink">
                            {user.address ?? "—"}
                        </dd>
                    </div>
                    <div>
                        <dt className="u-label text-ink-3">Phone number</dt>
                        <dd className="mt-1 text-[0.9375rem] text-ink">
                            {user.phone_number ?? "—"}
                        </dd>
                    </div>
                    <div>
                        <dt className="u-label text-ink-3">Date of birth</dt>
                        <dd className="mt-1 text-[0.9375rem] text-ink">
                            {user.dob ?? "—"}
                        </dd>
                    </div>
                </dl>
            </section>

            <AccountDetailsDialog
                user={user}
                open={detailsDialogOpen}
                onOpenChange={setDetailsDialogOpen}
            />

            <Section
                id="preferences"
                title="Favourite categories"
                sub="Pick what you care about and we'll prioritise it in your feed."
                aside={
                    <span className="u-nums text-[0.8125rem] font-medium text-ink-3">
                        {selectedCategoryIds.length} selected
                    </span>
                }
            >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {categories.map((category) => {
                        const selected = selectedCategoryIds.includes(
                            category.id,
                        );
                        const pending = pendingCategoryIds.has(category.id);
                        return (
                            <button
                                key={category.id}
                                type="button"
                                aria-pressed={selected}
                                disabled={pending}
                                onClick={() => toggleCategory(category.id)}
                                className={cn(
                                    "group relative flex min-h-23 flex-col items-start justify-between gap-3 rounded-md border p-3.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                                    selected
                                        ? "border-brand bg-brand-tint"
                                        : "border-rule bg-surface hover:border-ink-3",
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex size-8 items-center justify-center overflow-hidden rounded-sm text-[0.7rem] font-semibold transition-colors",
                                        selected
                                            ? "bg-brand text-white"
                                            : "bg-paper-deep text-ink-2",
                                    )}
                                >
                                    {category.image ? (
                                        <img
                                            src={`/storage/${category.image}`}
                                            alt=""
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        category.name.slice(0, 2).toUpperCase()
                                    )}
                                </span>
                                {selected && (
                                    <span
                                        className="absolute top-2.5 right-2.5 flex size-4.5 items-center justify-center rounded-full bg-brand text-white"
                                        aria-hidden="true"
                                    >
                                        <Check
                                            className="size-3"
                                            strokeWidth={3.4}
                                        />
                                    </span>
                                )}
                                <span
                                    className={cn(
                                        "text-[0.875rem] leading-tight font-medium",
                                        selected
                                            ? "text-brand-ink"
                                            : "text-ink",
                                    )}
                                >
                                    {category.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </Section>

            <Section
                title="Favourite brands"
                sub="Brands you follow send their new offers to the top of your feed."
                aside={
                    <span className="u-nums text-[0.8125rem] font-medium text-ink-3">
                        {selectedBrandIds.length} selected
                    </span>
                }
            >
                <div className="flex flex-wrap gap-2.5">
                    {brands.map((brand) => {
                        const selected = selectedBrandIds.includes(brand.id);
                        const pending = pendingBrandIds.has(brand.id);
                        return (
                            <button
                                key={brand.id}
                                type="button"
                                aria-pressed={selected}
                                disabled={pending}
                                onClick={() => toggleBrand(brand.id)}
                                className={cn(
                                    "inline-flex min-h-11 items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                                    selected
                                        ? "border-brand bg-brand-tint"
                                        : "border-rule bg-surface hover:border-ink-3",
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-[0.68rem] font-semibold",
                                        selected
                                            ? "bg-brand text-white"
                                            : "bg-paper-deep text-ink-2",
                                    )}
                                >
                                    {brand.logo ? (
                                        <img
                                            src={`/storage/${brand.logo}`}
                                            alt=""
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        brand.name.slice(0, 2).toUpperCase()
                                    )}
                                </span>
                                <span
                                    className={cn(
                                        "text-[0.875rem] font-medium",
                                        selected
                                            ? "text-brand-ink"
                                            : "text-ink-2",
                                    )}
                                >
                                    {brand.name}
                                </span>
                                {selected && (
                                    <Check
                                        className="size-4 shrink-0 text-brand"
                                        strokeWidth={2.6}
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </Section>
            {/* <Section
                title="Notification settings"
                sub="Choose what you'd like to hear about."
            >
                <ul className="divide-rule divide-y overflow-hidden rounded-lg border border-rule bg-surface">
                    {NOTIF_ROWS.map((row) => (
                        <li
                            key={row.key}
                            className="flex items-center gap-5 px-5 py-4"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="text-[0.9375rem] font-medium text-ink">
                                    {row.label}
                                </p>
                                <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink-3">
                                    {row.sub}
                                </p>
                            </div>
                            <Toggle
                                checked={notifications[row.key]}
                                onChange={() =>
                                    setNotification(
                                        row.key,
                                        !notifications[row.key],
                                    )
                                }
                                label={row.label}
                            />
                        </li>
                    ))}
                </ul>
            </Section> */}
        </div>
    );
}
