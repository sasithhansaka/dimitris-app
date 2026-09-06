import { Head, usePage } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import { WalletView } from "@/components/wallet/WalletView";

type TabKey = "saved" | "rewards" | "activity";
const VALID: TabKey[] = ["saved", "rewards", "activity"];

export default function WalletPage() {
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1] ?? "");
  const raw = params.get("tab");
  const initialTab = VALID.includes(raw as TabKey) ? (raw as TabKey) : "saved";

  return (
    <>
      <Head title="Wallet" />
      <Container className="pt-9 pb-6 lg:pt-12">
        <header>
          <h1 className="u-display text-[2.1rem] leading-tight text-ink sm:text-[2.6rem]">
            Wallet
          </h1>
          <p className="mt-3 max-w-[52ch] text-[1.0125rem] leading-relaxed text-ink-2">
            Everything you've saved, earned, and submitted in one place.
          </p>
        </header>
        <WalletView initialTab={initialTab} />
      </Container>
    </>
  );
}
