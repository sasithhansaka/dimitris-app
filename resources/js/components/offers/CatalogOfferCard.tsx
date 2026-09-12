import { ArrowRight, CalendarDays } from "lucide-react";

export type Offer = {
    id: number;
    title: string;
    description: string;
    image: string;
    end_date: string;
    brand: {
        id: number;
        name: string;
        logo: string | null;
    };
};

const DATE_FORMAT = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
});

export function CatalogOfferCard({ offer }: { offer: Offer }) {
    return (
        <article className="u-lift group flex h-full flex-col overflow-hidden rounded-md border border-rule bg-surface">
            <div className="relative aspect-16/10 overflow-hidden items-center justify-center flex bg-white">
                <img
                    src={`/storage/${offer.image}`}
                    alt={offer.title}
                    className="h-4/5 w-4/5 object-contain"
                />
            </div>
            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2">
                    {offer.brand.logo ? (
                        <img
                            src={`/storage/${offer.brand.logo}`}
                            alt=""
                            className="size-5 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <span className="u-display flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-[0.6rem] font-bold text-paper">
                            {offer.brand.name.slice(0, 2).toUpperCase()}
                        </span>
                    )}
                    <span className="u-label truncate text-ink-2">
                        {offer.brand.name}
                    </span>
                    <span className="u-label ml-auto text-ink-3">Offer</span>
                </div>
                <h3 className="mt-3 text-[1.05rem] leading-snug font-semibold tracking-[-0.015em] text-ink">
                    {offer.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[0.82rem] leading-relaxed text-ink-3">
                    {offer.description}
                </p>
                <div className="mt-auto flex items-center justify-between gap-4 border-t border-rule pt-4">
                    <p className="flex items-center gap-1.5 text-[0.76rem] text-ink-3">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        Until {DATE_FORMAT.format(new Date(offer.end_date))}
                    </p>
                    <span className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-[0.82rem] font-semibold text-brand">
                        View offer{" "}
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                </div>
            </div>
        </article>
    );
}
