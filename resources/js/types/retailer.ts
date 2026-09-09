import type { Product } from "./product";

export type Retailer = {
    id: number;
    retailer_code: string;
    name: string;
    description: string | null;
    logo: string | null;
    website: string | null;
    primary_contact: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    country: string;
    status: "active" | "inactive" | "draft";
    products?: Product[];
    coupons_count?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
