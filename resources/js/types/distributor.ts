import type { Brand } from "./brand";

export type Distributor = {
    id: number;
    distributor_code: string;
    name: string;
    legal_company_name: string | null;
    country: string;
    description: string | null;
    logo: string | null;
    tax_id: string | null;
    website: string | null;
    primary_contact: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    status: "active" | "inactive" | "draft";
    brands_count?: number;
    brands?: Brand[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
