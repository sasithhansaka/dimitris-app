import type { Product } from './product';

export type Retailer = {
    id: number;
    name: string;
    description: string | null;
    logo: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    country: string;
    status: 'active' | 'inactive' | 'draft';
    products?: Product[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
