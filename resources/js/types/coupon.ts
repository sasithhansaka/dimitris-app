import type { Product } from './product';
import type { Retailer } from './retailer';

export type CouponProductPivot = {
    ocr_name: string;
    ocr_keywords: string;
    quantity: number;
    required: boolean;
};

export type CouponProduct = Product & {
    pivot: CouponProductPivot;
};

export type Coupon = {
    id: number;
    name: string;
    description: string;
    image: string;
    country: string;
    currency: string;
    start_date: string;
    end_date: string;
    status: 'active' | 'inactive' | 'draft';
    featured: boolean;
    products?: CouponProduct[];
    retailers?: Retailer[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
