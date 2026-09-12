import { Form, Head, Link, router } from "@inertiajs/react";
import { ArrowLeftIcon } from "lucide-react";
import { useRef, useState } from "react";
import AppLogoIcon from "@/components/app-logo-icon";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import { RequiredMark } from "@/components/required-mark";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { COUNTRIES } from "@/lib/countries";
import { home, login } from "@/routes";
import { store, validateAccount } from "@/routes/register";

type Props = {
    passwordRules: string;
};

type Step = "account" | "personal";

const ACCOUNT_STEP_FIELDS = [
    "name",
    "email",
    "password",
    "password_confirmation",
] as const;

type AccountStepErrors = Partial<
    Record<(typeof ACCOUNT_STEP_FIELDS)[number], string>
>;

const MIN_REGISTRATION_AGE = 18;

function getMaxDob(): string {
    const today = new Date();
    const maxDob = new Date(
        today.getFullYear() - MIN_REGISTRATION_AGE,
        today.getMonth(),
        today.getDate(),
    );

    return maxDob.toISOString().split("T")[0];
}

export default function Register({ passwordRules }: Props) {
    const [step, setStep] = useState<Step>("account");
    const [country, setCountry] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [termsError, setTermsError] = useState(false);
    const [dobError, setDobError] = useState<string | undefined>(undefined);
    const [accountErrors, setAccountErrors] = useState<AccountStepErrors>({});
    const [checkingAccount, setCheckingAccount] = useState(false);
    const accountStepRef = useRef<HTMLDivElement>(null);

    const goToPersonalStep = () => {
        const container = accountStepRef.current;
        const data: Record<string, FormDataEntryValue> = {};

        if (container) {
            ACCOUNT_STEP_FIELDS.forEach((field) => {
                const input = container.querySelector<HTMLInputElement>(
                    `[name="${field}"]`,
                );

                if (input) {
                    data[field] = input.value;
                }
            });
        }

        setCheckingAccount(true);

        router.post(validateAccount.url(), data, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setAccountErrors({});
                setStep("personal");
            },
            onError: (errors) => {
                setAccountErrors(errors as AccountStepErrors);
            },
            onFinish: () => {
                setCheckingAccount(false);
            },
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="flex flex-col items-center gap-4">
                <div className="relative flex w-full items-center justify-center">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        hidden={step !== "personal"}
                        aria-label="Back"
                        onClick={() => setStep("account")}
                        className="absolute left-0"
                    >
                        <ArrowLeftIcon className="size-4" />
                    </Button>

                    <Link
                        href={home()}
                        className="flex flex-col items-center gap-2 font-medium"
                    >
                        <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                            <AppLogoIcon className="size-9 fill-current text-[var(--foreground)]" />
                        </div>
                        <span className="sr-only">Create an account</span>
                    </Link>

                    <span className="text-muted-foreground absolute right-0 text-sm">
                        {step === "account" ? "1/2" : "2/2"}
                    </span>
                </div>

                <div className="space-y-2 text-center">
                    <h1 className="text-xl font-medium">Create an account</h1>
                    <p className="text-muted-foreground text-center text-sm">
                        Enter your details below to create your account
                    </p>
                </div>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={["password", "password_confirmation"]}
                disableWhileProcessing
                className="flex flex-col gap-6"
                onError={(errors) => {
                    const hasAccountStepError = ACCOUNT_STEP_FIELDS.some(
                        (field) => field in errors,
                    );

                    if (hasAccountStepError) {
                        setStep("account");
                    }
                }}
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div
                                ref={accountStepRef}
                                className="grid gap-8"
                                hidden={step !== "account"}
                                onKeyDown={(event) => {
                                    if (event.key !== "Enter") {
                                        return;
                                    }

                                    // Prevent Enter from natively
                                    // submitting the (shared) <form>,
                                    // which would run step-2 validation
                                    // before the user ever reaches it.
                                    event.preventDefault();

                                    if (!checkingAccount) {
                                        goToPersonalStep();
                                    }
                                }}
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="name">
                                        Name <RequiredMark />
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Full name"
                                        onChange={() =>
                                            setAccountErrors((prev) => ({
                                                ...prev,
                                                name: undefined,
                                            }))
                                        }
                                    />
                                    <InputError
                                        message={
                                            accountErrors.name ?? errors.name
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">
                                        Email address <RequiredMark />
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        onChange={() =>
                                            setAccountErrors((prev) => ({
                                                ...prev,
                                                email: undefined,
                                            }))
                                        }
                                    />
                                    <InputError
                                        message={
                                            accountErrors.email ?? errors.email
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        Password <RequiredMark />
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Password"
                                        passwordrules={passwordRules}
                                        onChange={() =>
                                            setAccountErrors((prev) => ({
                                                ...prev,
                                                password: undefined,
                                            }))
                                        }
                                    />
                                    <InputError
                                        message={
                                            accountErrors.password ??
                                            errors.password
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirm password <RequiredMark />
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirm password"
                                        passwordrules={passwordRules}
                                        onChange={() =>
                                            setAccountErrors((prev) => ({
                                                ...prev,
                                                password_confirmation:
                                                    undefined,
                                            }))
                                        }
                                    />
                                    <InputError
                                        message={
                                            accountErrors.password_confirmation ??
                                            errors.password_confirmation
                                        }
                                    />
                                </div>

                                <Button
                                    type="button"
                                    className="mt-2 w-full"
                                    tabIndex={5}
                                    onClick={goToPersonalStep}
                                    disabled={checkingAccount}
                                >
                                    {checkingAccount && <Spinner />}
                                    Continue
                                </Button>
                            </div>

                            <div
                                className="grid gap-5"
                                hidden={step !== "personal"}
                            >
                                <div className="grid gap-2">
                                    <Label htmlFor="country">
                                        Country <RequiredMark />
                                    </Label>
                                    <Select
                                        value={country}
                                        onValueChange={setCountry}
                                    >
                                        <SelectTrigger
                                            id="country"
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-72">
                                            {COUNTRIES.map((c) => (
                                                <SelectItem key={c} value={c}>
                                                    {c}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <input
                                        type="hidden"
                                        name="country"
                                        value={country}
                                    />
                                    <InputError message={errors.country} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="city">
                                        City <RequiredMark />
                                    </Label>
                                    <Input
                                        id="city"
                                        type="text"
                                        tabIndex={6}
                                        autoComplete="address-level2"
                                        name="city"
                                        placeholder="City"
                                    />
                                    <InputError message={errors.city} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="address">
                                        Address <RequiredMark />
                                    </Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        tabIndex={7}
                                        autoComplete="street-address"
                                        name="address"
                                        placeholder="Address"
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone_number">
                                        Phone number <RequiredMark />
                                    </Label>
                                    <Input
                                        id="phone_number"
                                        type="tel"
                                        inputMode="numeric"
                                        tabIndex={8}
                                        autoComplete="tel"
                                        name="phone_number"
                                        placeholder="Phone number"
                                        onKeyDown={(event) => {
                                            const allowedKeys = [
                                                "Backspace",
                                                "Delete",
                                                "Tab",
                                                "Enter",
                                                "ArrowLeft",
                                                "ArrowRight",
                                                "ArrowUp",
                                                "ArrowDown",
                                                "Home",
                                                "End",
                                            ];

                                            if (
                                                event.ctrlKey ||
                                                event.metaKey ||
                                                allowedKeys.includes(event.key)
                                            ) {
                                                return;
                                            }

                                            if (!/^\d$/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        onPaste={(event) => {
                                            const pasted =
                                                event.clipboardData.getData(
                                                    "text",
                                                );

                                            if (/\D/.test(pasted)) {
                                                event.preventDefault();

                                                const input =
                                                    event.currentTarget;
                                                const digitsOnly =
                                                    pasted.replace(/\D/g, "");

                                                input.value =
                                                    input.value + digitsOnly;
                                            }
                                        }}
                                    />
                                    <InputError message={errors.phone_number} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="dob">
                                        Date of birth <RequiredMark />
                                    </Label>
                                    <Input
                                        id="dob"
                                        type="date"
                                        tabIndex={9}
                                        autoComplete="bday"
                                        name="dob"
                                        max={getMaxDob()}
                                        onChange={(event) => {
                                            const value = event.target.value;

                                            if (!value) {
                                                setDobError(undefined);
                                                return;
                                            }

                                            if (value > getMaxDob()) {
                                                setDobError(
                                                    `You must be at least ${MIN_REGISTRATION_AGE} years old to register.`,
                                                );
                                                return;
                                            }

                                            setDobError(undefined);
                                        }}
                                    />
                                    <InputError
                                        message={dobError ?? errors.dob}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-start gap-2">
                                        <Checkbox
                                            id="terms_and_conditions"
                                            tabIndex={10}
                                            checked={termsAccepted}
                                            aria-invalid={termsError}
                                            onCheckedChange={(checked) => {
                                                setTermsAccepted(
                                                    checked === true,
                                                );
                                                setTermsError(false);
                                            }}
                                        />
                                        <Label
                                            htmlFor="terms_and_conditions"
                                            className="text-muted-foreground font-normal"
                                        >
                                            I agree to the terms and conditions
                                        </Label>
                                    </div>
                                    <input
                                        type="hidden"
                                        name="terms_and_conditions"
                                        value={termsAccepted ? "1" : ""}
                                    />
                                    <InputError
                                        message={errors.terms_and_conditions}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    tabIndex={11}
                                    data-test="register-user-button"
                                    onClick={(event) => {
                                        if (!termsAccepted || dobError) {
                                            event.preventDefault();

                                            if (!termsAccepted) {
                                                setTermsError(true);
                                            }
                                        }
                                    }}
                                >
                                    {processing && <Spinner />}
                                    Create account
                                </Button>
                            </div>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            Already have an account?{" "}
                            <TextLink href={login()} tabIndex={12}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: "Create an account",
    description: "Enter your details below to create your account",
    hideLogo: true,
};
