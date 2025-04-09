import type { Product } from '~/model/Product';

export default defineEventHandler(async event => {
    const productId = getRouterParam(event, 'productId');

    const data: Product = {
        productId: Number(productId),
        name: 'Heineken Original',
        supplierId: 1,
        categoryId: 1,
        brand: 'Heineken',
        variants: [
            {
                variantId: 1,
                name: '330 ml',
                sku: '001',
                purchasePrice: 30,
                sellingPrice: 50,
                pictureUrl: 'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Heineken-Beer.jpg',
                note: 'This is a note',
                tagIds: [1, 2, 3],
                qtyInWarehouse: [
                    { warehouseId: 1, qty: 100 },
                    { warehouseId: 2, qty: 188 },
                ],
            },
            {
                variantId: 2,
                name: '500 ml',
                sku: '002',
                purchasePrice: 15,
                sellingPrice: 25,
                pictureUrl: 'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Heineken-Beer.jpg',
                note: 'This is another note',
                tagIds: [2, 3],
                qtyInWarehouse: [
                    { warehouseId: 1, qty: 200 },
                    { warehouseId: 2, qty: 150 },
                ],
            },
        ],
    }

    return data;
});
