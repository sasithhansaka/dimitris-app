export type ProductCategory = {
    id: number;
    name: string;
    description: string | null;
    status: 'active' | 'inactive' | 'draft';
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
