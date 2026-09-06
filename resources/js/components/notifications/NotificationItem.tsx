import { Link } from "@inertiajs/react";
import { BellRing, Gift, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo, type Brand } from "@/components/brands/BrandLogo";

export type AppNotification = {
  id: string;
  kind: "brand" | "expiry" | "match" | "digest";
  title: string;
  body: string;
  href: string;
  timestamp: string;
  brand?: Brand;
};

const SYSTEM_ICON = { expiry: BellRing, match: Sparkles, digest: Gift } as const;

function relativeTime(timestamp: string) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en", { day: "numeric", month: "short" });
}

export function NotificationItem({
  notification,
  read,
  onToggleRead,
}: {
  notification: AppNotification;
  read: boolean;
  onToggleRead: () => void;
}) {
  const Icon = notification.kind !== "brand" ? (SYSTEM_ICON[notification.kind] ?? Sparkles) : undefined;

  return (
    <li
      className={cn(
        "group relative flex gap-4 px-4 py-4 transition-colors sm:px-5",
        read ? "bg-transparent" : "bg-brand-tint/45",
      )}
    >
      <span className="relative shrink-0">
        {notification.brand ? (
          <BrandLogo brand={notification.brand} size="md" className={cn(read && "opacity-70")} />
        ) : (
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-md bg-ink text-paper",
              read && "bg-ink-3",
            )}
            aria-hidden="true"
          >
            {Icon && <Icon className="size-4.5" strokeWidth={1.9} />}
          </span>
        )}
        {!read && (
          <span
            className="absolute -top-1 -right-1 size-2.5 rounded-full bg-brand ring-2 ring-paper"
            aria-hidden="true"
          />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <Link href={notification.href} className="block rounded-sm">
          <h3
            className={cn(
              "text-[0.9375rem] leading-snug",
              read ? "font-medium text-ink-2" : "font-semibold text-ink",
            )}
          >
            {notification.title}
          </h3>
          <p className="mt-1 max-w-[68ch] text-[0.875rem] leading-relaxed text-ink-3">
            {notification.body}
          </p>
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <time dateTime={notification.timestamp} className="u-nums text-[0.75rem] font-medium text-ink-3">
            {relativeTime(notification.timestamp)}
          </time>
          <button
            type="button"
            onClick={onToggleRead}
            className="rounded-sm text-[0.75rem] font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100 hover:text-brand-hover focus-visible:opacity-100 max-lg:opacity-100"
          >
            {read ? "Mark unread" : "Mark read"}
          </button>
        </div>
      </div>

      {!read && <span className="sr-only">Unread</span>}
    </li>
  );
}
