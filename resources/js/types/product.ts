import type { Brand } from "./brand";
import type { ProductCategory } from "./productCategory";
import type { Retailer } from "./retailer";

export type Product = {
    id: number;
    product_code: string;
    brand_id: number;
    category_id: number;
    name: string;
    description: string;
    pack_size: string | null;
    sku: string | null;
    barcode: string | null;
    variant: string | null;
    receipt_aliases: string | null;
    image: string;
    status: "active" | "inactive" | "draft";
    featured: boolean;
    brand?: Brand;
    category?: ProductCategory;
    retailers?: Retailer[];
    retailers_count?: number;
    coupons_count?: number;
    stamp_programs_count?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
