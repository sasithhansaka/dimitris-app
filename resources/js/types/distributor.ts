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
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
