import type { SupplierOrder } from '~/model/SupplierOrder';

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId');
    const fetchList = await $fetch<{ supplierOrders: any[] }>(
        `${process.env.BACKEND_API_BASE_URL}/v1/supplier/order/list/${businessId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    const fetchSupplierOrders = fetchList.supplierOrders;

    const data: SupplierOrder[] = fetchSupplierOrders.map((order) => {
        return {
            id: order.id,
            receiveId: order.receiveId,
            supplierId: order.supplierId,
            warehouseId: order.warehouseId,
            status: order.status,
            shippingMethod: order.shippingMethod,
            shippingCost: order.shippingCost,
            orderItems: order.orderItems.map((item: {
                variantId: string;
                productName: string;
                variantName: string;
                skuNo: string;
                basePurchasePrice: number;
                pictureUrl: string;
                categoryId: string;
                quantity: number;
            }) => {
                return {
                    variantId: item.variantId,
                    productName: item.productName,
                    variantName: item.variantName,
                    sku: item.skuNo,
                    purchasePrice: item.basePurchasePrice,
                    pictureUrl: item.pictureUrl,
                    categoryId: item.categoryId,
                    orderQty: item.quantity,
                };
            }),
            dateCreated: order.createdAt,
        };
    });

    // const data: SupplierOrder[] = [
    //     {
    //         id: 1,
    //         receiveId: 'R123',
    //         supplierId: 1,
    //         warehouseId: 1,
    //         orderItems: [
    //             {
    //                 variantId: 1,
    //                 productName: 'Heineken Original',
    //                 variantName: '330 ml',
    //                 sku: '001',
    //                 purchasePrice: 30,
    //                 pictureUrl:
    //                     'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Heineken-Beer.jpg',
    //                 categoryId: 1,
    //                 orderQty: 100,
    //             },
    //             {
    //                 variantId: 2,
    //                 productName: 'Tiger Beer',
    //                 variantName: '500 ml',
    //                 sku: '002',
    //                 purchasePrice: 25,
    //                 pictureUrl:
    //                     'https://d2oto3d7z6t29c.cloudfront.net/entries/transformed/32/6d/414824_003cecee716f408d9ffe7fc2fe124fa7.jpg',
    //                 categoryId: 1,
    //                 orderQty: 50,
    //             },
    //         ],
    //         shippingMethod: 'Kerry',
    //         shippingCost: 100,
    //         status: 'Ordered',
    //         dateCreated: '2023-10-01',
    //     },
    //     {
    //         id: 2,
    //         receiveId: 'R124',
    //         supplierId: 2,
    //         warehouseId: 2,
    //         orderItems: [
    //             {
    //                 variantId: 3,
    //                 productName: 'Budweiser',
    //                 variantName: '330 ml',
    //                 sku: '003',
    //                 purchasePrice: 20,
    //                 pictureUrl:
    //                     'https://wishbeer.com/cdn/shop/products/6852_1024x1024.jpg?v=1560155131',
    //                 categoryId: 1,
    //                 orderQty: 200,
    //             },
    //             {
    //                 variantId: 4,
    //                 productName: 'Corona',
    //                 variantName: '330 ml',
    //                 sku: '004',
    //                 purchasePrice: 35,
    //                 pictureUrl:
    //                     'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tallidrinks.com%2Fproduct-page%2Fcorona-extra-beer&psig=AOvVaw28X4Y7Si0-yA2UKaigFpKV&ust=1744632147530000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCKiQua371IwDFQAAAAAdAAAAABAE',
    //                 categoryId: 1,
    //                 orderQty: 150,
    //             },
    //         ],
    //         shippingMethod: 'Grab',
    //         shippingCost: 150,
    //         status: 'Completed',
    //         dateCreated: '2023-10-02',
    //     },
    // ];

    return data;
});
