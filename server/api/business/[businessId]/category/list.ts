export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId');
    console.log(businessId);

    const categoryList: any[] = [
        {
            id: 1,
            name: 'Beverage',
            pictureUrl: '',
            description: 'this is category 1',
            tags: [
                {
                    id: 1,
                    name: 'In Stock',
                    color: 'white',
                },
                {
                    id: 3,
                    name: 'Low Stock',
                    color: 'orange',
                },
            ],
            parentCategoryId: null,
        },
        {
            id: 2,
            name: 'Alcohol',
            pictureUrl: '',
            description: 'this is category 2',
            tags: [
                {
                    id: 1,
                    name: 'In Stock',
                    color: 'white',
                },
                {
                    id: 2,
                    name: 'Out of Stock',
                    color: 'red',
                },
                {
                    id: 3,
                    name: 'Low Stock',
                    color: 'orange',
                },
            ],
            parentCategoryId: 1,
        },
        {
            id: 3,
            name: 'Beer',
            pictureUrl: '',
            description: 'this is category 3',
            tags: [
                {
                    id: 2,
                    name: 'Out of Stock',
                    color: 'red',
                },
                {
                    id: 3,
                    name: 'Low Stock',
                    color: 'orange',
                },
            ],
            parentCategoryId: 2,
        },
        {
            id: 4,
            name: 'Snacks',
            pictureUrl: '',
            description: 'this is category 4',
            tags: [
                {
                    id: 1,
                    name: 'In Stock',
                    color: 'white',
                },
                {
                    id: 2,
                    name: 'Out of Stock',
                    color: 'red',
                },
                {
                    id: 3,
                    name: 'Low Stock',
                    color: 'orange',
                },
            ],
            parentCategoryId: null,
        },
        {
            id: 5,
            name: 'Chips',
            pictureUrl: '',
            description: 'this is category 5',
            tags: [
                {
                    id: 1,
                    name: 'In Stock',
                    color: 'white',
                },
                {
                    id: 2,
                    name: 'Out of Stock',
                    color: 'red',
                },
                {
                    id: 3,
                    name: 'Low Stock',
                    color: 'orange',
                },
            ],
            parentCategoryId: 4,
        },
        {
            id: 6,
            name: 'Potato',
            pictureUrl: '',
            description: 'this is category 6',
            tags: [
                {
                    id: 1,
                    name: 'In Stock',
                    color: 'white',
                },
                {
                    id: 2,
                    name: 'Out of Stock',
                    color: 'red',
                },
                {
                    id: 3,
                    name: 'Low Stock',
                    color: 'orange',
                },
            ],
            parentCategoryId: 5,
        },
        {
            id: 7,
            name: 'Soda',
            pictureUrl: '',
            description: 'this is category 7',
            tags: [
                {
                    id: 1,
                    name: 'In Stock',
                    color: 'white',
                },
                {
                    id: 2,
                    name: 'Out of Stock',
                    color: 'red',
                },
                {
                    id: 3,
                    name: 'Low Stock',
                    color: 'orange',
                },
            ],
            parentCategoryId: 1,
        },
    ];

    return categoryList;
});
