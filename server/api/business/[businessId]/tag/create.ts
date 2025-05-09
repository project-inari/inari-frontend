import { readBody } from 'h3';
import type { Tag } from '~~/model/Tag';

type CreateNewTagRes = {
    tagId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId') ?? '';

    const req: Tag = await readBody(event);

    await $fetch(`${process.env.BACKEND_API_BASE_URL}/v1/tag/create`, {
        method: 'POST',
        body: {
            businessId: parseInt(businessId, 10) || 1,
            tagName: req.name,
            color: req.color,
            description: req.description,
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data: CreateNewTagRes = {
        tagId: 1,
        success: true,
    };

    return data;
});
