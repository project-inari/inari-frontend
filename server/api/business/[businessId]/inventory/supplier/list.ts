export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId');
    console.log(businessId);

    const supplierList: any[] = [
        {
            id: 1,
            name: 'Supplier 1',
            type: 'Beverage'
        },
        {
            id: 2,
            name: 'Supplier 2',
            type: 'Snacks'
        },
        {
            id: 3,
            name: 'Supplier 3',
            type: 'Beverage'
        },
    ];

    return supplierList;
});
