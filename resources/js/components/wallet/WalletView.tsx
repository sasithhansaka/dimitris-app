import { Link } from "@inertiajs/react";
import type { LucideIcon } from "lucide-react";
import { Clock3, Gift, Heart, ReceiptText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BrandLogo, type Brand } from "@/components/brands/BrandLogo";
import { GiftCardVisual, type GiftCard } from "@/components/gift-cards/GiftCardVisual";

type Tab = "saved" | "rewards" | "activity";
const TABS: { id: Tab; label: string }[] = [
  { id: "saved", label: "Saved" },
  { id: "rewards", label: "Rewards" },
  { id: "activity", label: "Activity" },
];

const NORTHWIND: Brand = { id: "1", name: "Northwind", logo: { monogram: "N", accent: "#2563eb", ink: "#ffffff" } };
const FRESCO: Brand = { id: "2", name: "Fresco", logo: { monogram: "F", accent: "#059669", ink: "#ffffff" } };
const CIRCUIT: Brand = { id: "3", name: "Circuit", logo: { monogram: "C", accent: "#d97706", ink: "#ffffff" } };

type SavedCoupon = { id: string; slug: string; title: string; reward: string; brand: Brand };
type WalletReward = { id: string; title: string; value: string; brand?: Brand };
type ReceiptSubmission = { id: string; couponCount: number; submittedAt: string; status: "approved" | "in-review" };

const SAVED_COUPONS: SavedCoupon[] = [
  { id: "1", slug: "20-off-first-order", title: "20% off your first order storewide", reward: "20% OFF", brand: NORTHWIND },
  { id: "2", slug: "5-cashback-electronics", title: "5% cashback on electronics purchases", reward: "5% BACK", brand: CIRCUIT },
];

const SAVED_GIFT_CARDS: GiftCard[] = [
  {
    id: "1",
    slug: "fresco-gift-card",
    title: "Fresco gift card",
    description: "Perfect for groceries, gifting, or weekly essentials.",
    valueLabels: ["$20", "$40", "$75"],
    brand: FRESCO,
    image: { pattern: "field", accent: "#059669" },
  },
];

const WALLET_REWARDS: WalletReward[] = [
  { id: "1", title: "Storewide seasonal sale reward", value: "$8.40", brand: NORTHWIND },
  { id: "2", title: "Electronics cashback reward", value: "$12.00", brand: CIRCUIT },
];

const RECEIPT_SUBMISSIONS: ReceiptSubmission[] = [
  { id: "1", couponCount: 2, submittedAt: "2026-08-28T14:30:00", status: "approved" },
  { id: "2", couponCount: 1, submittedAt: "2026-09-02T09:15:00", status: "in-review" },
];

export function WalletView({ initialTab }: { initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [savedCoupons, setSavedCoupons] = useState(SAVED_COUPONS);
  const [savedGiftCards, setSavedGiftCards] = useState(SAVED_GIFT_CARDS);

  return (
    <>
      <div className="mt-8 flex gap-1 border-b border-rule" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "relative min-h-12 px-4 text-[0.88rem] font-semibold",
              tab === item.id ? "text-ink" : "text-ink-3 hover:text-ink",
            )}
          >
            <span>{item.label}</span>
            {tab === item.id && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-brand" />}
          </button>
        ))}
      </div>

      <div className="pt-7">
        {tab === "saved" &&
          (savedCoupons.length || savedGiftCards.length ? (
            <div className="space-y-10">
              {savedCoupons.length > 0 && (
                <section aria-labelledby="saved-coupons-heading">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 id="saved-coupons-heading" className="u-display text-[1.45rem]">
                      Saved coupons
                    </h2>
                    <p className="u-nums text-[0.8rem] text-ink-3">{savedCoupons.length}</p>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {savedCoupons.map((coupon) => (
                      <article key={coupon.id} className="rounded-lg border border-rule bg-surface p-5">
                        <div className="flex items-center gap-3">
                          <BrandLogo brand={coupon.brand} size="sm" />
                          <div className="min-w-0">
                            <p className="u-label text-ink-3">Saved coupon</p>
                            <p className="mt-1 truncate font-semibold text-ink">{coupon.title}</p>
                          </div>
                        </div>
                        <p className="u-value mt-4 text-[1.45rem] text-ink">{coupon.reward}</p>
                        <p className="mt-2 text-[0.8rem] leading-relaxed text-ink-3">
                          Remembered only. It has not been claimed or registered.
                        </p>
                        <div className="mt-5 flex gap-2 border-t border-rule pt-4">
                          <Link
                            href={`/coupons/${coupon.slug}`}
                            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-brand px-3 text-[0.82rem] font-semibold text-paper"
                          >
                            View coupon
                          </Link>
                          <button
                            type="button"
                            onClick={() => setSavedCoupons((prev) => prev.filter((item) => item.id !== coupon.id))}
                            aria-label={`Remove ${coupon.title} from Saved`}
                            className="flex size-11 items-center justify-center rounded-md border border-rule text-ink-3 hover:text-ink"
                          >
                            <Heart className="size-4" fill="currentColor" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {savedGiftCards.length > 0 && (
                <section aria-labelledby="saved-gift-cards-heading">
                  <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-5">
                    <h2 id="saved-gift-cards-heading" className="u-display text-[1.45rem]">
                      Saved gift cards
                    </h2>
                    <p className="u-nums text-[0.8rem] text-ink-3">{savedGiftCards.length}</p>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {savedGiftCards.map((giftCard) => (
                      <article key={giftCard.id} className="overflow-hidden rounded-lg border border-rule bg-surface">
                        <GiftCardVisual giftCard={giftCard} className="aspect-16/10" />
                        <div className="p-5">
                          <p className="u-label text-ink-3">Saved gift card</p>
                          <h3 className="mt-2 font-semibold text-ink">{giftCard.title}</h3>
                          <p className="mt-1 text-[0.8rem] text-ink-3">Saved for later. It has not been purchased.</p>
                          <div className="mt-5 flex gap-2 border-t border-rule pt-4">
                            <Link
                              href={`/gift-cards/${giftCard.slug}`}
                              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-brand px-3 text-[0.82rem] font-semibold text-paper"
                            >
                              View gift card
                            </Link>
                            <button
                              type="button"
                              onClick={() =>
                                setSavedGiftCards((prev) => prev.filter((item) => item.id !== giftCard.id))
                              }
                              aria-label={`Remove ${giftCard.title} from Saved`}
                              className="flex size-11 items-center justify-center rounded-md border border-rule text-ink-3 hover:text-ink"
                            >
                              <Heart className="size-4" fill="currentColor" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <Empty
              icon={Heart}
              title="Nothing saved for later"
              body="Save a coupon or gift card when you want to remember it."
              href="/gift-cards"
              action="Browse gift cards"
            />
          ))}

        {tab === "rewards" &&
          (WALLET_REWARDS.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {WALLET_REWARDS.map((reward) => (
                <article key={reward.id} className="rounded-lg border border-rule bg-surface p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-md bg-save-tint text-save-ink">
                      <Gift className="size-5" />
                    </span>
                    <span className="u-label text-save-ink">Received reward</span>
                  </div>
                  <p className="u-value mt-5 text-[1.65rem] text-ink">{reward.value}</p>
                  <p className="mt-2 text-[0.88rem] font-semibold text-ink">{reward.title}</p>
                  {reward.brand && <p className="mt-1 text-[0.78rem] text-ink-3">{reward.brand.name}</p>}
                  <p className="mt-4 border-t border-rule pt-3 text-[0.77rem] text-ink-3">
                    Added after receipt approval
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <Empty
              icon={Gift}
              title="No rewards received yet"
              body="Approved receipt benefits appear here, separate from anything saved for later."
              href="/coupons"
              action="Select a coupon"
            />
          ))}

        {tab === "activity" &&
          (RECEIPT_SUBMISSIONS.length ? (
            <div className="divide-rule divide-y border-y border-rule">
              {RECEIPT_SUBMISSIONS.map((submission) => (
                <div key={submission.id} className="flex items-center gap-4 py-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-paper-deep text-ink-2">
                    <ReceiptText className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.88rem] font-semibold text-ink">
                      Receipt for {submission.couponCount} coupon{submission.couponCount === 1 ? "" : "s"}
                    </p>
                    <p className="mt-1 text-[0.77rem] text-ink-3">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "u-label shrink-0",
                      submission.status === "approved" ? "text-save-ink" : "text-brand-ink",
                    )}
                  >
                    {submission.status.replace("-", " ")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              icon={Clock3}
              title="No receipt activity yet"
              body="Submitted and approved receipt states will be listed here."
              href="/coupons"
              action="Browse coupons"
            />
          ))}
      </div>
    </>
  );
}

function Empty({
  icon: Icon,
  title,
  body,
  href,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
  action: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-rule-strong bg-surface px-6 py-14 text-center">
      <Icon className="mx-auto size-9 text-ink-3" />
      <h2 className="u-display mt-5 text-[1.4rem]">{title}</h2>
      <p className="mx-auto mt-2 max-w-[48ch] text-[0.86rem] leading-relaxed text-ink-3">{body}</p>
      <Link href={href} className="mt-6 inline-flex min-h-11 items-center rounded-md bg-brand px-5 text-[0.84rem] font-semibold text-paper">
        {action}
      </Link>
    </div>
  );
}
