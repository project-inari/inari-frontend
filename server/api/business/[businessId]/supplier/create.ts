import { readBody } from 'h3';
import type { Supplier } from '~~/model/Supplier';

type CreateNewSupplierRes = {
    supplierId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId') ?? '';

    const req: Supplier = await readBody(event);

    const supplierRes: CreateNewSupplierRes = await $fetch(`${process.env.BACKEND_API_BASE_URL}/v1/supplier/create`, {
        method: 'POST',
        body: {
            'businessId': parseInt(businessId, 10) || 1,
            'supplierName': req.name,
            'type': req.type,
            'description': req.description,
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (req.contacts) {
        for (const contact of req.contacts) {
            await $fetch(`${process.env.BACKEND_API_BASE_URL}/v1/supplier/contact/create`, {
                method: 'POST',
                body: {
                    'businessId': parseInt(businessId, 10) || 1,
                    'supplierId': supplierRes.supplierId,
                    'fullName': contact.fullName,
                    'email': contact.email,
                    'phoneNo': contact.phoneNo,
                    'address': contact.address,
                    'remarks': contact.remarks,
                    'status': contact.status,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    }

    return supplierRes;
});
