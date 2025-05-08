export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId');

    const channelList: any[] = [
        {
            id: 1,
            name: 'Retail',
        },
        {
            id: 2,
            name: 'Facebook',
        },
        {
            id: 3,
            name: 'Line',
        },
        {
            id: 4,
            name: 'Shopee',
        },
        {
            id: 5,
            name: 'Lazada',
        },
    ];

    return channelList;
});
