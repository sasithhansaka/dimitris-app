import type { ArticleCategory } from './articleCategory';

export type Article = {
    id: number;
    title: string;
    slug: string;
    introduction: string | null;
    content: string;
    banner: string | null;
    keywords: string | null;
    status: 'active' | 'inactive' | 'draft';
    article_category_id: number;
    category?: ArticleCategory | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
