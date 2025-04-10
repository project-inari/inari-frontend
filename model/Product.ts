export interface Product {
    productId?: number;
    name: string;
    supplierId: number;
    categoryId: number;
    brand: string;
    variants: Variant[]
};

export interface Variant {
    variantId?: number;
    name: string;
    sku: string;
    purchasePrice: number;
    sellingPrice: number;
    pictureUrl: string;
    note: string;
    tagIds: number[];
    qtyInWarehouse: Array<{ warehouseId: number; qty: number }>;
}
