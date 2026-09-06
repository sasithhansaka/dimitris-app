import { useState } from "react";
import { router } from "@inertiajs/react";
import { Heart, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCouponsSelection } from "./CouponsSelectionContext";

export function CouponActions({
  couponId,
  title,
  reward = "",
  stacked = false,
}: {
  couponId: string;
  title: string;
  reward?: string;
  stacked?: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const shared = useCouponsSelection();
  const [localSelected, setLocalSelected] = useState(false);

  const selected = shared ? shared.isSelected(couponId) : localSelected;

  function claimWithReceipt() {
    if (shared) {
      if (!shared.isSelected(couponId)) {
        shared.toggleSelection({ id: couponId, title, reward });
      }
    } else {
      setLocalSelected(true);
    }
    router.visit("/coupons/receipt-upload");
  }

  return (
    <div
      data-coupon-id={couponId}
      className={cn("grid gap-2", stacked ? "sm:grid-cols-2" : "grid-cols-1")}
    >
      <button
        type="button"
        onClick={claimWithReceipt}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-[0.9rem] font-semibold text-paper transition-colors hover:bg-brand-hover"
      >
        <ReceiptText className="size-4.5" aria-hidden="true" />
        {selected ? "Selected" : "Select"}
      </button>

      <button
        type="button"
        onClick={() => setSaved((value) => !value)}
        aria-pressed={saved}
        aria-label={`${saved ? "Unsave" : "Save"} ${title}`}
        className={cn(
          "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border px-4 py-3 text-[0.9rem] font-semibold transition-colors",
          saved
            ? "border-ink bg-surface text-ink"
            : "border-rule-strong bg-surface text-ink hover:border-ink-3",
        )}
      >
        <Heart className="size-4.5" fill={saved ? "currentColor" : "none"} />
        {saved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
