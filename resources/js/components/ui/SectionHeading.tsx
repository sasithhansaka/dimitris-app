import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The broadsheet's section marker: a hairline rule, then the heading and its
 * action sharing a baseline, then one supporting line. No eyebrow labels — the
 * heading carries itself.
 */
export function SectionHeading({
  title,
  sub,
  actionLabel,
  actionHref,
  className,
  id,
}: {
  title: string;
  sub?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("border-t border-border pt-5", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2
          id={id}
          className="text-[1.6rem] leading-[1.1] font-extrabold tracking-[-0.03em] text-foreground sm:text-[1.9rem]"
        >
          {title}
        </h2>
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {actionLabel}
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>
      {sub && <p className="mt-2 max-w-[62ch] text-[0.95rem] leading-relaxed text-muted-foreground">{sub}</p>}
    </div>
  );
}
