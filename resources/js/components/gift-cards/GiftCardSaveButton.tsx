import { useState } from "react";
import { Check, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function GiftCardSaveButton({
  giftCardId,
  title,
  className,
}: {
  giftCardId: string;
  title: string;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      data-gift-card-id={giftCardId}
      onClick={() => setSaved((value) => !value)}
      aria-pressed={saved}
      aria-label={`${saved ? "Unsave" : "Save"} ${title} to wallet`}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-[0.88rem] font-semibold transition-colors active:translate-y-px",
        saved
          ? "border border-ink bg-surface text-ink hover:bg-paper-deep"
          : "bg-brand text-paper hover:bg-brand-hover",
        className,
      )}
    >
      {saved ? <Check className="size-4.5" aria-hidden="true" /> : <Heart className="size-4.5" aria-hidden="true" />}
      {saved ? "Saved to Wallet" : "Save to Wallet"}
    </button>
  );
}
