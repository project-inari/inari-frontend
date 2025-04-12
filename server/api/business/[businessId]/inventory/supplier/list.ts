import type { SupplierOrder } from '~/model/SupplierOrder';

export default defineEventHandler(async event => {
    const data: SupplierOrder[] = [{
        id: 1,
        receiveId: 'R123',
        supplierId: 1,
        warehouseId: 1,
        orderItems: [
            {
                variantId: 1,
                productName: 'Heineken Original',
                variantName: '330 ml',
                sku: '001',
                purchasePrice: 30,
                pictureUrl: 'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Heineken-Beer.jpg',
                categoryId: 1,
                tagIds: [1, 2],
                orderQty: 100,
            },
            {
                variantId: 2,
                productName: 'Tiger Beer',
                variantName: '500 ml',
                sku: '002',
                purchasePrice: 25,
                pictureUrl: 'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Tiger-Beer.jpg',
                categoryId: 1,
                tagIds: [1, 3],
                orderQty: 50,
            },
        ],
        shippingMethod: 'Kerry',
        shippingCost: 100,
        status: 'Ordered',
        dateCreated: '2023-10-01',
    },
    {
        id: 2,
        receiveId: 'R124',
        supplierId: 2,
        warehouseId: 2,
        orderItems: [
            {
                variantId: 3,
                productName: 'Budweiser',
                variantName: '330 ml',
                sku: '003',
                purchasePrice: 20,
                pictureUrl: 'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Budweiser.jpg',
                categoryId: 1,
                tagIds: [2, 3],
                orderQty: 200,
            },
            {
                variantId: 4,
                productName: 'Corona',
                variantName: '330 ml',
                sku: '004',
                purchasePrice: 35,
                pictureUrl: 'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Corona.jpg',
                categoryId: 1,
                tagIds: [1, 2],
                orderQty: 150,
            },
        ],
        shippingMethod: 'Grab',
        shippingCost: 150,
        status: 'Completed',
        dateCreated: '2023-10-02',
    }]

    return data;
});
