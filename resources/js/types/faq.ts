export type Faq = {
    id: number;
    faq_category_id: number;
    question: string;
    answer: string;
    display_order: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
