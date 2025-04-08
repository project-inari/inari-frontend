export interface InventoryItem {
    id: number
    sku: string
    item: string
    supplierId: number
    variant: string
    brand: string
    categoryId: number
    tags: Array<{ id:number; name: string; color: string }>
    qty: number
    img: string
    purchasePrice: number
    sellingPrice: number
    note?: string
    qtyInWarehouse?: Array<{ warehouseId: number; qty: number }>
}
