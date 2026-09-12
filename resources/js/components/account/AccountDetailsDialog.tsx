import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequiredMark } from "@/components/required-mark";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { COUNTRIES } from "@/lib/countries";
import AccountController from "@/actions/App/Http/Controllers/Public/AccountController";
import type { AccountUser } from "@/pages/Public/account/page";

type Props = {
    user: AccountUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function AccountDetailsDialog({ user, open, onOpenChange }: Props) {
    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm({
            name: user.name,
            country: user.country ?? "",
            city: user.city ?? "",
            address: user.address ?? "",
            phone_number: user.phone_number ?? "",
            dob: user.dob ?? "",
        });

    const [country, setCountry] = useState(user.country ?? "");

    useEffect(() => {
        if (open) {
            setData({
                name: user.name,
                country: user.country ?? "",
                city: user.city ?? "",
                address: user.address ?? "",
                phone_number: user.phone_number ?? "",
                dob: user.dob ?? "",
            });
            setCountry(user.country ?? "");
            clearErrors();
        }
    }, [open]);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        put(AccountController.updateDetails.url(), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    const cancel = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-xl">
                <DialogHeader className="border-b border-rule px-6 py-5">
                    <DialogTitle>Edit account details</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={submit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
                        <div className="grid gap-2">
                            <Label htmlFor="details_name">
                                Name <RequiredMark />
                            </Label>
                            <Input
                                id="details_name"
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={user.email}
                                disabled
                                readOnly
                            />
                            <p className="text-muted-foreground text-xs">
                                Your email address cannot be changed.
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="details_country">
                                Country <RequiredMark />
                            </Label>
                            <Select
                                value={country}
                                onValueChange={(value) => {
                                    setCountry(value);
                                    setData("country", value);
                                }}
                            >
                                <SelectTrigger
                                    id="details_country"
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
                            <InputError message={errors.country} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="details_city">
                                City <RequiredMark />
                            </Label>
                            <Input
                                id="details_city"
                                type="text"
                                value={data.city}
                                onChange={(e) =>
                                    setData("city", e.target.value)
                                }
                            />
                            <InputError message={errors.city} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="details_address">
                                Address <RequiredMark />
                            </Label>
                            <Input
                                id="details_address"
                                type="text"
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                            />
                            <InputError message={errors.address} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="details_phone_number">
                                Phone number <RequiredMark />
                            </Label>
                            <Input
                                id="details_phone_number"
                                type="tel"
                                inputMode="numeric"
                                value={data.phone_number}
                                onChange={(e) => {
                                    const digitsOnly = e.target.value.replace(
                                        /\D/g,
                                        "",
                                    );
                                    setData("phone_number", digitsOnly);
                                }}
                            />
                            <InputError message={errors.phone_number} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="details_dob">
                                Date of birth <RequiredMark />
                            </Label>
                            <Input
                                id="details_dob"
                                type="date"
                                value={data.dob}
                                onChange={(e) => setData("dob", e.target.value)}
                            />
                            <InputError message={errors.dob} />
                        </div>
                    </div>

                    <DialogFooter className="shrink-0 border-t border-rule px-6 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={cancel}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
