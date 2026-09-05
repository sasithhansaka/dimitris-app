import { Footer } from '@/layouts/Footer';
import { Header } from '@/layouts/Header';
import { MobileNav } from '@/layouts/MobileNav';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileNav />
        </div>
    );
}
 