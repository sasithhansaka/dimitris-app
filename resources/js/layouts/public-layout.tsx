import { Footer } from '@/layouts/Footer';
import { Header } from '@/layouts/Header';
import { MobileNav } from '@/layouts/MobileNav';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="perks flex min-h-screen flex-col bg-paper text-ink">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-paper"
            >
                Skip to content
            </a>
            <Header />
            <main id="main" className="flex-1">
                {children}
            </main>
            <Footer />
            <MobileNav />
        </div>
    );
}
