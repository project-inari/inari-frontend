import { readBody } from 'h3';
import type { Category } from '~~/model/Category';

type CreateNewCategoryRes = {
    categoryId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId') ?? '';

    const req: Category = await readBody(event);

    await $fetch(`${process.env.BACKEND_API_BASE_URL}/v1/category/create`, {
        method: 'POST',
        body: {
            businessId: parseInt(businessId, 10) || 1,
            categoryName: req.name,
            categoryPictureUrl: req.pictureUrl,
            description: req.description,
            parentCategoryId: req.parentCategoryId,
            tagIds: req.tags,
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data: CreateNewCategoryRes = {
        categoryId: 1,
        success: true,
    };

    return data;
});
