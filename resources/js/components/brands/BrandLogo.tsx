import { cn } from "@/lib/utils";

export type Brand = {
  id: string;
  name: string;
  tagline?: string;
  activeOffers?: number;
  logo: {
    monogram: string;
    accent: string;
    ink: string;
  };
};

/**
 * Brand mark. This concept holds no licensed logotypes, so each brand is drawn
 * as a monogram tile in its own colour — consistent at every size, and honest
 * about being a stand-in for a supplied mark.
 */
export function BrandLogo({
  brand,
  size = "md",
  className,
}: {
  brand: Brand;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const scale = {
    xs: "size-6 text-[0.55rem] rounded-[5px]",
    sm: "size-8 text-[0.68rem] rounded-md",
    md: "size-10 text-[0.8rem] rounded-md",
    lg: "size-14 text-[1.05rem] rounded-lg",
    xl: "size-20 text-[1.5rem] rounded-lg",
  }[size];

  return (
    <span
      className={cn(
        "u-display inline-flex shrink-0 items-center justify-center font-extrabold tracking-[0.02em] select-none",
        scale,
        className,
      )}
      style={{ backgroundColor: brand.logo.accent, color: brand.logo.ink }}
      aria-hidden="true"
    >
      {brand.logo.monogram}
    </span>
  );
}
