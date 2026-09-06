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
                    className="absolute inset-0 scale-110 bg-cover lg:bg-contain bg-center"
                    style={{
                        backgroundImage: "url('/coming-soon.png')",
                    }}
                />
            </div>
        </>
    );
}

ComingSoon.layout = [] as ComponentType[];

export default ComingSoon;
