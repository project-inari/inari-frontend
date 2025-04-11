<template>
    <div>
        <!-- Main Dialog -->
        <PrimeDialog v-model:visible="visible" maximizable modal header="Create Supplier Order"
            :style="{ width: '70rem' }" :class="fontDMSansPrompt">
            <div class="action-bar">
                <div>
                    <label>Search: </label>
                    <PrimeInputText v-model="searchKeyword" placeholder="Type to search any field..."
                        class="global-search-input" />
                </div>
                <div class="action-buttons">
                    <!-- Create New Item opens CreateItemModal -->
                    <PrimeButton label="Create New Item" class="create-item" outlined severity="primary"
                        @click="openCreateItemModal" />
                    <PrimeButton label="Add Item" class="add-item" severity="primary" @click="openAddItemModal" />
                </div>
            </div>

            <!-- Grouped Tables by Supplier -->
            <template v-for="(items, supplierKey) in groupedItems" :key="supplierKey">
                <h3 class="supplier-header">
                    Supplier: {{ supplierInfoMap[supplierKey]?.name || supplierKey }}
                </h3>

                <div class="group-inputs">
                    <PrimeInputText v-model="groupInputs[supplierKey].receiveId" placeholder="Receive ID"
                        class="input-group" />
                    <PrimeDropdown v-model="groupInputs[supplierKey].warehouseId" :options="warehouseOptions"
                        option-label="name" option-value="id" placeholder="Select Warehouse" class="input-group" />
                    <PrimeInputNumber v-model="groupInputs[supplierKey].shippingCost" placeholder="Shipping Cost"
                        class="input-group" />
                </div>

                <PrimeDataTable :value="items" removable-sort scrollable scroll-height="300px" responsive-layout="scroll"
                    class="inventory-table" :class="fontDMSansPrompt">
                    <PrimeColumn field="sku" header="SKU" sortable />
                    <PrimeColumn header="Image">
                        <template #body="slotProps">
                            <NuxtImg :src="slotProps.data.img" alt="item-image" width="40" height="40" />
                        </template>
                    </PrimeColumn>
                    <PrimeColumn header="Item" sortable>
                        <template #body="slotProps">
                            <span>{{ slotProps.data.item }}</span>
                        </template>
                    </PrimeColumn>
                    <PrimeColumn field="variant" header="Variants" sortable />
                    <PrimeColumn field="purchasePrice" header="Purchase Price" sortable />
                    <PrimeColumn field="orderQty" header="To Order Qty" sortable>
                        <template #body="slotProps">
                            <PrimeInputNumber v-model="slotProps.data.orderQty" show-buttons :min="0" fluid />
                        </template>
                    </PrimeColumn>
                    <PrimeColumn field="qty" header="Stock Qty" sortable />
                    <PrimeColumn header="Total Price">
                        <template #body="slotProps">
                            <span>{{ slotProps.data.purchasePrice * slotProps.data.orderQty }}</span>
                        </template>
                    </PrimeColumn>
                    <PrimeColumn>
                        <template #body="slotProps">
                            <PrimeButton icon="pi pi-times" outlined severity="danger"
                                @click="removeItem(slotProps.data)" />
                        </template>
                    </PrimeColumn>
                </PrimeDataTable>

                <div class="supplier-total-row">
                    <span class="label">Supplier Order Total (incl. shipping):</span>
                    <span class="value">{{ getSupplierSubtotal(supplierKey) }}</span>
                </div>
            </template>

            <!-- Grand Total -->
            <div class="total-row">
                <span class="label">Grand Total:</span>
                <span class="value">{{ grandTotal }}</span>
            </div>

            <PrimeButton label="Submit Orders" class="mt-4" @click="onSubmitCreateNewSupplierOrders" />
        </PrimeDialog>

        <!-- Add Item Dialog -->
        <PrimeDialog v-model:visible="isAddItemModalVisible" modal header="Add Item to Supplier Order"
            :class="fontDMSansPrompt">
            <PrimeDataTable v-model:selection="itemToAddSelected" :value="allItemsList" selection-mode="multiple"
                data-key="id" removable-sort scrollable scroll-height="400px" responsive-layout="scroll"
                class="inventory-table" :class="fontDMSansPrompt">
                <PrimeColumn selection-mode="multiple" header-style="width: 3rem" />
                <PrimeColumn field="sku" header="SKU" sortable />
                <PrimeColumn header="Image">
                    <template #body="slotProps">
                        <NuxtImg :src="slotProps.data.img" alt="item-image" width="40" height="40" />
                    </template>
                </PrimeColumn>
                <PrimeColumn header="Item" sortable>
                    <template #body="slotProps">
                        <span>{{ slotProps.data.item }}</span>
                    </template>
                </PrimeColumn>
                <PrimeColumn field="variant" header="Variants" sortable />
                <PrimeColumn field="purchasePrice" header="Purchase Price" sortable />
                <PrimeColumn field="qty" header="Stock Qty" sortable />
            </PrimeDataTable>
            <PrimeButton label="Add Selected Items" class="submit-add-item-button" severity="primary"
                @click="onSubmitAddItem" />
        </PrimeDialog>

        <!-- Create New Item Modal -->
        <CreateItemModal v-model:visible="isCreateItemModalVisible" />
    </div>
</template>

<script lang="ts" setup>
import type { InventoryItem } from '~/model/InventoryItem'
import type { SupplierOrderItem } from '~/model/SupplierOrderItem'

const currentBusinessStore = useCurrentBusinessStore()
const { fontDMSansPrompt } = useFontClass()

const props = defineProps({
    isOpened: Boolean,
    onSubmit: Function
})
const emit = defineEmits(['update:visible'])

const visible = computed({
    get: () => props.isOpened,
    set: value => emit('update:visible', value)
})

const isAddItemModalVisible = ref(false)
const isCreateItemModalVisible = ref(false)
const itemToAddSelected = ref<InventoryItem[]>([])
const allItemsList = ref<InventoryItem[]>([])
// itemsInList will contain extra order properties (like orderQty)
const itemsInList = ref<SupplierOrderItem[]>([])
const searchKeyword = ref('')

// Fetch warehouse options; assumed API returns array of { id, name }
const warehouseList = await $fetch(`/api/business/${currentBusinessStore.businessId}/inventory/warehouse/list`)
const warehouseOptions = ref(warehouseList)

// groupInputs holds extra info for each supplier order group
const groupInputs = reactive<Record<string, { receiveId: string; warehouseId: string; shippingCost: number }>>({})

// supplierInfoMap holds supplier info per supplierId (as string)
const supplierInfoMap = ref<Record<string, { name: string; type?: string }>>({})

// Group itemsInList by supplierId (converted to string)
const groupedItems = computed(() => {
    const groups: Record<string, SupplierOrderItem[]> = {}
    for (const item of itemsInList.value) {
        const supplierKey = String(item.supplierId)
        if (!groups[supplierKey]) {
            groups[supplierKey] = []
            groupInputs[supplierKey] = { receiveId: '', warehouseId: '', shippingCost: 0 }
        }
        groups[supplierKey].push(item)
    }
    return groups
})

// Fetch supplier info for each group if not already loaded
watchEffect(async () => {
    for (const supplierKey of Object.keys(groupedItems.value)) {
        if (!supplierInfoMap.value[supplierKey]) {
            const res = await $fetch(`/api/business/${currentBusinessStore.businessId}/supplier/inquiry`, {
                query: { supplierId: supplierKey }
            })
            supplierInfoMap.value[supplierKey] = res
        }
    }
})

function removeItem(item: SupplierOrderItem) {
    const index = itemsInList.value.findIndex(i => i.id === item.id)
    if (index !== -1) itemsInList.value.splice(index, 1)
}

function onSubmitAddItem() {
    itemToAddSelected.value.forEach(item => {
        if (!itemsInList.value.some(i => i.id === item.id)) {
            // Extend InventoryItem with orderQty for ordering
            itemsInList.value.push({ ...item, orderQty: 0 })
        }
    })
    itemToAddSelected.value = []
    isAddItemModalVisible.value = false
}

function getSupplierSubtotal(supplierKey: string) {
    const itemsTotal = groupedItems.value[supplierKey].reduce(
        (sum, item) => sum + item.purchasePrice * (item.orderQty ?? 0),
        0
    )
    const shipping = groupInputs[supplierKey]?.shippingCost ?? 0
    return itemsTotal + shipping
}

const grandTotal = computed(() => {
    return Object.entries(groupedItems.value).reduce((sum, [supplierKey, items]) => {
        const itemsTotal = items.reduce(
            (subtotal, item) => subtotal + item.purchasePrice * (item.orderQty ?? 0),
            0
        )
        const shipping = groupInputs[supplierKey]?.shippingCost ?? 0
        return sum + itemsTotal + shipping
    }, 0)
})

async function onSubmitCreateNewSupplierOrders() {
    const requests = Object.entries(groupedItems.value).map(([supplierKey, items]) => {
        const input = groupInputs[supplierKey]
        return {
            receiveId: input.receiveId,
            supplierId: supplierKey,
            warehouseId: input.warehouseId,
            shippingCost: input.shippingCost,
            orderItems: items.map(item => ({ itemId: item.id, quantity: item.orderQty }))
        }
    })

    await $fetch(`/api/business/${currentBusinessStore.businessId}/inventory/supplier/create-order`, {
        method: 'POST',
        body: requests
    })

    itemsInList.value = []
    Object.keys(groupInputs).forEach(key => delete groupInputs[key])
    visible.value = false
}

async function callGetAllItemsList() {
    const res = await $fetch(`/api/business/${currentBusinessStore.businessId}/inventory/list`)
    allItemsList.value = res
}

function openAddItemModal() {
    callGetAllItemsList()
    isAddItemModalVisible.value = true
}

function openCreateItemModal() {
    isCreateItemModalVisible.value = true
}
</script>

<style scoped lang="scss">
.action-bar {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    justify-content: space-between;

    .global-search-input {
        width: 300px;
        margin-right: 1rem;
    }

    .action-buttons {
        display: flex;
        gap: 1rem;
    }
}

.group-inputs {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.supplier-header {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: #444;
}

.supplier-total-row,
.total-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
    gap: 1rem;

    .label {
        color: #555;
    }

    .value {
        color: #1e88e5;
    }
}

.submit-add-item-button {
    margin-top: 1rem;
}
</style>