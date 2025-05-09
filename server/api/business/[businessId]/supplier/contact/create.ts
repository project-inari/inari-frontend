import { readBody } from 'h3';
import type { SupplierContact } from '~~/model/Supplier';

type CreateNewSupplierContactRes = {
    supplierContactId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId') ?? '';

    const req: SupplierContact = await readBody(event);
    console.log('req', req);

    const data: CreateNewSupplierContactRes = await $fetch(
        `${process.env.BACKEND_API_BASE_URL}/v1/supplier/contact/create`,
        {
            method: 'POST',
            body: {
                businessId: parseInt(businessId, 10) || 1,
                supplierId: req.supplierId,
                fullName: req.fullName,
                email: req.email,
                phoneNo: req.phoneNo,
                address: req.address,
                remarks: req.remarks,
                status: req.status,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    return data;
});
