import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { dashboard } from "@/routes";
import faqCategoriesRoutes from "@/routes/faq-categories";
import type { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { HelpCircle, Plus, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";

type FaqRow = {
    id: number | null;
    question: string;
    answer: string;
};

export default function CreateFaqCategory({
    nextFaqCode,
    nextDisplayOrder,
}: {
    nextFaqCode: string;
    nextDisplayOrder: number;
}) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        banner: null as File | null,
        display_order: String(nextDisplayOrder),
        status: "active",
        faqs: [{ id: null, question: "", answer: "" }] as FaqRow[],
    });

    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData("banner", file);
        setBannerPreview(file ? URL.createObjectURL(file) : null);
    };

    const removeBanner = () => {
        setData("banner", null);
        setBannerPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const addFaqRow = () => {
        setData("faqs", [
            ...data.faqs,
            { id: null, question: "", answer: "" },
        ]);
    };

    const removeFaqRow = (index: number) => {
        setData(
            "faqs",
            data.faqs.filter((_, i) => i !== index),
        );
    };

    const updateFaqRow = (
        index: number,
        field: "question" | "answer",
        value: string,
    ) => {
        setData(
            "faqs",
            data.faqs.map((row, i) =>
                i === index ? { ...row, [field]: value } : row,
            ),
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(faqCategoriesRoutes.store().url, { forceFormData: true });
    };

    return (
        <>
            <Head title="Create FAQ Category" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-5 space-y-1">
                        <h1 className="text-xl font-semibold tracking-tight text-foreground">
                            Create FAQ category
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Add a new category and its questions & answers.
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <Card className="mb-6 gap-0 border py-0 shadow-none">
                            <CardHeader className="border-b border-border px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="size-4.5 text-muted-foreground" />
                                    <span className="text-sm font-semibold text-foreground">
                                        New FAQ category
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8 px-6 py-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="faq_code">
                                            FAQ Code
                                        </Label>
                                        <Input
                                            id="faq_code"
                                            type="text"
                                            value={nextFaqCode}
                                            disabled
                                            readOnly
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Automatically assigned when the
                                            category is created.
                                        </p>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Category Name{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            autoFocus
                                            placeholder="e.g. Shipping & Delivery"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="status">
                                            Status{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.status}
                                            onValueChange={(value) =>
                                                setData("status", value)
                                            }
                                        >
                                            <SelectTrigger
                                                id="status"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">
                                                    Active
                                                </SelectItem>
                                                <SelectItem value="inactive">
                                                    Inactive
                                                </SelectItem>
                                                <SelectItem value="draft">
                                                    Draft
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="display_order">
                                            Display Order{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="display_order"
                                            type="number"
                                            min={1}
                                            placeholder="e.g. 1"
                                            value={data.display_order}
                                            onChange={(e) =>
                                                setData(
                                                    "display_order",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.display_order}
                                        />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            placeholder="A short description of this category"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            className="border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive md:text-sm"
                                        />
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="banner">Banner</Label>
                                        <Input
                                            id="banner"
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleBannerChange}
                                        />
                                        {bannerPreview && (
                                            <div className="relative mt-2 w-fit">
                                                <img
                                                    src={bannerPreview}
                                                    alt="Banner preview"
                                                    className="h-40 w-40 rounded-md border border-border object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeBanner}
                                                    title="Remove banner"
                                                    className="absolute -top-2 -right-2 cursor-pointer rounded-full bg-gray-100 p-1 text-black hover:opacity-90"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                        <InputError message={errors.banner} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="gap-0 border py-0 shadow-none">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="size-4.5 text-muted-foreground" />
                                    <span className="text-sm font-semibold text-foreground">
                                        Questions & Answers
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addFaqRow}
                                    className="cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add question
                                </Button>
                            </CardHeader>

                            <CardContent className="space-y-6 px-6 py-6">
                                {data.faqs.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        No questions added yet. Click "Add
                                        question" to create one.
                                    </p>
                                )}

                                {data.faqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="rounded-md border border-border p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-sm font-medium text-foreground">
                                                Question {index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFaqRow(index)
                                                }
                                                title="Remove question"
                                                className="cursor-pointer text-red-400 transition-colors hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="grid gap-3">
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor={`faqs.${index}.question`}
                                                >
                                                    Question{" "}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    id={`faqs.${index}.question`}
                                                    type="text"
                                                    placeholder="e.g. How long does delivery take?"
                                                    value={faq.question}
                                                    onChange={(e) =>
                                                        updateFaqRow(
                                                            index,
                                                            "question",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        (errors as any)[
                                                            `faqs.${index}.question`
                                                        ]
                                                    }
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor={`faqs.${index}.answer`}
                                                >
                                                    Answer{" "}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </Label>
                                                <textarea
                                                    id={`faqs.${index}.answer`}
                                                    rows={3}
                                                    placeholder="Write the answer to this question"
                                                    value={faq.answer}
                                                    onChange={(e) =>
                                                        updateFaqRow(
                                                            index,
                                                            "answer",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive md:text-sm"
                                                />
                                                <InputError
                                                    message={
                                                        (errors as any)[
                                                            `faqs.${index}.answer`
                                                        ]
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>

                            <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-border bg-muted/30 px-6 py-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    disabled={processing}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer"
                                >
                                    {processing && <Spinner />}
                                    Create category
                                </Button>
                            </div>
                        </Card>
                    </form>
                </div>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: dashboard() },
    { title: "FAQ Categories", href: faqCategoriesRoutes.index() },
    { title: "Create", href: faqCategoriesRoutes.create() },
];

CreateFaqCategory.layout = {
    breadcrumbs,
};
