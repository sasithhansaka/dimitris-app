import type { Distributor } from "./distributor";
import type { Offer } from "./offer";
import type { Product } from "./product";

export type Brand = {
    id: number;
    brand_code: string;
    name: string;
    description: string | null;
    logo: string | null;
    website: string | null;
    status: "active" | "inactive" | "draft";
    featured: boolean;
    distributors?: Distributor[];
    products?: Product[];
    products_count?: number;
    offers?: Offer[];
    offers_count?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
