import { Head } from "@inertiajs/react";
import type { ComponentType } from "react";
import { Wordmark } from "@/components/ui/Wordmark";

function ComingSoon() {
    return (
        <>
            <Head title="Coming soon" />
            <div className="perks relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden bg-paper px-6 text-center text-white">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 scale-110 bg-cover bg-center md:hidden"
                    style={{
                        backgroundImage: "url('/coming_soon_mobile_sc.png')",
                    }}
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 hidden scale-110 bg-cover bg-center md:block lg:hidden"
                    style={{
                        backgroundImage: "url('/coming_soon_tab.png')",
                    }}
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 hidden scale-110 bg-contain bg-center lg:block"
                    style={{
                        backgroundImage: "url('/coming_soon_desktop.png')",
                    }}
                />
            </div>
        </>
    );
}

ComingSoon.layout = [] as ComponentType[];

export default ComingSoon;
