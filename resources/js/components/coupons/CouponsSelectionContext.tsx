import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type SelectedCoupon = { id: string; title: string; reward: string };

type CouponsSelectionContextValue = {
  selected: SelectedCoupon[];
  isSelected: (couponId: string) => boolean;
  toggleSelection: (coupon: SelectedCoupon) => void;
  clearSelection: () => void;
};

const CouponsSelectionContext = createContext<CouponsSelectionContextValue | null>(null);

export function CouponsSelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedCoupon[]>([]);

  const value = useMemo<CouponsSelectionContextValue>(
    () => ({
      selected,
      isSelected: (couponId) => selected.some((item) => item.id === couponId),
      toggleSelection: (coupon) =>
        setSelected((prev) =>
          prev.some((item) => item.id === coupon.id)
            ? prev.filter((item) => item.id !== coupon.id)
            : [...prev, coupon],
        ),
      clearSelection: () => setSelected([]),
    }),
    [selected],
  );

  return <CouponsSelectionContext.Provider value={value}>{children}</CouponsSelectionContext.Provider>;
}

/**
 * Returns null outside a CouponsSelectionProvider (e.g. a CouponCard rendered
 * standalone on the homepage) so callers can fall back to local-only state.
 */
export function useCouponsSelection() {
  return useContext(CouponsSelectionContext);
}
