import { Head } from "@inertiajs/react";
import { Container } from "@/components/ui/Container";
import { AccountView } from "@/components/account/AccountView";

export default function AccountPage() {
  return (
    <>
      <Head title="Account" />
      <Container className="max-w-260 pt-9 pb-6 lg:pt-12">
        <header className="mb-10">
          <h1 className="u-display text-[2.1rem] leading-tight text-ink sm:text-[2.6rem]">
            Account
          </h1>
          <p className="mt-3 max-w-[52ch] text-[1.0125rem] leading-relaxed text-ink-2">
            Manage your preferences, favourite brands, and notification settings.
          </p>
        </header>
        <AccountView />
      </Container>
    </>
  );
}
