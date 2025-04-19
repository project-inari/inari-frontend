import { readBody } from 'h3';

type CreateNewProductReq = {
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

type CreateNewProductRes = {
    productId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const req: CreateNewProductReq = await readBody(event);
    console.log(req);

    const data = {
        productId: 1,
        success: true,
    };

    return data;
});
