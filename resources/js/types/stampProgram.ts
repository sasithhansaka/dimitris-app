import type { Product } from "./product";

export type StampProgram = {
    id: number;
    stamp_code: string;
    name: string;
    description: string;
    required_stamps: number;
    image: string;
    featured: boolean;
    start_date: string;
    end_date: string;
    status: "active" | "inactive" | "draft";
    products?: Product[];
    products_count?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
