import type { ArticleCategory } from './articleCategory';

export type Article = {
    id: number;
    title: string;
    slug: string;
    introduction: string | null;
    content: string;
    banner: string;
    keywords: string | null;
    status: 'active' | 'inactive' | 'draft';
    read_time: number;
    featured: boolean;
    article_category_id: number;
    category?: ArticleCategory | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
