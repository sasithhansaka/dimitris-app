import type { Brand } from './brand';
import type { ProductCategory } from './productCategory';

export type Product = {
    id: number;
    brand_id: number;
    category_id: number;
    name: string;
    description: string | null;
    image: string | null;
    status: 'active' | 'inactive' | 'draft';
    brand?: Brand;
    category?: ProductCategory;
    retailers_count?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
