import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { dashboard } from "@/routes";
import articlesRoutes from "@/routes/articles";
import type { Article, BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { Newspaper, X } from "lucide-react";
import { useRef, useState } from "react";

export default function EditArticle({
    article,
    categories,
}: {
    article: Article;
    categories: { id: number; name: string }[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        title: article.title,
        introduction: article.introduction ?? "",
        content: article.content,
        banner: null as File | null,
        keywords: article.keywords ?? "",
        status: article.status,
        read_time: String(article.read_time),
        featured: article.featured,
        article_category_id: String(article.article_category_id),
        _method: "put",
    });

    const [keywordInput, setKeywordInput] = useState("");
    const originalBanner = article.banner ? `/storage/${article.banner}` : null;
    const [bannerPreview, setBannerPreview] = useState<string | null>(
        originalBanner,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const keywordList = data.keywords
        ? data.keywords.split(",").filter((k) => k.trim() !== "")
        : [];

    const addKeyword = () => {
        const value = keywordInput.trim();
        if (!value) {
            return;
        }
        if (keywordList.includes(value)) {
            setKeywordInput("");
            return;
        }
        setData("keywords", [...keywordList, value].join(","));
        setKeywordInput("");
    };

    const removeKeyword = (keyword: string) => {
        setData(
            "keywords",
            keywordList.filter((k) => k !== keyword).join(","),
        );
    };

    const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addKeyword();
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData("banner", file);
        setBannerPreview(file ? URL.createObjectURL(file) : bannerPreview);
    };

    const removeBanner = () => {
        setData("banner", null);
        setBannerPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(articlesRoutes.update(article.id).url, { forceFormData: true });
    };

    return (
        <>
            <Head title="Edit Article" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-sm p-4">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-5 space-y-1">
                        <h1 className="text-xl font-semibold tracking-tight text-foreground">
                            Edit article
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Update the details of this article.
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <Card className="gap-0 border py-0 shadow-none">
                            <CardHeader className="border-b border-border px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <Newspaper className="size-4.5 text-muted-foreground" />
                                    <span className="text-sm font-semibold text-foreground">
                                        Edit article
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8 px-6 py-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="title">
                                            Title{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            autoFocus
                                            placeholder="e.g. Your Next Generation"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="introduction">
                                            Introduction{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <textarea
                                            id="introduction"
                                            rows={3}
                                            placeholder="A short introduction for this article"
                                            value={data.introduction}
                                            onChange={(e) =>
                                                setData(
                                                    "introduction",
                                                    e.target.value,
                                                )
                                            }
                                            className="border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive md:text-sm"
                                        />
                                        <InputError
                                            message={errors.introduction}
                                        />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="content">
                                            Content{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <textarea
                                            id="content"
                                            rows={10}
                                            placeholder="Write the full article content"
                                            value={data.content}
                                            onChange={(e) =>
                                                setData(
                                                    "content",
                                                    e.target.value,
                                                )
                                            }
                                            className="border-input placeholder:text-muted-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive md:text-sm"
                                        />
                                        <InputError message={errors.content} />
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
                                                setData(
                                                    "status",
                                                    value as typeof data.status,
                                                )
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
                                        <Label htmlFor="article_category_id">
                                            Category{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.article_category_id}
                                            onValueChange={(value) =>
                                                setData(
                                                    "article_category_id",
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="article_category_id"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={String(
                                                            category.id,
                                                        )}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={
                                                errors.article_category_id
                                            }
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="read_time">
                                            Read time (minutes){" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="read_time"
                                            type="number"
                                            min={1}
                                            placeholder="e.g. 5"
                                            value={data.read_time}
                                            onChange={(e) =>
                                                setData(
                                                    "read_time",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.read_time}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 pt-7">
                                        <Checkbox
                                            id="featured"
                                            checked={data.featured}
                                            onCheckedChange={(checked) =>
                                                setData(
                                                    "featured",
                                                    checked === true,
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor="featured"
                                            className="font-normal"
                                        >
                                            Featured article
                                        </Label>
                                        <InputError
                                            message={errors.featured}
                                        />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="banner">
                                            Banner{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="banner"
                                            type="file"
                                            accept="image/*"
                                            required={!bannerPreview}
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
                                                    className="absolute -top-2 -right-2 cursor-pointer rounded-full  p-1 text-black bg-gray-100 hover:opacity-90"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                        <InputError message={errors.banner} />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="keywords">
                                            Keywords
                                        </Label>
                                        <Input
                                            id="keywords"
                                            type="text"
                                            placeholder="Type a keyword and press Enter"
                                            value={keywordInput}
                                            onChange={(e) =>
                                                setKeywordInput(
                                                    e.target.value,
                                                )
                                            }
                                            onKeyDown={handleKeywordKeyDown}
                                        />
                                        {keywordList.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {keywordList.map((keyword) => (
                                                    <span
                                                        key={keyword}
                                                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                                                    >
                                                        {keyword}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeKeyword(
                                                                    keyword,
                                                                )
                                                            }
                                                            className="cursor-pointer text-gray-500 hover:text-red-600"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <InputError
                                            message={errors.keywords}
                                        />
                                    </div>
                                </div>
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
                                    Save changes
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
    { title: "Articles", href: articlesRoutes.index() },
    { title: "Edit", href: "#" },
];

EditArticle.layout = {
    breadcrumbs,
};
