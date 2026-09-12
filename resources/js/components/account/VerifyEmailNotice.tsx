import { Form } from "@inertiajs/react";
import { MailWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { send } from "@/routes/verification";

export function VerifyEmailNotice({ status }: { status?: string }) {
    return (
        <div className="flex flex-col gap-3 rounded-lg border border-urgent/30 bg-urgent-tint p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
                <MailWarning
                    className="mt-0.5 size-5 shrink-0 text-urgent-ink"
                    aria-hidden="true"
                />
                <div>
                    <p className="text-[0.9rem] font-medium text-urgent-ink">
                        Please verify your email address
                    </p>
                    <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-2">
                        {status === "verification-link-sent"
                            ? "A new verification link has been sent to your email address."
                            : "Check your inbox for a verification link, or resend it below."}
                    </p>
                </div>
            </div>

            <Form {...send.form()} className="shrink-0">
                {({ processing }) => (
                    <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        disabled={processing}
                        className="border-urgent/40 text-urgent-ink hover:bg-urgent/10"
                    >
                        {processing && <Spinner />}
                        Resend verification email
                    </Button>
                )}
            </Form>
        </div>
    );
}
