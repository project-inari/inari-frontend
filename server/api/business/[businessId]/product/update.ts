import { readBody } from 'h3';

type UpdateProductReq = {
    sku: string;
    name: string;
    purchasePrice: number;
    supplierId: string;
    category: number;
    tags: number[]; // tag ids
    description: string;
    brand: string;
    variant: string;
    sellingPrice: number;
};

type UpdateProductRes = {
    productId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const req: UpdateProductReq = await readBody(event);
    console.log(req)

    const data = {
        productId: 1,
        success: true,
    }

    return data;
});
