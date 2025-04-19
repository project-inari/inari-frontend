import { readBody } from 'h3';
import type  { Category } from '~~/model/Category';

type CreateNewCategoryRes = {
    categoryId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const req: Category = await readBody(event);
    console.log(req);

    const data: CreateNewCategoryRes = {
        categoryId: 1,
        success: true,
    };

    return data;
});
