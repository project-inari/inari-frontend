export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId');
    console.log(businessId);

    const orderStatusList: any[] = [
        {
            id: 1,
            name: 'Pending Payment',
        },
        {
            id: 2,
            name: 'Order Confirmed',
        },
        {
            id: 3,
            name: 'Awaiting Shipment',
        },
        {
            id: 4,
            name: 'Shipped / In Transit',
        },
        {
            id: 5,
            name: 'Completed',
        },
    ];

    return orderStatusList;
});
