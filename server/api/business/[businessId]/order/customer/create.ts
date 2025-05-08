import { readBody } from 'h3';
import type { Customer } from '~~/model/Customer';

type CreateNewCustomerRes = {
    customerId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId') ?? '';
    const req: Customer = await readBody(event);

    const data: CreateNewCustomerRes = await $fetch(`${process.env.BACKEND_API_BASE_URL}/v1/customer/create`, {
        method: 'POST',
        body: {
            'businessId': parseInt(businessId, 10) || 1,
            'name': req.name,
            'type': req.type,
            'phoneNo': req.phoneNo,
            'address': req.address,
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return data;
});
