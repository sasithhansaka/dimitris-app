/**
 * Brand mark. This concept holds no licensed logotypes, so each brand is drawn
 * as a monogram tile in its own colour — consistent at every size, and honest
 * about being a stand-in for a supplied mark.
 */

const AVATAR_COLORS = [
    'bg-rose-100 text-rose-700',
    'bg-amber-100 text-amber-700',
    'bg-emerald-100 text-emerald-700',
    'bg-sky-100 text-sky-700',
    'bg-violet-100 text-violet-700',
];

function avatarColor(name: string): string {
    const code = name.charCodeAt(0) || 0;
    return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

export function BrandMark({
    name,
    logo,
    className = 'size-8 text-sm',
}: {
    name: string;
    logo: string | null;
    className?: string;
}) {
    if (logo) {
        return (
            <img
                src={`/storage/${logo}`}
                alt={name}
                className={`border-border shrink-0 rounded-md border object-cover ${className}`}
            />
        );
    }

    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-md font-semibold ${avatarColor(name)} ${className}`}
        >
            {name.slice(0, 2).toUpperCase()}
        </div>
    );
}
