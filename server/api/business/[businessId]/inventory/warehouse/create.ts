import { readBody } from 'h3';

type CreateNewWarehouseReq = {
    name: string;
    description: string;
    pictureUrl: string;
};

type CreateNewWarehouseRes = {
    warehouseId: number;
    success: boolean;
};

export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId') ?? '';

    const req: CreateNewWarehouseReq = await readBody(event);

    await $fetch(`${process.env.BACKEND_API_BASE_URL}/v1/warehouse/create`, {
        method: 'POST',
        body: {
            businessId: parseInt(businessId, 10) || 1,
            warehouseName: req.name,
            warehousePictureUrl: req.pictureUrl,
            description: req.description,
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = {
        warehouseId: 1,
        success: true,
    };

    return data;
});
