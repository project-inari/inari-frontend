import { readBody } from 'h3';

type CreateNewProductRes = {
    productId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId') ?? '';
    const req = await readBody(event);

    const data: CreateNewProductRes = await $fetch(`${process.env.BACKEND_API_BASE_URL}/v1/product/create`, {
        method: 'POST',
        body: {
            'businessId': parseInt(businessId, 10) || 1,
            'supplierId': req.supplierId,
            'name': req.name,
            'brand': req.brand,
            'categoryId': req.categoryId,
            'variants': req.variants.map((variant: any) => ({
                'variantName': variant.name,
                'skuNo': variant.sku,
                'pictureUrl': variant.pictureUrl,
                'basePurchasePrice': variant.purchasePrice,
                'baseSellingPrice': variant.sellingPrice,
                'note': variant.note,
                'tagIds': variant.tagIds,
            })),
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return data;
});
