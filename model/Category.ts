import type { Tag } from './Tag';

export interface Category {
    id: number;
    name: string;
    pictureUrl: string;
    description: string;
    tags: Tag[];
    parentCategoryId?: number;
}
