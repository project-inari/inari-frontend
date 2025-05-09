import { readBody } from 'h3';

type OrderItem = {
    itemId: string;
    quantity: number;
};

type CreateNewSupplierOrderRes = {
    supplierOrderId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId') ?? '';
    const req = await readBody(event);
    console.log('req', req);
    console.log(req.orderItems);

    const data: CreateNewSupplierOrderRes = await $fetch(
        `${process.env.BACKEND_API_BASE_URL}/v1/supplier/order/create`,
        {
            method: 'POST',
            body: {
                businessId: parseInt(businessId, 10) || 1,
                supplierId: req.supplierId,
                warehouseId: req.warehouseId,
                receiveId: req.receiveId,
                shippingMethod: req.shippingMethod,
                shippingCost: req.shippingCost,
                status: req.status,
                supplierOrderItems: req.orderItems.map((item: OrderItem) => ({
                    variantId: item.itemId,
                    quantity: item.quantity,
                })),
            },
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    return data;
});
