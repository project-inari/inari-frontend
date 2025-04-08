// SupplierOrderItem.ts
import type { InventoryItem } from './InventoryItem'

export interface SupplierOrderItem extends InventoryItem {
    orderQty: number
}
