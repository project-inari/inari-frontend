export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId');
    const fetchList = await $fetch<{ inventory: any[] }>(
        `${process.env.BACKEND_API_BASE_URL}/v1/inventory/list/${businessId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )

    const fetchInventoryItems = fetchList.inventory;

    const inventoryItemsList: any[] = fetchInventoryItems.map((item) => {
        return {
            id: item.variantId,
            sku: item.skuNo,
            item: item.productName,
            variant: item.variantName,
            img: item.pictureUrl,
            purchasePrice: item.basePurchasePrice,
            sellingPrice: item.baseSellingPrice,
            supplierId: item.supplierId,
            categoryId: item.categoryId,
            tags: item.tags.map((tag: { id: any; tagName: any; color: any; }) => {
                return {
                    id: tag.id,
                    name: tag.tagName,
                    color: tag.color,
                };
            }),
            qtyInWarehouse: item.qtyInWarehouse,
        };
    });

    // const inventoryItemsList: any[] = [
    //     {
    //         id: 1,
    //         sku: '001',
    //         img: 'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Heineken-Beer.jpg',
    //         item: 'Heineken Original',
    //         variant: '330 ml',
    //         supplierId: 1,
    //         purchasePrice: 30,
    //         sellingPrice: 50,
    //         categoryId: 3,
    //         tags: [
    //             { id: 1, name: 'In Stock', color: 'white' },
    //             { id: 3, name: 'Low Stock', color: 'orange' },
    //             { id: 5, name: 'Best Seller', color: 'blue' },
    //         ],
    //         qtyInWarehouse: [
    //             {
    //                 warehouseId: 1,
    //                 qty: 50,
    //             },
    //             {
    //                 warehouseId: 2,
    //                 qty: 50,
    //             },
    //         ],
    //     },
    //     {
    //         id: 2,
    //         sku: '002',
    //         img: 'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Heineken-Beer.jpg',
    //         item: 'Heineken Original',
    //         variant: '500 ml',
    //         supplierId: 2,
    //         purchasePrice: 15,
    //         sellingPrice: 25,
    //         categoryId: 3,
    //         tags: [{ id: 1, name: 'In Stock', color: 'white' }],
    //         qtyInWarehouse: [
    //             {
    //                 warehouseId: 1,
    //                 qty: 30,
    //             },
    //             {
    //                 warehouseId: 2,
    //                 qty: 60,
    //             },
    //         ],
    //     },
    //     {
    //         id: 3,
    //         sku: '003',
    //         img: 'https://d19oj5aeuefgv.cloudfront.net/0239911',
    //         item: 'Hoegaarden Rose',
    //         variant: '250 ml',
    //         supplierId: 1,
    //         purchasePrice: 20,
    //         sellingPrice: 35, // Added a sellingPrice for consistency
    //         categoryId: 3,
    //         tags: [{ id: 3, name: 'Low Stock', color: 'orange' }],
    //         qtyInWarehouse: [
    //             {
    //                 warehouseId: 1,
    //                 qty: 10,
    //             },
    //             {
    //                 warehouseId: 2,
    //                 qty: 70,
    //             },
    //         ],
    //     },
    //     {
    //         id: 4,
    //         sku: '004',
    //         img: 'https://d19oj5aeuefgv.cloudfront.net/0226662',
    //         item: 'Snow Weizen',
    //         variant: '490 ml',
    //         supplierId: 2,
    //         purchasePrice: 10,
    //         sellingPrice: 20,
    //         categoryId: 3,
    //         tags: [{ id: 999, name: 'Crispy', color: 'blue' }],
    //         qtyInWarehouse: [
    //             {
    //                 warehouseId: 1,
    //                 qty: 80,
    //             },
    //             {
    //                 warehouseId: 2,
    //                 qty: 70,
    //             },
    //         ],
    //     },
    //     {
    //         id: 5,
    //         sku: '006',
    //         img: 'https://assets.tops.co.th/PRINGLES-PringlesPotatoChipSourCreamandOnion102g-8886467100024-1?$JPEG$',
    //         item: 'Pringles Sour Cream',
    //         variant: '300 g',
    //         supplierId: 1,
    //         purchasePrice: 5,
    //         sellingPrice: 10,
    //         categoryId: 6,
    //         tags: [
    //             { id: 999, name: 'Crispy', color: 'blue' },
    //             { id: 2, name: 'Out of Stock', color: 'red' },
    //         ],
    //         qtyInWarehouse: [
    //             {
    //                 warehouseId: 1,
    //                 qty: 10,
    //             },
    //             {
    //                 warehouseId: 2,
    //                 qty: 90,
    //             },
    //         ],
    //     },
    // ];

    return inventoryItemsList;
});
