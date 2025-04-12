export interface SupplierOrder {
    id: number;
    receiveId: string;
    supplierId: number;
    warehouseId: number;
    orderItems: OrderItem[];
    shippingMethod: string;
    shippingCost: number;
    status: string;
    dateCreated: string;
};

export interface OrderItem {
    variantId: number;
    productName: string;
    variantName: string;
    sku: string;
    purchasePrice: number;
    pictureUrl: string;
    categoryId: number;
    tagIds: number[];
    orderQty: number;
}
