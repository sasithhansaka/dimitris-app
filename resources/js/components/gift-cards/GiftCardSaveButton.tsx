import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Check, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { login } from "@/routes";
import GiftCardController from "@/actions/App/Http/Controllers/Public/GiftCardController";

export function GiftCardSaveButton({
    giftCardId,
    title,
    initialSaved = false,
    className,
}: {
    giftCardId: number;
    title: string;
    initialSaved?: boolean;
    className?: string;
}) {
    const { auth } = usePage().props;
    const [saved, setSaved] = useState(initialSaved);
    const [pending, setPending] = useState(false);

    if (!auth.user) {
        return (
            <Link
                href={login()}
                data-gift-card-id={giftCardId}
                aria-label={`Log in to save ${title} to wallet`}
                className={cn(
                    "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-brand px-5 text-[0.88rem] font-semibold text-paper transition-colors hover:bg-brand-hover active:translate-y-px",
                    className,
                )}
            >
                <Heart className="size-4.5" aria-hidden="true" />
                Save to Wallet
            </Link>
        );
    }

    const toggle = () => {
        if (pending) {
            return;
        }

        setPending(true);

        router.post(
            GiftCardController.toggle.url(giftCardId),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                except: [
                    "featuredProducts",
                    "featuredOffers",
                    "featuredGiftCards",
                    "featuredArticles",
                    "featuredBrands",
                    "giftCards",
                    "offers",
                ],
                onSuccess: () => setSaved((value) => !value),
                onFinish: () => setPending(false),
            },
        );
    };

    return (
        <button
            type="button"
            data-gift-card-id={giftCardId}
            onClick={toggle}
            disabled={pending}
            aria-pressed={saved}
            aria-label={`${saved ? "Unsave" : "Save"} ${title} to wallet`}
            className={cn(
                "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-[0.88rem] font-semibold transition-colors active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
                saved
                    ? "border border-ink bg-surface text-ink hover:bg-paper-deep"
                    : "bg-brand text-paper hover:bg-brand-hover",
                className,
            )}
        >
            {saved ? (
                // <Check className="size-4.5" aria-hidden="true" />
                <div></div>
            ) : (
                <Heart className="size-4.5" aria-hidden="true" />
            )}
            {saved ? "Saved to Wallet" : "Save to Wallet"}
        </button>
    );
}
