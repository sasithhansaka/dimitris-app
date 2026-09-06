import { CreditCard } from "lucide-react";
import { PromoPlate, type PlatePattern } from "@/components/ui/PromoPlate";
import type { Brand } from "@/components/brands/BrandLogo";

export type GiftCard = {
  id: string;
  slug: string;
  title: string;
  description: string;
  valueLabels: string[];
  brand: Brand;
  image: {
    pattern: PlatePattern;
    accent: string;
    tone?: "light" | "dark";
  };
};

export function GiftCardVisual({ giftCard, className = "" }: { giftCard: GiftCard; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-paper-deep ${className}`}>
      <PromoPlate {...giftCard.image} className="size-full" />
      <div className="absolute inset-0 flex items-center justify-center p-5">
        <div className="flex aspect-[1.58/1] w-[82%] max-w-90 flex-col justify-between rounded-lg border border-white/40 bg-surface p-4 shadow-[0_10px_26px_-16px_rgba(20,21,28,0.5)] sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="u-label text-ink-3">Gift card</p>
              <p className="u-display mt-2 text-[1.05rem] leading-tight text-ink sm:text-[1.25rem]">{giftCard.brand.name}</p>
            </div>
            <CreditCard className="size-5 text-brand" aria-hidden="true" />
          </div>
          <p className="text-[0.72rem] font-semibold text-ink-2 sm:text-[0.8rem]">{giftCard.valueLabels.join(" / ")}</p>
        </div>
      </div>
    </div>
  );
}
