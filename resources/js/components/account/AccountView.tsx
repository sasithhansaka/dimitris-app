import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo, type Brand } from "@/components/brands/BrandLogo";
import { CategoryIcon, type Category } from "@/components/categories/CategoryChip";

const CATEGORIES: Category[] = [
  { id: "electronics", slug: "electronics", name: "Electronics", icon: "Smartphone" },
  { id: "fashion", slug: "fashion", name: "Fashion", icon: "Shirt" },
  { id: "grocery", slug: "grocery", name: "Grocery", icon: "ShoppingBasket" },
  { id: "home", slug: "home", name: "Home & Living", icon: "Sofa" },
  { id: "beauty", slug: "beauty", name: "Beauty", icon: "Sparkles" },
];

const BRANDS: Brand[] = [
  { id: "1", name: "Northwind", logo: { monogram: "N", accent: "#2563eb", ink: "#ffffff" } },
  { id: "2", name: "Fresco", logo: { monogram: "F", accent: "#059669", ink: "#ffffff" } },
  { id: "3", name: "Circuit", logo: { monogram: "C", accent: "#d97706", ink: "#ffffff" } },
  { id: "4", name: "Hearth", logo: { monogram: "H", accent: "#7c3aed", ink: "#ffffff" } },
];

const LANGUAGES = [
  { code: "en", label: "English", native: "English", available: true },
  { code: "sq", label: "Albanian", native: "Shqip", available: true },
  { code: "de", label: "German", native: "Deutsch", available: false },
  { code: "fr", label: "French", native: "Français", available: false },
];

type Notifications = {
  recommended: boolean;
  reminders: boolean;
  brandUpdates: boolean;
  weeklyDigest: boolean;
};

const NOTIF_ROWS: { key: keyof Notifications; label: string; sub: string }[] = [
  { key: "recommended", label: "Recommended for you", sub: "New coupons and offers picked for your interests." },
  { key: "reminders", label: "Expiry reminders", sub: "A heads-up before a saved coupon or gift card expires." },
  { key: "brandUpdates", label: "Brand updates", sub: "News from the brands you've marked as favourites." },
  { key: "weeklyDigest", label: "Weekly digest", sub: "A weekly summary of the best new offers." },
];

function Section({
  id,
  title,
  sub,
  aside,
  children,
}: {
  id?: string;
  title: string;
  sub?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-rule pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
        <h2 className="u-display text-[1.3rem] text-ink">{title}</h2>
        {aside}
      </div>
      {sub && <p className="mt-1.5 max-w-[62ch] text-[0.9rem] leading-relaxed text-ink-3">{sub}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200",
        checked ? "bg-brand" : "bg-rule-strong",
      )}
    >
      <span
        className={cn(
          "size-4.5 rounded-full bg-white shadow-[0_1px_2px_rgba(20,21,28,0.3)] transition-transform duration-200",
          checked ? "translate-x-[23px]" : "translate-x-[3px]",
        )}
        aria-hidden="true"
      />
    </button>
  );
}

export function AccountView() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["electronics", "grocery"]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(["1", "3"]);
  const [notifications, setNotifications] = useState<Notifications>({
    recommended: true,
    reminders: true,
    brandUpdates: false,
    weeklyDigest: true,
  });
  const [language, setLanguage] = useState("en");

  const toggleCategory = (id: string) =>
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const toggleBrand = (id: string) =>
    setSelectedBrands((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const setNotification = (key: keyof Notifications, value: boolean) =>
    setNotifications((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-11">
      <section className="rounded-lg border border-rule bg-surface p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span
            className="u-display flex size-16 shrink-0 items-center justify-center rounded-full bg-ink text-[1.25rem] font-bold text-paper"
            aria-hidden="true"
          >
            AM
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="u-display text-[1.4rem] text-ink">Alex Morgan</h2>
            <p className="mt-1 truncate text-[0.9375rem] text-ink-2">alex.morgan@example.com</p>
          </div>
        </div>
        <p className="u-nums mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-rule pt-4 text-[0.875rem] leading-relaxed text-ink-2">
          <span className="whitespace-nowrap">
            <span className="font-semibold text-ink">6</span> saved
          </span>
          <span className="text-rule-strong" aria-hidden="true">
            ·
          </span>
          <span className="whitespace-nowrap">
            <span className="font-semibold text-ink">{selectedBrands.length}</span> brands
          </span>
          <span className="text-rule-strong" aria-hidden="true">
            ·
          </span>
          <span className="whitespace-nowrap">Tirana</span>
          <span className="text-rule-strong" aria-hidden="true">
            ·
          </span>
          <span className="whitespace-nowrap text-ink-3">Member since Jan 2026</span>
        </p>
      </section>

      <Section
        id="preferences"
        title="Preferences"
        sub="Choose the categories you'd like to see more offers from."
        aside={
          <span className="u-nums text-[0.8125rem] font-medium text-ink-3">
            {selectedCategories.length} selected
          </span>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const selected = selectedCategories.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleCategory(c.id)}
                className={cn(
                  "group relative flex min-h-23 flex-col items-start justify-between gap-3 rounded-md border p-3.5 text-left transition-colors",
                  selected ? "border-brand bg-brand-tint" : "border-rule bg-surface hover:border-ink-3",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-sm transition-colors",
                    selected ? "bg-brand text-white" : "bg-paper-deep text-ink-2",
                  )}
                >
                  <CategoryIcon name={c.icon} className="size-4.25" />
                </span>
                {selected && (
                  <span
                    className="absolute top-2.5 right-2.5 flex size-4.5 items-center justify-center rounded-full bg-brand text-white"
                    aria-hidden="true"
                  >
                    <Check className="size-3" strokeWidth={3.4} />
                  </span>
                )}
                <span
                  className={cn(
                    "text-[0.875rem] leading-tight font-medium",
                    selected ? "text-brand-ink" : "text-ink",
                  )}
                >
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section
        title="Favourite brands"
        sub="Get updates and recommendations from the brands you follow."
        aside={
          <span className="u-nums text-[0.8125rem] font-medium text-ink-3">
            {selectedBrands.length} selected
          </span>
        }
      >
        <div className="flex flex-wrap gap-2.5">
          {BRANDS.map((b) => {
            const selected = selectedBrands.includes(b.id);
            return (
              <button
                key={b.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleBrand(b.id)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-1.5 transition-colors",
                  selected ? "border-brand bg-brand-tint" : "border-rule bg-surface hover:border-ink-3",
                )}
              >
                <BrandLogo brand={b} size="sm" className="rounded-full" />
                <span className={cn("text-[0.875rem] font-medium", selected ? "text-brand-ink" : "text-ink-2")}>
                  {b.name}
                </span>
                {selected && <Check className="size-4 shrink-0 text-brand" strokeWidth={2.6} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Notification settings" sub="Choose what you'd like to hear about.">
        <ul className="divide-rule divide-y overflow-hidden rounded-lg border border-rule bg-surface">
          {NOTIF_ROWS.map((row) => (
            <li key={row.key} className="flex items-center gap-5 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] font-medium text-ink">{row.label}</p>
                <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink-3">{row.sub}</p>
              </div>
              <Toggle
                checked={notifications[row.key]}
                onChange={() => setNotification(row.key, !notifications[row.key])}
                label={row.label}
              />
            </li>
          ))}
        </ul>
      </Section>

      {/* <Section title="Language" sub="Choose your preferred language.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LANGUAGES.map((l) => {
            const selected = language === l.code;
            return (
              <button
                key={l.code}
                type="button"
                aria-pressed={selected}
                disabled={!l.available}
                onClick={() => setLanguage(l.code)}
                className={cn(
                  "flex min-h-18.5 flex-col items-start justify-center gap-1 rounded-md border px-4 py-3 text-left transition-colors",
                  selected ? "border-brand bg-brand-tint" : "border-rule bg-surface hover:border-ink-3",
                  !l.available && "cursor-not-allowed opacity-60 hover:border-rule",
                )}
              >
                <span className={cn("text-[0.9375rem] font-semibold", selected ? "text-brand-ink" : "text-ink")}>
                  {l.label}
                </span>
                <span className="text-[0.8125rem] text-ink-3">
                  {l.available ? l.native : `${l.native} — Coming soon`}
                </span>
              </button>
            );
          })}
        </div>
      </Section> */}
    </div>
  );
}
