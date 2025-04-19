<template>
    <div
        class="warehouse-management-page"
        :class="fontDMSansPrompt"
    >
        <!-- PAGE TITLE & ACTIONS -->
        <header class="wm-header">
            <h1>Warehouse</h1>
            <!-- Top Search + Action Buttons -->
            <div class="wm-header-actions">
                <div class="wm-action-buttons">
                    <PrimeButton
                        label="Create Warehouse"
                        class="p-button-sm create-button"
                        icon="pi pi-plus"
                        @click="onCreateNew"
                    />
                </div>
            </div>
        </header>

        <!-- WAREHOUSE CARDS -->
        <section class="warehouse-cards-container">
            <div
                v-for="wh in warehouseCards"
                :key="wh.id"
                class="warehouse-card"
                @click="selectWarehouse(wh)"
            >
                <NuxtImg
                    :src="wh.img"
                    alt="warehouse-icon"
                    class="warehouse-icon"
                    width="80"
                    height="80"
                />
                <h3>{{ wh.name }}</h3>
            </div>
        </section>

        <!-- SELECTED WAREHOUSE SECTION -->
        <section
            v-if="selectedWarehouse"
            class="selected-warehouse-section"
        >
            <h2>{{ selectedWarehouse.name }}</h2>

            <!-- Search bar for table items -->
            <div class="warehouse-search-bar">
                <PrimeInputText
                    v-model="tableSearchKeyword"
                    placeholder="Search inventory..."
                    class="warehouse-table-search"
                />
            </div>

            <!-- Inventory Table for the Selected Warehouse -->
            <PrimeDataTable
                :value="filteredData"
                scrollable
                class="warehouse-table"
            >
                <PrimeColumn
                    field="sku"
                    header="SKU"
                />
                <PrimeColumn header="Inventory Items">
                    <template #body="slotProps">
                        <div class="item-cell">
                            <NuxtImg
                                :src="slotProps.data.img"
                                alt="item-image"
                                width="40"
                                height="40"
                            />
                            <span>{{ slotProps.data.item }}</span>
                        </div>
                    </template>
                </PrimeColumn>
                <PrimeColumn
                    field="variant"
                    header="Variants"
                />
                <!-- Stock Qty from qtyInWarehouse -->
                <PrimeColumn header="Stock Qty">
                    <template #body="slotProps">
                        <span>{{ getWarehouseQty(slotProps.data) }}</span>
                    </template>
                </PrimeColumn>
                <PrimeColumn
                    field="purchasePrice"
                    header="Purchase Price"
                />
                <!-- Categories Column -->
                <PrimeColumn header="Categories">
                    <template #body="slotProps">
                        <div class="tags-cell">
                            <span>{{
                                getCategoryPath(slotProps.data.categoryId).join(
                                    ' → ',
                                )
                            }}</span>
                        </div>
                    </template>
                </PrimeColumn>
                <!-- Stock Value Column -->
                <PrimeColumn header="Stock Value">
                    <template #body="slotProps">
                        <span>{{ getWarehouseValue(slotProps.data) }}</span>
                    </template>
                </PrimeColumn>
                <!-- Tags Column with Colors -->
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
            </PrimeDataTable>
        </section>

        <CreateWarehouseModal v-model:visible="isCreateWarehouseModalOpen" />
    </div>
</template>

<script setup lang="ts">
import type { InventoryItem } from '~/model/InventoryItem';

definePageMeta({
    layout: 'dashboard',
});

const { fontDMSansPrompt } = useFontClass();
const currentBusinessStore = useCurrentBusinessStore();

/* ----------------------
   1) Top Search / Actions
---------------------- */
const topSearchKeyword = ref('');
const isCreateWarehouseModalOpen = ref(false);
function onCreateNew() {
    console.log('Create Warehouse clicked!');
    isCreateWarehouseModalOpen.value = true;
}

/* ----------------------
   2) Warehouse Cards
---------------------- */
// Fetch warehouse cards via API.
const warehouseList = await $fetch(
    `/api/business/${currentBusinessStore.businessId}/inventory/warehouse/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    },
);
const warehouseCards = ref(warehouseList);

const selectedWarehouse = ref<{ id: number; name: string } | null>(null);
function selectWarehouse(wh: { id: number; name: string }) {
    selectedWarehouse.value = { ...wh };
}

/* ----------------------
   3) Inventory Data (API)
---------------------- */
// Fetch inventory data from API as an array of InventoryItem.
const inventoryList = await $fetch<InventoryItem[]>(
    `/api/business/${currentBusinessStore.businessId}/inventory/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    },
);
const inventoryData = ref(inventoryList);

const categroiesList = await $fetch(
    `/api/business/${currentBusinessStore.businessId}/category/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    },
);

/* ----------------------
   4) Filtered Data
---------------------- */
// Filter inventory items based on selected warehouse using qtyInWarehouse.
const tableSearchKeyword = ref('');
const filteredData = computed(() => {
    if (!selectedWarehouse.value) return [];
    const whId = selectedWarehouse.value.id;
    let data = inventoryData.value.filter(item => {
        return (
            item.qtyInWarehouse &&
            item.qtyInWarehouse.some(
                wh => wh.warehouseId === whId && wh.qty > 0,
            )
        );
    });

    // Further filter by search keyword.
    const keyword = tableSearchKeyword.value.toLowerCase();
    if (keyword) {
        data = data.filter(item => {
            // Use getCategoryPath to get a category path array.
            const categoryPath = getCategoryPath(item.categoryId);
            const values = [
                item.sku,
                item.item,
                item.variant,
                item.brand,
                item.note,
                String(item.purchasePrice),
                String(item.sellingPrice),
                // For filtering, include the category path string values.
                ...categoryPath,
                ...item.tags.map(tag => tag.name),
            ];
            return values.some(v => v && v.toLowerCase().includes(keyword));
        });
    }
    return data;
});

/* ----------------------
   5) Warehouse Value & Quantity
---------------------- */
function getWarehouseQty(item: InventoryItem) {
    if (!selectedWarehouse.value) return 0;
    const whId = selectedWarehouse.value.id;
    const record = item.qtyInWarehouse?.find(wh => wh.warehouseId === whId);
    return record ? record.qty : 0;
}
function getWarehouseValue(item: InventoryItem) {
    if (!selectedWarehouse.value) return 0;
    const whId = selectedWarehouse.value.id;
    const record = item.qtyInWarehouse?.find(wh => wh.warehouseId === whId);
    return record ? record.qty * item.purchasePrice : 0;
}

/* ----------------------
   6) Last Updated & Refresh
---------------------- */
const lastUpdated = ref(new Date().toLocaleString());
function refreshData() {
    lastUpdated.value = new Date().toLocaleString();
    // Optionally, re-fetch inventory data
}

function getCategoryPath(categoryId: number): string[] {
    const cat = categroiesList.find((c: any) => c.id === categoryId);
    if (!cat) return [];
    const path: string[] = [];
    function buildPath(c: any) {
        if (c.parentCategoryId) {
            const parent = categroiesList.find(
                (p: any) => p.id === c.parentCategoryId,
            );
            if (parent) {
                buildPath(parent);
            }
        }
        path.push(c.name);
    }
    buildPath(cat);
    return path;
}
</script>

<style scoped lang="scss">
.inventory-manager-page {
    padding: 1rem;
    background-color: #fff;
}

/* HEADER */
.wm-header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;

    h1 {
        margin: 0;
        font-size: 28px;
    }

    .wm-header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;

        .wm-action-buttons {
            margin-left: auto;
            display: flex;
            gap: 0.5rem;
        }
    }
}

/* WAREHOUSE CARDS */
.warehouse-cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
    justify-content: center;
}

.warehouse-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    width: 160px;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: box-shadow 0.2s;
    text-align: center;
    background-color: #fefefe;

    &:hover {
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .warehouse-icon {
        margin-bottom: 0.5rem;
    }

    h3 {
        margin: 0;
        font-size: 16px;
    }
}

/* SELECTED WAREHOUSE SECTION */
.selected-warehouse-section {
    margin-top: 1rem;

    h2 {
        margin-bottom: 0.5rem;
        font-size: 24px;
    }

    .warehouse-search-bar {
        display: flex;
        margin-bottom: 1rem;

        .warehouse-table-search {
            width: 250px;
        }
    }

    .warehouse-table {
        margin-bottom: 2rem;
    }
}

/* TABLE ITEM CELL */
.item-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    img {
        border-radius: 4px;
    }
}

.status-chip {
    margin-right: 4px;
    margin-top: 4px;
}

.tags-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
}
</style>
