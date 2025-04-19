export default defineEventHandler(async event => {
    const productId = getRouterParam(event, 'productId');

    let inventoryItem: any = null;

    if (productId === '1') {
        inventoryItem = {
            id: 1,
            sku: '001',
            img: 'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Heineken-Beer.jpg',
            item: 'Heineken Original',
            variant: '330 ml',
            supplierId: 1,
            purchasePrice: 30,
            sellingPrice: 50,
            categories: [
                { id: 1, name: 'Beverage', parent: [] },
                {
                    id: 2,
                    name: 'Alcohol',
                    parent: [{ id: 1, name: 'Beverage' }],
                },
                {
                    id: 3,
                    name: 'Beer',
                    parent: [
                        { id: 1, name: 'Beverage' },
                        { id: 2, name: 'Alcohol' },
                    ],
                },
            ],
            tags: [
                { id: 1, name: 'In Stock', color: 'white' },
                { id: 3, name: 'Low Stock', color: 'orange' },
                { id: 5, name: 'Best Seller', color: 'blue' },
            ],
            note: 'This is a note',
            qtyInWarehouse: [
                {
                    warehouseId: 1,
                    qty: 100,
                },

                {
                    warehouseId: 2,
                    qty: 188,
                },
            ],
        };
    } else {
        inventoryItem = {
            id: 2,
            sku: '002',
            img: '/img/heineken.png',
            item: 'Heineken Original',
            variant: '500 ml',
            supplierId: 2,
            purchasePrice: 15,
            sellingPrice: 25, // Added a sellingPrice for consistency
            categories: [
                { id: 1, name: 'Beverage', parent: [] },
                {
                    id: 2,
                    name: 'Alcohol',
                    parent: [{ id: 1, name: 'Beverage' }],
                },
                {
                    id: 3,
                    name: 'Beer',
                    parent: [
                        { id: 1, name: 'Beverage' },
                        { id: 2, name: 'Alcohol' },
                    ],
                },
            ],
            tags: [{ id: 1, name: 'In Stock', color: 'white' }],
            note: 'This is another note',
            qtyInWarehouse: [
                {
                    warehouseId: 1,
                    qty: 50,
                },
                {
                    warehouseId: 2,
                    qty: 50,
                },
            ],
        };
    }

    return inventoryItem;
});
