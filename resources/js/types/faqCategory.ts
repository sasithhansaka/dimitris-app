import type { Faq } from "./faq";

export type FaqCategory = {
    id: number;
    faq_code: string;
    name: string;
    slug: string;
    description: string | null;
    banner: string | null;
    display_order: number;
    status: "active" | "inactive" | "draft";
    faqs?: Faq[];
    faqs_count?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
