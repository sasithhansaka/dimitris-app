import type { Brand } from './brand';

export type Offer = {
    id: number;
    brand_id: number;
    title: string;
    description: string;
    image: string;
    start_date: string;
    end_date: string;
    status: 'active' | 'inactive' | 'draft';
    featured: boolean;
    brand?: Brand;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
