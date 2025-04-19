<template>
    <div>
        <!-- Main Dialog for Stock Movement -->
        <PrimeDialog
            v-model:visible="visible"
            maximizable
            modal
            header="Stock Movement"
            :style="{ width: '70rem' }"
            :class="fontDMSansPrompt"
        >
            <!-- Movement Info Fields -->
            <div class="movement-form">
                <div class="movement-field">
                    <label>Reason:</label>
                    <PrimeInputText
                        v-model="movementData.reason"
                        placeholder="Enter reason"
                    />
                </div>
                <div class="movement-field">
                    <label>From Warehouse:</label>
                    <PrimeDropdown
                        v-model="movementData.fromWarehouseId"
                        :options="warehouseOptions"
                        option-label="name"
                        option-value="id"
                        placeholder="Select Source Warehouse"
                    />
                </div>
                <div class="movement-field">
                    <label>To Warehouse:</label>
                    <PrimeDropdown
                        v-model="movementData.toWarehouseId"
                        :options="warehouseOptions"
                        option-label="name"
                        option-value="id"
                        placeholder="Select Destination Warehouse"
                    />
                </div>
                <div class="movement-field date-time-row">
                    <div class="date-field">
                        <label>Date:</label>
                        <PrimeCalendar
                            v-model="movementData.movementDate"
                            date-format="yy-mm-dd"
                            placeholder="Select date"
                        />
                    </div>
                    <div class="time-field">
                        <label>Time:</label>
                        <PrimeCalendar
                            v-model="movementData.movementTime"
                            time-only
                            hour-format="24"
                            placeholder="Select time"
                        />
                    </div>
                </div>
                <div class="movement-field">
                    <label>Note:</label>
                    <PrimeInputText
                        v-model="movementData.note"
                        placeholder="Additional notes..."
                    />
                </div>
            </div>

            <!-- Action Bar for Searching or Adding Items -->
            <div class="action-bar">
                <div>
                    <label>Search:</label>
                    <PrimeInputText
                        v-model="searchKeyword"
                        placeholder="Type to search any field..."
                        class="global-search-input"
                    />
                </div>
                <div class="action-buttons">
                    <PrimeButton
                        label="Add Item"
                        class="add-item"
                        severity="primary"
                        @click="openAddItemModal"
                    />
                </div>
            </div>

            <!-- Table for Selected Items to Move -->
            <PrimeDataTable
                :value="movementItems"
                removable-sort
                scrollable
                scroll-height="300px"
                responsive-layout="scroll"
                class="inventory-table"
                :class="fontDMSansPrompt"
            >
                <PrimeColumn
                    field="sku"
                    header="SKU"
                    sortable
                />
                <PrimeColumn header="Inventory Items">
                    <template #body="slotProps">
                        <span>{{ slotProps.data.item }}</span>
                    </template>
                </PrimeColumn>
                <PrimeColumn
                    field="variant"
                    header="Variants"
                    sortable
                />
                <PrimeColumn header="Stock Qty">
                    <template #body="slotProps">
                        <span>{{
                            calculateTotalStockQty(slotProps.data)
                        }}</span>
                    </template>
                </PrimeColumn>
                <PrimeColumn header="Stock Values">
                    <template #body="slotProps">
                        <span>{{
                            slotProps.data.purchasePrice *
                            calculateTotalStockQty(slotProps.data)
                        }}</span>
                    </template>
                </PrimeColumn>
                <PrimeColumn
                    field="moveQty"
                    header="To Move Qty"
                    sortable
                >
                    <template #body="slotProps">
                        <PrimeInputNumber
                            v-model="slotProps.data.moveQty"
                            show-buttons
                            :min="0"
                            fluid
                        />
                    </template>
                </PrimeColumn>
                <PrimeColumn header="Tags">
                    <template #body="slotProps">
                        <div class="tags-cell">
                            <PrimeTag
                                v-for="(tag, idx) in slotProps.data.tags"
                                :key="idx"
                                :value="tag.name"
                                :severity="getTagColor(tag)"
                                class="status-tag"
                            />
                        </div>
                    </template>
                </PrimeColumn>
                <PrimeColumn>
                    <template #body="slotProps">
                        <PrimeButton
                            icon="pi pi-times"
                            outlined
                            severity="danger"
                            @click="removeItem(slotProps.data)"
                        />
                    </template>
                </PrimeColumn>
            </PrimeDataTable>

            <!-- Footer Buttons -->
            <div class="footer-actions">
                <PrimeButton
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-text p-button-danger"
                    @click="onCancel"
                />
                <PrimeButton
                    label="Move"
                    icon="pi pi-check"
                    @click="onSubmitStockMovement"
                />
            </div>
        </PrimeDialog>

        <!-- Add Item Dialog -->
        <PrimeDialog
            v-model:visible="isAddItemModalVisible"
            modal
            header="Select Item from Warehouse"
            :class="fontDMSansPrompt"
        >
            <!-- Table of Available Items -->
            <PrimeDataTable
                v-model:selection="itemToAddSelected"
                :value="allItemsList"
                selection-mode="multiple"
                data-key="id"
                removable-sort
                scrollable
                scroll-height="400px"
                responsive-layout="scroll"
                class="inventory-table"
                :class="fontDMSansPrompt"
            >
                <PrimeColumn
                    selection-mode="multiple"
                    header-style="width: 3rem"
                />
                <PrimeColumn
                    field="sku"
                    header="SKU"
                    sortable
                />
                <PrimeColumn header="Image">
                    <template #body="slotProps">
                        <NuxtImg
                            :src="slotProps.data.img"
                            alt="item-image"
                            width="40"
                            height="40"
                        />
                    </template>
                </PrimeColumn>
                <PrimeColumn
                    header="Item"
                    sortable
                >
                    <template #body="slotProps">
                        <span>{{ slotProps.data.item }}</span>
                    </template>
                </PrimeColumn>
                <PrimeColumn
                    field="variant"
                    header="Variants"
                    sortable
                />
                <PrimeColumn
                    field="qty"
                    header="Stock Qty"
                    sortable
                />
            </PrimeDataTable>

            <PrimeButton
                label="Add Selected Items"
                class="submit-add-item-button"
                severity="primary"
                @click="onSubmitAddItem"
            />
        </PrimeDialog>
    </div>
</template>

<script lang="ts" setup>
import type { InventoryItem } from '~/model/InventoryItem';

// Example: modal props for v-model binding
const props = defineProps({
    isOpened: Boolean,
});
const emit = defineEmits(['update:visible']);

const visible = computed({
    get: () => props.isOpened,
    set: (val: boolean) => emit('update:visible', val),
});

const { fontDMSansPrompt } = useFontClass();
const currentBusinessStore = useCurrentBusinessStore();

// Stock movement form data
const movementData = reactive({
    reason: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    movementDate: null as Date | null,
    movementTime: null as Date | null,
    moveQty: 0,
    note: '',
});

// List of available warehouses
const warehouseList = await $fetch(
    `/api/business/${currentBusinessStore.businessId}/inventory/warehouse/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    },
).catch(() => []);
const warehouseOptions = ref(warehouseList);

// The main list of selected items for the stock movement
const movementItems = ref<InventoryItem[]>([]);

// For the "Add Item" flow
const isAddItemModalVisible = ref(false);
const itemToAddSelected = ref<InventoryItem[]>([]);
const allItemsList = ref<InventoryItem[]>([]);
const searchKeyword = ref('');

// Example function to fetch all items from an API
async function callGetAllItemsList() {
    const res = await $fetch(
        `/api/business/${currentBusinessStore.businessId}/inventory/list`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        },
    ).catch(() => []);
    allItemsList.value = res;
}

// Open "Add Item" modal
function openAddItemModal() {
    callGetAllItemsList();
    isAddItemModalVisible.value = true;
}

// Add the selected items
function onSubmitAddItem() {
    itemToAddSelected.value.forEach(item => {
        // If not already in the movementItems list, push it
        if (!movementItems.value.some(i => i.id === item.id)) {
            movementItems.value.push({ ...item });
        }
    });
    itemToAddSelected.value = [];
    isAddItemModalVisible.value = false;
}

// Remove an item from the movementItems list
function removeItem(item: InventoryItem) {
    const idx = movementItems.value.findIndex(i => i.id === item.id);
    if (idx !== -1) movementItems.value.splice(idx, 1);
}

// Calculate total stock quantity from qtyInWarehouse
function calculateTotalStockQty(item: InventoryItem): number {
    return item.qtyInWarehouse?.reduce((sum, wh) => sum + wh.qty, 0) || 0;
}

// Cancel button in the main modal
function onCancel() {
    visible.value = false;
}

// Final submission to move stock
function onSubmitStockMovement() {
    // Example: build a payload with movementData + items, then call an API
    const payload = {
        reason: movementData.reason,
        fromWarehouseId: movementData.fromWarehouseId,
        toWarehouseId: movementData.toWarehouseId,
        movementDate: movementData.movementDate,
        movementTime: movementData.movementTime,
        moveQty: movementData.moveQty,
        note: movementData.note,
        items: movementItems.value.map(i => ({
            itemId: i.id,
            sku: i.sku,
            quantity: calculateTotalStockQty(i),
        })),
    };
    console.log('Submitting stock movement:', payload);
    // Optionally call an API:
    // await $fetch(`/api/business/${currentBusinessStore.businessId}/inventory/stock-movement`, {
    //   method: 'POST',
    //   body: payload
    // })
    // Clear fields & close
    movementItems.value = [];
    movementData.reason = '';
    movementData.fromWarehouseId = '';
    movementData.toWarehouseId = '';
    movementData.movementDate = null;
    movementData.movementTime = null;
    movementData.moveQty;
    movementData.note = '';
    visible.value = false;
}
</script>

<style scoped lang="scss">
.item-detail-dialog-container {
    width: 70rem;
}

.movement-form {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;

    .movement-field {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    .date-time-row {
        display: flex;
        gap: 1rem;

        .date-field,
        .time-field {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
        }
    }
}

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

.inventory-table {
    margin-bottom: 1rem;
}

.footer-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.placeholder-image {
    width: 40px;
    height: 40px;
    background: #eee;
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
}

.tags-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.status-tag {
    margin-right: 4px;
    margin-top: 4px;
}

.submit-add-item-button {
    margin-top: 1rem;
}

.movement-form label {
    font-weight: 600;
    margin-bottom: 0.2rem;
}
</style>
