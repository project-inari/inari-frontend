import type { Product } from '~/model/Product';

export default defineEventHandler(async event => {
    const data: Product[] = [
        {
            productId: 1,
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
                    pictureUrl:
                        'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Heineken-Beer.jpg',
                    note: 'This is a note',
                    tagIds: [1, 3],
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
                    pictureUrl:
                        'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Heineken-Beer.jpg',
                    note: 'This is another note',
                    tagIds: [1, 2],
                    qtyInWarehouse: [
                        { warehouseId: 1, qty: 200 },
                        { warehouseId: 2, qty: 150 },
                    ],
                },
            ],
        },
        {
            productId: 2,
            name: 'Tiger Beer',
            supplierId: 1,
            categoryId: 1,
            brand: 'Tiger',
            variants: [
                {
                    variantId: 3,
                    name: '330 ml',
                    sku: '003',
                    purchasePrice: 30,
                    sellingPrice: 50,
                    pictureUrl:
                        'https://www.raanthai.co.uk/cdn/shop/files/mdr039lg.jpg?v=1721495680',
                    note: 'This is a note',
                    tagIds: [1, 2],
                    qtyInWarehouse: [
                        { warehouseId: 1, qty: 100 },
                        { warehouseId: 2, qty: 188 },
                    ],
                },
                {
                    variantId: 4,
                    name: '500 ml',
                    sku: '004',
                    purchasePrice: 15,
                    sellingPrice: 25,
                    pictureUrl:
                        'https://www.raanthai.co.uk/cdn/shop/files/mdr039lg.jpg?v=1721495680',
                    note: 'This is another note',
                    tagIds: [1, 2],
                    qtyInWarehouse: [
                        { warehouseId: 1, qty: 200 },
                        { warehouseId: 2, qty: 150 },
                    ],
                },
            ],
        },
        {
            productId: 3,
            name: 'Budweiser',
            supplierId: 1,
            categoryId: 1,
            brand: 'Budweiser',
            variants: [
                {
                    variantId: 5,
                    name: '330 ml',
                    sku: '005',
                    purchasePrice: 30,
                    sellingPrice: 50,
                    pictureUrl:
                        'https://wishbeer.com/cdn/shop/products/6852.jpg?v=1560155131',
                    note: 'This is a note',
                    tagIds: [3, 4],
                    qtyInWarehouse: [
                        { warehouseId: 1, qty: 100 },
                        { warehouseId: 2, qty: 188 },
                    ],
                },
                {
                    variantId: 6,
                    name: '500 ml',
                    sku: '006',
                    purchasePrice: 15,
                    sellingPrice: 25,
                    pictureUrl:
                        'https://wishbeer.com/cdn/shop/products/6852.jpg?v=1560155131',
                    note: 'This is another note',
                    tagIds: [2, 3, 4],
                    qtyInWarehouse: [
                        { warehouseId: 1, qty: 200 },
                        { warehouseId: 2, qty: 150 },
                    ],
                },
            ],
        },
    ];

    return data;
});
