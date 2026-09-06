import { Link } from "@inertiajs/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
    icon: Icon,
    title,
    body,
    actionLabel,
    actionHref,
    onAction,
    className,
}: {
    icon: LucideIcon;
    title: string;
    body: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    className?: string;
}) {
    const action = actionLabel && (
        <span className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-brand px-5 py-2.5 text-[0.9375rem] font-semibold text-paper transition-colors hover:bg-brand-hover">
            {actionLabel}
        </span>
    );

    return (
        <div
            className={cn(
                "flex flex-col items-center rounded-lg border border-dashed border-rule-strong bg-surface/60 px-6 py-14 text-center",
                className,
            )}
        >
            <span className="flex size-12 items-center justify-center rounded-full bg-paper-deep text-ink-3">
                <Icon
                    className="size-5.5"
                    strokeWidth={1.7}
                    aria-hidden="true"
                />
            </span>
            <h3 className="u-display mt-5 text-[1.15rem] text-ink">{title}</h3>
            <p className="mt-2 max-w-[42ch] text-[0.9rem] leading-relaxed text-ink-3">
                {body}
            </p>
            {actionHref && action && <Link href={actionHref}>{action}</Link>}
            {onAction && actionLabel && !actionHref && (
                <button type="button" onClick={onAction}>
                    {action}
                </button>
            )}
        </div>
    );
}
