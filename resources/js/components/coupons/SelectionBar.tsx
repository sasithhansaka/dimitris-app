import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ChevronDown, ChevronUp, ReceiptText, X } from "lucide-react";
import { useCouponsSelection } from "./CouponsSelectionContext";

export function SelectionBar() {
  const shared = useCouponsSelection();
  const [reviewing, setReviewing] = useState(false);

  if (!shared || shared.selected.length === 0) return null;
  const { selected, toggleSelection, clearSelection } = shared;

  return (
    <aside className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+58px)] z-40 border-t border-rule-strong bg-paper shadow-[0_-12px_30px_-24px_rgba(20,21,28,0.45)] lg:bottom-0">
      {reviewing && (
        <div className="mx-auto max-h-[38vh] w-full max-w-shell overflow-y-auto border-b border-rule px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[0.85rem] font-semibold text-ink">Selected coupons</p>
            <button
              type="button"
              onClick={clearSelection}
              className="text-[0.78rem] font-medium text-ink-3 underline hover:text-ink"
            >
              Clear all
            </button>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {selected.map((coupon) => (
              <li key={coupon.id} className="flex items-center gap-3 rounded-md border border-rule bg-surface px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.82rem] font-semibold text-ink">{coupon.title}</p>
                  <p className="mt-0.5 text-[0.75rem] text-ink-3">{coupon.reward}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSelection(coupon)}
                  aria-label={`Remove ${coupon.title} from selection`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-md text-ink-3 hover:bg-paper-deep hover:text-ink"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mx-auto flex min-h-18 w-full max-w-shell items-center gap-3 px-5 py-2.5 sm:px-8 lg:px-10">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-tint text-brand">
            <ReceiptText className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="u-nums text-[0.9rem] font-semibold text-ink">
              {selected.length} {selected.length === 1 ? "coupon" : "coupons"} selected
            </p>
            <p className="hidden text-[0.76rem] text-ink-3 sm:block">Ready for one receipt upload</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setReviewing((value) => !value)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-rule-strong px-3 py-2 text-[0.82rem] font-semibold text-ink hover:border-ink-3"
        >
          <span className="hidden sm:inline">Review</span>
          <span className="sm:hidden">View</span>
          {reviewing ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
        </button>
        <Link
          href="/coupons/receipt-upload"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand px-4 py-2 text-[0.82rem] font-semibold text-paper hover:bg-brand-hover sm:px-5"
        >
          <span className="hidden sm:inline">
            {selected.length === 1 ? "Continue to receipt" : "Upload one receipt"}
          </span>
          <span className="sm:hidden">Continue</span>
        </Link>
      </div>
    </aside>
  );
}
