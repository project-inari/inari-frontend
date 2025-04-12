<template>
    <div class="supplier-order-history-page" :class="fontDMSansPrompt">
        <!-- HEADER -->
        <header class="order-history-header">
            <div class="header-left">
                <h1 class="title">Supplier Order History</h1>
            </div>
            <div class="header-right">
                <!-- Button to open CreateSupplierOrderModal -->
                <PrimeButton label="Create Supplier Order" icon="pi pi-plus" class="create-supplier-order-button"
                    @click="onCreateSupplierOrder" />
            </div>
        </header>

        <!-- SEARCH BAR -->
        <div class="header-actions">
            <div class="search-bar">
                <label>Search Orders:</label>
                <PrimeInputText v-model="searchKeyword" placeholder="Search orders..." class="global-search-input" />
            </div>
        </div>

        <!-- UPPER TABLE: SUPPLIER ORDERS -->
        <div class="supplier-order-table-section">
            <PrimeDataTable v-model:selection="selectedSupplierOrder" :value="filteredOrders" selection-mode="single"
                removable-sort scrollable scroll-height="250px" responsive-layout="scroll" class="supplier-order-table">
                <!-- Running number column -->
                <PrimeColumn header="#">
                    <template #body="slotProps">
                        <span>{{ slotProps.index + 1 }}</span>
                    </template>
                </PrimeColumn>
                <!-- Receive ID -->
                <PrimeColumn field="receiveId" header="Receive ID" sortable />
                <!-- Date Created -->
                <PrimeColumn field="dateCreated" header="Date" sortable />
                <!-- Supplier (lookup supplier name) -->
                <PrimeColumn header="Supplier">
                    <template #body="slotProps">
                        <span>{{ getSupplierName(slotProps.data.supplierId) }}</span>
                    </template>
                </PrimeColumn>
                <!-- Warehouse (lookup warehouse name) -->
                <PrimeColumn header="Warehouse">
                    <template #body="slotProps">
                        <span>{{ getWarehouseName(slotProps.data.warehouseId) }}</span>
                    </template>
                </PrimeColumn>
                <!-- Status -->
                <PrimeColumn field="status" header="Status" sortable />
            </PrimeDataTable>
        </div>

        <!-- LOWER SECTION: ORDER STATUS & ORDER ITEMS TABLE -->
        <div class="order-items-section" v-if="selectedSupplierOrder">
            <h2 class="order-items-title">
                Order Items for Order: {{ selectedSupplierOrder.receiveId }}
            </h2>

            <!-- Dropdown to change order status -->
            <div class="order-status-container">
                <label>Change Order Status:</label>
                <PrimeDropdown v-model="orderStatus" :options="orderStatusOptions" placeholder="Select Status"
                    optionLabel="label" optionValue="value" />
            </div>

            <!-- Order Items Table -->
            <PrimeDataTable :value="selectedOrderItems" removable-sort scrollable scroll-height="250px"
                responsive-layout="scroll" class="order-items-table">
                <!-- Running number column -->
                <PrimeColumn header="#">
                    <template #body="slotProps">
                        <span>{{ slotProps.index + 1 }}</span>
                    </template>
                </PrimeColumn>
                <!-- SKU -->
                <PrimeColumn field="sku" header="SKU" sortable />
                <!-- Product -->
                <PrimeColumn field="productName" header="Product" sortable />
                <!-- Variant -->
                <PrimeColumn field="variantName" header="Variant" />
                <!-- Purchase Price -->
                <PrimeColumn field="purchasePrice" header="Purchase Price" sortable />
                <!-- Order Qty -->
                <PrimeColumn field="orderQty" header="Order Qty" />
                <!-- Subtotal -->
                <PrimeColumn header="Subtotal">
                    <template #body="slotProps">
                        <span>{{ slotProps.data.purchasePrice * slotProps.data.orderQty }}</span>
                    </template>
                </PrimeColumn>
            </PrimeDataTable>
        </div>

        <!-- CreateSupplierOrderModal for creating new orders -->
        <CreateSupplierOrderModal v-model:visible="isSupplierOrderModalOpen" :is-opened="isSupplierOrderModalOpen"
            :on-submit="submitSupplierOrder" @close="closeSupplierOrderModal" />
    </div>
</template>

<script lang="ts" setup>
import type { SupplierOrder } from '~/model/SupplierOrder'

definePageMeta({
    layout: 'dashboard'
})

const { fontDMSansPrompt } = useFontClass()
const currentBusinessStore = useCurrentBusinessStore()

// 1) Fetch supplier orders
const fetchedOrders = await $fetch<SupplierOrder[]>(
    `/api/business/${currentBusinessStore.businessId}/inventory/supplier/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
).catch(() => [])
const supplierOrders = ref<SupplierOrder[]>(fetchedOrders)

// 2) Fetch supplier list
const fetchedSuppliers = await $fetch(
    `/api/business/${currentBusinessStore.businessId}/supplier/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
).catch(() => [])
const supplierList = ref(fetchedSuppliers)

// 3) Fetch warehouse list
const fetchedWarehouses = await $fetch(
    `/api/business/${currentBusinessStore.businessId}/inventory/warehouse/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
).catch(() => [])
const warehouseList = ref(fetchedWarehouses)

// 4) Filter by search keyword
const searchKeyword = ref('')
const filteredOrders = computed(() => {
    if (!searchKeyword.value.trim()) {
        return supplierOrders.value
    }
    return supplierOrders.value.filter((order) => {
        const supplier = supplierList.value.find((s) => s.id === order.supplierId)
        const supplierName = supplier ? supplier.name : ''
        return (
            order.receiveId.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
            order.status.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
            supplierName.toLowerCase().includes(searchKeyword.value.toLowerCase())
        )
    })
})

// 5) Selected order
const selectedSupplierOrder = ref<SupplierOrder | null>(null)

// 6) Items for the selected order
const selectedOrderItems = computed(() => selectedSupplierOrder.value?.orderItems || [])

// 7) Helper: get supplier name from ID
function getSupplierName(supplierId: number): string {
    const supplier = supplierList.value.find((s) => s.id === supplierId)
    return supplier ? supplier.name : 'Unknown'
}
// Helper: get warehouse name from ID
function getWarehouseName(warehouseId: number): string {
    const w = warehouseList.value.find((w) => w.id === warehouseId)
    return w ? w.name : 'Unknown'
}

// 8) For changing order status
const orderStatusOptions = ref([
    { label: 'Ordered', value: 'Ordered' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Canceled', value: 'Canceled' },
    { label: 'On Hold', value: 'On Hold' },
])
const orderStatus = computed<string>({
    get() {
        return selectedSupplierOrder.value ? selectedSupplierOrder.value.status : ''
    },
    set(newVal) {
        if (selectedSupplierOrder.value) {
            selectedSupplierOrder.value.status = newVal
            // Optionally, call an API to update the order status.
            // e.g. await $fetch(...);
        }
    },
})

// 9) Handle "Create Supplier Order" via CreateSupplierOrderModal
const isSupplierOrderModalOpen = ref(false)
function onCreateSupplierOrder() {
    isSupplierOrderModalOpen.value = true
}
function submitSupplierOrder(event: Event) {
    console.log('Supplier order submitted', event)
    isSupplierOrderModalOpen.value = false
}
function closeSupplierOrderModal() {
    isSupplierOrderModalOpen.value = false
}
</script>

<style scoped lang="scss">
.supplier-order-history-page {
    padding: 1rem;
    background-color: #fff;
}

/* HEADER */
.order-history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    .header-left {
        display: flex;
        align-items: center;
        gap: 2rem;

        .title {
            margin: 0;
            font-size: 28px;
        }
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
}

/* HEADER ACTIONS */
.header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;

    .search-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        label {
            font-weight: 600;
        }

        .global-search-input {
            width: 240px;
        }
    }
}

/* SUPPLIER ORDER TABLE */
.supplier-order-table-section {
    margin-bottom: 1rem;

    .supplier-order-table {
        margin-bottom: 1rem;
    }
}

/* ORDER ITEMS SECTION */
.order-items-section {
    margin-top: 1rem;

    .order-items-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .order-items-table {
        margin-bottom: 1rem;
    }

    /* Order status dropdown styling */
    .order-status-container {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        label {
            font-weight: 600;
        }

        .p-dropdown {
            width: 200px;
        }
    }
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .header-actions {
        flex-direction: column;
        align-items: flex-start;
    }

    .global-search-input {
        width: 100%;
    }
}
</style>