import { readBody } from 'h3';
import type  { CustomerOrder } from '~~/model/CustomerOrder';

type CreateNewCustomerOrderRes = {
    customerOrderId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const req: CustomerOrder = await readBody(event);
    console.log(req);

    const data: CreateNewCustomerOrderRes = {
        customerOrderId: 1,
        success: true,
    };

    return data;
});
