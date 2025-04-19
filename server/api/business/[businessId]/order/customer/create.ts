import { readBody } from 'h3';
import type { Customer } from '~~/model/Customer';

type CreateNewCustomerRes = {
    customerId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const req: Customer = await readBody(event);
    console.log(req);

    const data: CreateNewCustomerRes = {
        customerId: 1,
        success: true,
    };

    return data;
});
