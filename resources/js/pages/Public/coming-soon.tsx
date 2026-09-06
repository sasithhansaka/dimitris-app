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
                    className="absolute inset-0 scale-110 bg-cover bg-center blur-sm"
                    style={{
                        backgroundImage: "url('/coming-soon.png')",
                    }}
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-black/45"
                />
                <div className="relative max-w-md space-y-3">
                    <Wordmark
                        size="lg"
                        className="mx-auto justify-center text-white"
                    />
                    <h1 className="u-display text-3xl text-white sm:text-4xl">
                        We're launching soon
                    </h1>
                    <p className="text-base text-white/80">
                        Kuponi.al is putting the finishing touches on something
                        great.come back later.
                    </p>
                </div>
            </div>
        </>
    );
}

ComingSoon.layout = [] as ComponentType[];

export default ComingSoon;
