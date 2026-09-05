import { Head, Link, usePage } from "@inertiajs/react";
import { dashboard, login } from "@/routes";
/* @chisel-registration */
import { register } from "@/routes";
/* @end-chisel-registration */

export default function Home() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Home" />
            <div className="flex flex-col items-center gap-4 p-6 text-sm lg:p-8">
                {auth.user ? (
                    <Link
                        href={dashboard()}
                        className="inline-block rounded-sm border border-rule px-5 py-1.5 text-sm leading-normal text-ink hover:bg-paper-deep"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            href={login()}
                            className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-ink hover:border-rule"
                        >
                            Log in
                        </Link>
                        {/* @chisel-registration */}
                        <Link
                            href={register()}
                            className="inline-block rounded-sm border border-rule px-5 py-1.5 text-sm leading-normal text-ink hover:bg-paper-deep"
                        >
                            Register
                        </Link>
                        {/* @end-chisel-registration */}
                    </div>
                )}
            </div>
        </>
    );
}
