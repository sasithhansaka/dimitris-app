import type { Distributor } from './distributor';
import type { Product } from './product';

export type Brand = {
    id: number;
    name: string;
    description: string | null;
    logo: string | null;
    status: 'active' | 'inactive' | 'draft';
    distributors?: Distributor[];
    products?: Product[];
    products_count?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
