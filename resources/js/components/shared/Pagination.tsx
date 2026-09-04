import { Link } from "@inertiajs/react";
import classNames from "classnames";

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

const PageLink = ({
    active,
    label,
    url,
}: {
    active: boolean;
    label: string;
    url: string | null;
}) => {
    const className = classNames(
        [
            "relative inline-flex items-center px-4 py-2 text-sm font-medium border transition-colors duration-200 rounded mr-1 mb-1",
            "focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
        ],
        {
            // Active state - highlighted with your theme color
            "z-10 bg-gradient-to-r from-black to-black text-white border-[#007A7A] shadow-lg": active,
            // Inactive state - subtle hover effects
            "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-black hover:text-black": !active,
        }
    );

    return url ? (
        <Link className={className} href={url}>
            <span dangerouslySetInnerHTML={{ __html: label }}></span>
        </Link>
    ) : (
        <span className={className}>
            <span dangerouslySetInnerHTML={{ __html: label }}></span>
        </span>
    );
};

// Previous, if on first page
// Next, if on last page
// and dots, if exists (...)
const PageInactive = ({ label }: { label: string }) => {
    const className = classNames(
        "relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 cursor-not-allowed rounded mr-1 mb-1"
    );

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: label }}
        />
    );
};

export default function Pagination({ links = [] }: PaginationProps) {
    // Don't render if there's only 1 page (previous, 1, next)
    if (links.length === 3) return null;

    return (
        <nav className="isolate inline-flex -space-x-px rounded-md " aria-label="Pagination">
            {links.map(({ active, label, url }, index) => {
                const isFirst = index === 0;
                const isLast = index === links.length - 1;

                const baseClasses = classNames({
                    "rounded-l-md": isFirst,
                    "rounded-r-md": isLast,
                });

                return url === null ? (
                    <div key={label} className={baseClasses}>
                        <PageInactive label={label} />
                    </div>
                ) : (
                    <div key={label} className={baseClasses}>
                        <PageLink
                            label={label}
                            active={active}
                            url={url}
                        />
                    </div>
                );
            })}
        </nav>
    );
}
