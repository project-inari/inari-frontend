import { readBody, createError } from 'h3';

// const config = useRuntimeConfig();

type CreateNewSupplierOrderReq = {
    receiveId: string;
    supplierId: string;
    warehouseId: string;
    orderItems: OrderItem[];
    shippingCost: number;
};

type OrderItem = {
    itemId: string;
    quantity: number;
}

type CreateNewSupplierOrderRes = {
    supplierOrderId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const req: CreateNewSupplierOrderReq[] = await readBody(event);
    console.log(req)

    let data: CreateNewSupplierOrderRes;
    // try {
    //     data = await $fetch<CreateNewSupplierOrderRes>(
    //         `${config.BACKEND_API_BASE_URL}/v1/inventory/supplier-order`,
    //         {
    //             method: 'POST',
    //             body: req,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'X-API-Key': config.BACKEND_API_KEY,
    //             },
    //         },
    //     );
    // } catch (err) {
    //     console.error('Create new supplier order error:', err);
    //     throw createError({ statusCode: 500, statusMessage: 'Create new supplier order failed' });
    // }

    data = {
        supplierOrderId: 1,
        success: true,
    }

    return data;
});
