import type { Brand } from './brand';
import type { ProductCategory } from './productCategory';
import type { Retailer } from './retailer';

export type Product = {
    id: number;
    brand_id: number;
    category_id: number;
    name: string;
    description: string;
    image: string;
    status: 'active' | 'inactive' | 'draft';
    featured: boolean;
    brand?: Brand;
    category?: ProductCategory;
    retailers?: Retailer[];
    retailers_count?: number;
    coupons_count?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
