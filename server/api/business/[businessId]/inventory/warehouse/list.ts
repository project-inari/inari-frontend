export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId');
    console.log(businessId);

    const warehouseList: any[] = [
        {
            id: 1,
            name: 'Warehouse 1',
            pictureUrl: '',
        },
        {
            id: 2,
            name: 'Warehouse 2',
            pictureUrl: '',
        },
    ];

    return warehouseList;
});
