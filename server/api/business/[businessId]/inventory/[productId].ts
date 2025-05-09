export default defineEventHandler(async event => {
    const productId = getRouterParam(event, 'productId');

    interface FetchItemResponse {
        variantId: string;
        skuNo: string;
        pictureUrl: string;
        productName: string;
        variantName: string;
        supplierId: string;
        categoryId: string;
        basePurchasePrice: number;
        baseSellingPrice: number;
        categories: {
            id: string;
            name: string;
            parent: { id: string; name: string }[];
        }[];
        tags: { id: string; tagName: string; color: string }[];
        note: string;
        qtyInWarehouse: { warehouseId: string; qty: number }[];
    }

    const fetchItem = await $fetch<FetchItemResponse>(
        `${process.env.BACKEND_API_BASE_URL}/v1/inventory/inquiry/${productId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    const inventoryItem = {
        id: fetchItem.variantId,
        sku: fetchItem.skuNo,
        img: fetchItem.pictureUrl,
        item: fetchItem.productName,
        variant: fetchItem.variantName,
        supplierId: fetchItem.supplierId,
        categoryId: fetchItem.categoryId,
        purchasePrice: fetchItem.basePurchasePrice,
        sellingPrice: fetchItem.baseSellingPrice,
        categories: (fetchItem.categories ?? []).map(
            (category: { id: any; name: any; parent: any[] }) => {
                return {
                    id: category.id,
                    name: category.name,
                    parent: (category.parent ?? []).map(parentCategory => ({
                        id: parentCategory.id,
                        name: parentCategory.name,
                    })),
                };
            },
        ),
        tags: (fetchItem.tags ?? []).map(
            (tag: { id: any; tagName: any; color: any }) => {
                return {
                    id: tag.id,
                    name: tag.tagName,
                    color: tag.color,
                };
            },
        ),
        note: fetchItem.note,
        qtyInWarehouse: fetchItem.qtyInWarehouse,
    };

    // if (productId === '1') {
    //     inventoryItem = {
    //         id: 1,
    //         sku: '001',
    //         img: 'https://newyorkpizza.online/live/wp-content/uploads/2020/06/Heineken-Beer.jpg',
    //         item: 'Heineken Original',
    //         variant: '330 ml',
    //         supplierId: 1,
    //         purchasePrice: 30,
    //         sellingPrice: 50,
    //         categories: [
    //             { id: 1, name: 'Beverage', parent: [] },
    //             {
    //                 id: 2,
    //                 name: 'Alcohol',
    //                 parent: [{ id: 1, name: 'Beverage' }],
    //             },
    //             {
    //                 id: 3,
    //                 name: 'Beer',
    //                 parent: [
    //                     { id: 1, name: 'Beverage' },
    //                     { id: 2, name: 'Alcohol' },
    //                 ],
    //             },
    //         ],
    //         tags: [
    //             { id: 1, name: 'In Stock', color: 'white' },
    //             { id: 3, name: 'Low Stock', color: 'orange' },
    //             { id: 5, name: 'Best Seller', color: 'blue' },
    //         ],
    //         note: 'This is a note',
    //         qtyInWarehouse: [
    //             {
    //                 warehouseId: 1,
    //                 qty: 100,
    //             },

    //             {
    //                 warehouseId: 2,
    //                 qty: 188,
    //             },
    //         ],
    //     };
    // } else {
    //     inventoryItem = {
    //         id: 2,
    //         sku: '002',
    //         img: '/img/heineken.png',
    //         item: 'Heineken Original',
    //         variant: '500 ml',
    //         supplierId: 2,
    //         purchasePrice: 15,
    //         sellingPrice: 25, // Added a sellingPrice for consistency
    //         categories: [
    //             { id: 1, name: 'Beverage', parent: [] },
    //             {
    //                 id: 2,
    //                 name: 'Alcohol',
    //                 parent: [{ id: 1, name: 'Beverage' }],
    //             },
    //             {
    //                 id: 3,
    //                 name: 'Beer',
    //                 parent: [
    //                     { id: 1, name: 'Beverage' },
    //                     { id: 2, name: 'Alcohol' },
    //                 ],
    //             },
    //         ],
    //         tags: [{ id: 1, name: 'In Stock', color: 'white' }],
    //         note: 'This is another note',
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
    //     };
    // }

    return inventoryItem;
});
