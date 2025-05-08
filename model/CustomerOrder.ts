export interface CustomerOrderItem {
    variantId: number;
    warehouseId: number;
    quantity: number;
    pricePerUnit: number;
    discountPerUnit: number;
}

export interface CustomerOrder {
    id?: number;
    orderId: string;
    customerId: number;
    channelId: number;
    statusId: number;
    shippingMethod: string;
    shippingFee: number;
    shippingCost: number;
    items: CustomerOrderItem[];
    orderedAt: string;
}
