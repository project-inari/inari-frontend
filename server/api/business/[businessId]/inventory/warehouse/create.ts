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
    const req: CreateNewWarehouseReq = await readBody(event);
    console.log(req);

    const data = {
        warehouseId: 1,
        success: true,
    };

    return data;
});
