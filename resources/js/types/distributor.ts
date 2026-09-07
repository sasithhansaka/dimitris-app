import type { Brand } from './brand';

export type Distributor = {
    id: number;
    name: string;
    country: string;
    description: string | null;
    logo: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    status: 'active' | 'inactive' | 'draft';
    brands_count?: number;
    brands?: Brand[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
