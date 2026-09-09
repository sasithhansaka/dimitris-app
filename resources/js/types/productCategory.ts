import type { Product } from "./product";

export type ProductCategory = {
    id: number;
    category_code: string;
    name: string;
    description: string | null;
    status: "active" | "inactive" | "draft";
    products?: Product[];
    products_count?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
