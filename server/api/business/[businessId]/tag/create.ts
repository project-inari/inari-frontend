import { readBody } from 'h3';
import type  { Tag } from '~~/model/Tag';

type CreateNewTagRes = {
    tagId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const req: Tag = await readBody(event);
    console.log(req);

    const data: CreateNewTagRes = {
        tagId: 1,
        success: true,
    };

    return data;
});
