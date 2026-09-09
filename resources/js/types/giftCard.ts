import type { Brand } from "./brand";

export type GiftCard = {
    id: number;
    gift_code: string;
    brand_id: number;
    name: string;
    description: string;
    amount: string;
    currency: string;
    image: string | null;
    status: "active" | "inactive" | "draft";
    brand?: Brand;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
