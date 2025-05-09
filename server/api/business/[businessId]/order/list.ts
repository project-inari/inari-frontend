import type { CustomerOrder } from '~~/model/CustomerOrder';

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId');
    const fetchList = await $fetch<{ customerOrders: any[] }>(
        `${process.env.BACKEND_API_BASE_URL}/v1/order/list/${businessId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    const fetchOrders = fetchList.customerOrders;
    const orderList: CustomerOrder[] = fetchOrders.map(order => {
        return {
            id: order.id,
            orderId: order.orderId,
            customerId: order.customerId,
            channelId: order.channelId,
            statusId: order.statusId,
            shippingMethod: order.shippingMethod,
            shippingFee: order.shippingFee,
            shippingCost: order.shippingCost,
            items: order.items.map(
                (item: {
                    variantId: any;
                    quantity: any;
                    pricePerUnit: any;
                    discountPerUnit: any;
                }) => {
                    return {
                        variantId: item.variantId,
                        quantity: item.quantity,
                        pricePerUnit: item.pricePerUnit,
                        discountPerUnit: item.discountPerUnit,
                    };
                },
            ),
            orderedAt: order.createdAt,
        };
    });

    // const orderList: CustomerOrder[] = [
    //     {
    //         id: 1,
    //         orderId: 'ORD001',
    //         customerId: 1,
    //         channelId: 1,
    //         statusId: 5,
    //         shippingMethod: 'Standard Shipping',
    //         shippingFee: 50,
    //         shippingCost: 50,
    //         items: [
    //             {
    //                 variantId: 1,
    //                 quantity: 2,
    //                 pricePerUnit: 50,
    //                 discountPerUnit: 0,
    //             },
    //             {
    //                 variantId: 2,
    //                 quantity: 3,
    //                 pricePerUnit: 25,
    //                 discountPerUnit: 0,
    //             },
    //         ],
    //         orderedAt: '2023-10-01T10:00:00Z',
    //     },
    //     {
    //         id: 2,
    //         orderId: 'ORD002',
    //         customerId: 2,
    //         channelId: 2,
    //         statusId: 2,
    //         shippingMethod: 'Express Shipping',
    //         shippingFee: 100,
    //         shippingCost: 100,
    //         items: [
    //             {
    //                 variantId: 3,
    //                 quantity: 1,
    //                 pricePerUnit: 75,
    //                 discountPerUnit: 5,
    //             },
    //         ],
    //         orderedAt: '2023-10-02T11:00:00Z',
    //     },
    //     {
    //         id: 3,
    //         orderId: 'ORD003',
    //         customerId: 3,
    //         channelId: 3,
    //         statusId: 2,
    //         shippingMethod: 'Standard Shipping',
    //         shippingFee: 50,
    //         shippingCost: 50,
    //         items: [
    //             {
    //                 variantId: 4,
    //                 quantity: 5,
    //                 pricePerUnit: 20,
    //                 discountPerUnit: 0,
    //             },
    //         ],
    //         orderedAt: '2023-10-03T12:00:00Z',
    //     },
    //     {
    //         id: 4,
    //         orderId: 'ORD004',
    //         customerId: 4,
    //         channelId: 4,
    //         statusId: 3,
    //         shippingMethod: 'Express Shipping',
    //         shippingFee: 100,
    //         shippingCost: 100,
    //         items: [
    //             {
    //                 variantId: 3,
    //                 quantity: 2,
    //                 pricePerUnit: 40,
    //                 discountPerUnit: 0,
    //             },
    //         ],
    //         orderedAt: '2023-10-04T13:00:00Z',
    //     },
    // ];

    return orderList;
});
