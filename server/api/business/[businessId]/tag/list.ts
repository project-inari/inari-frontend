import type { Tag } from '~/model/Tag';

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId');
    const fetchList = await $fetch<{ businessTags: any[] }>(
        `${process.env.BACKEND_API_BASE_URL}/v1/tag/list/${businessId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    const fetchTags = fetchList.businessTags;

    const tagList: Tag[] = fetchTags.map(tag => {
        return {
            id: tag.id,
            name: tag.tagName,
            description: tag.description,
            color: tag.color,
        };
    });

    // const tagList: any[] = [
    //     {
    //         id: 1,
    //         name: 'In Stock',
    //         description: 'this is tag 1',
    //         color: 'white',
    //     },
    //     {
    //         id: 2,
    //         name: 'Out of Stock',
    //         description: 'this is tag 2',
    //         color: 'red',
    //     },
    //     {
    //         id: 3,
    //         name: 'Low Stock',
    //         description: 'this is tag 3',
    //         color: 'orange',
    //     },
    //     {
    //         id: 4,
    //         name: 'New Arrival',
    //         description: 'this is tag 4',
    //         color: 'green',
    //     },
    //     {
    //         id: 5,
    //         name: 'Best Seller',
    //         description: 'this is tag 5',
    //         color: 'blue',
    //     },
    // ];

    return tagList;
});
