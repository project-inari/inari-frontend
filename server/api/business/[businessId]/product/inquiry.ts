import { readBody } from 'h3';

type InquiryProductReq = {

};

type InquiryProductRes = {
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

export default defineEventHandler(async event => {
    const req: InquiryProductReq = await readBody(event);
    console.log(req)

    const data = {
        productId: 1,
        success: true,
    }

    return data;
});
