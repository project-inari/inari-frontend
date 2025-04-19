import { readBody } from 'h3';
import type  { Supplier } from '~~/model/Supplier';

type CreateNewSupplierRes = {
    supplierId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const req: Supplier = await readBody(event);
    console.log(req);

    const data: CreateNewSupplierRes = {
        supplierId: 1,
        success: true,
    };

    return data;
});
