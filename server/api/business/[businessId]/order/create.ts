import { readBody } from 'h3';
import type { CustomerOrder } from '~~/model/CustomerOrder';

type CreateNewCustomerOrderRes = {
    customerOrderId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId') ?? '';

    const req: CustomerOrder = await readBody(event);

    const data: CreateNewCustomerOrderRes = await $fetch(`${process.env.BACKEND_API_BASE_URL}/v1/order/create`, {
        method: 'POST',
        body: {
            'businessId': parseInt(businessId, 10) || 1,
            'orderId': req.orderId,
            'customerId': req.customerId,
            'channelId': req.channelId,
            'statusId': req.statusId,
            'shippingMethod': req.shippingMethod,
            'shippingFee': req.shippingFee,
            'shippingCost': req.shippingCost,
            'customerOrderItems': req.items.map(item => ({
                variantId: item.variantId,
                warehouseId: item.warehouseId,
                quantity: item.quantity,
                pricePerUnit: item.pricePerUnit,
                discountPerUnit: item.discountPerUnit,
            })),
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return data;
});
