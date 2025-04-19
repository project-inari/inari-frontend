import { readBody } from 'h3';
import type { SupplierContact } from '~~/model/Supplier';

type CreateNewSupplierContactRes = {
    supplierContactId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const req: SupplierContact = await readBody(event);
    console.log(req);

    const data: CreateNewSupplierContactRes = {
        supplierContactId: 1,
        success: true,
    };

    return data;
});
