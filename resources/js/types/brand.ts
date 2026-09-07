import type { Distributor } from './distributor';

export type Brand = {
    id: number;
    name: string;
    description: string | null;
    logo: string | null;
    status: 'active' | 'inactive' | 'draft';
    distributors?: Distributor[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
