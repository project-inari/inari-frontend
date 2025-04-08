export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId');
    console.log(businessId);

    const inventoryItemsList: any[] = [
        {
            id: 1,
            sku: '001',
            img: 'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Heineken-Beer.jpg',
            item: 'Heineken Original',
            variant: '330 ml',
            supplierId: 1,
            purchasePrice: 30,
            sellingPrice: 50,
            categoryId: 3, 
            tags: [
                { id: 1, name: 'In Stock', color: 'white' },
                { id: 3, name: 'Low Stock', color: 'orange' },
                { id: 5, name: 'Best Seller', color: 'blue' },
            ],
            qtyInWarehouse: [
                {
                    warehouseId: 1,
                    qty: 50,
                },
                {
                    warehouseId: 2,
                    qty: 50,
                },
            ]
        },
        {
            id: 2,
            sku: '002',
            img: '/img/heineken.png',
            item: 'Heineken Original',
            variant: '500 ml',
            supplierId: 2,
            purchasePrice: 15,
            sellingPrice: 25,
            categoryId: 3,
            tags: [
                { id: 1, name: 'In Stock', color: 'white' },
            ],
            qtyInWarehouse: [
                {
                    warehouseId: 1,
                    qty: 30,
                },
                {
                    warehouseId: 2,
                    qty: 60,
                },
            ]
        },
        {
            id: 3,
            sku: '003',
            img: '/img/hoegaarden.png',
            item: 'Hoegaarden Rose',
            variant: '250 ml',
            supplierId: 1,
            purchasePrice: 20,
            sellingPrice: 35, // Added a sellingPrice for consistency
            categoryId: 3,
            tags: [
                { id: 3, name: 'Low Stock', color: 'orange' },
            ],
            qtyInWarehouse: [
                {
                    warehouseId: 1,
                    qty: 10,
                },
                {
                    warehouseId: 2,
                    qty: 70,
                },
            ]
        },
        {
            id: 4,
            sku: '004',
            img: '/img/snowbeer.png',
            item: 'Snow Weizen',
            variant: '490 ml',
            supplierId: 2,
            purchasePrice: 10,
            sellingPrice: 20,
            categoryId: 3,
            tags: [
                { id: 999, name: 'Crispy', color: 'blue' },
            ],
            qtyInWarehouse: [
                {
                    warehouseId: 1,
                    qty: 80,
                },
                {
                    warehouseId: 2,
                    qty: 70,
                },
            ]
        },
        {
            id: 5,
            sku: '006',
            img: '/img/pringles.png',
            item: 'Pringles Sour Cream',
            variant: '300 g',
            supplierId: 1,
            purchasePrice: 5,
            sellingPrice: 10,
            categoryId: 6,
            tags: [
                { id: 999, name: 'Crispy', color: 'blue' },
                { id: 2, name: 'Out of Stock', color: 'red' },
            ],
            qtyInWarehouse: [
                {
                    warehouseId: 1,
                    qty: 10,
                },
                {
                    warehouseId: 2,
                    qty: 90,
                },
            ]
        },
    ];

    return inventoryItemsList;
});
