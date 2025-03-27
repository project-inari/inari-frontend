<template>
    <div class="warehouse-management-page">
        <!-- PAGE TITLE & ACTIONS -->
        <header class="wm-header">
            <h1>Warehouse Management</h1>
            <!-- Top Search + Action Buttons -->
            <div class="wm-header-actions">
                <PrimeInputText
                    v-model="topSearchKeyword"
                    placeholder="Search your business"
                    class="top-search-input"
                />
                <div class="wm-action-buttons">
                    <PrimeButton
                        label="Move Stock"
                        class="p-button-outlined p-button-sm move-stock-button"
                        icon="pi pi-external-link"
                        @click="onMoveStock"
                    />
                    <PrimeButton
                        label="Create +"
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
                v-for="(wh, index) in warehouseCards"
                :key="index"
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
                <h3>{{ wh.label }}</h3>
            </div>
        </section>

        <!-- SELECTED WAREHOUSE SECTION -->
        <section
            v-if="selectedWarehouse"
            class="selected-warehouse-section"
        >
            <h2>{{ selectedWarehouse.label }}</h2>

            <!-- Search bar for table items -->
            <div class="warehouse-search-bar">
                <PrimeInputText
                    v-model="tableSearchKeyword"
                    placeholder="Search your business"
                    class="warehouse-table-search"
                />
            </div>

            <!-- Inventory Table for the Selected Warehouse -->
            <PrimeDataTable
                :value="filteredData"
                :paginator="true"
                :rows="5"
                responsive-layout="scroll"
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
                <PrimeColumn
                    field="qty"
                    header="Stock Qty"
                />
                <PrimeColumn
                    field="value"
                    header="Stock Values"
                />
                <PrimeColumn header="Tags">
                    <template #body="slotProps">
                        <PrimeChip
                            v-for="(tag, idx) in slotProps.data.tags"
                            :key="idx"
                            :label="tag"
                            class="status-chip"
                        />
                    </template>
                </PrimeColumn>
            </PrimeDataTable>
        </section>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
});

// ----------------------
// 1) Top Search / Actions
// ----------------------
const topSearchKeyword = ref('');

// Example event handlers
function onMoveStock() {
    console.log('Move Stock clicked!');
    // Add your logic here
}
function onCreateNew() {
    console.log('Create + clicked!');
    // Add your logic here
}

// ----------------------
// 2) Warehouse Cards
// ----------------------
const warehouseCards = ref([
    {
        label: 'Archive',
        img: '/img/archive-icon.png',
    },
    {
        label: 'Warehouse 1',
        img: '/img/warehouse1-icon.png',
    },
    {
        label: 'Warehouse 2',
        img: '/img/warehouse2-icon.png',
    },
    {
        label: 'Warehouse 3',
        img: '/img/warehouse3-icon.png',
    },
    {
        label: 'Home Inventory',
        img: '/img/home-inventory-icon.png',
    },
]);

const selectedWarehouse = ref<any>(null);
function selectWarehouse(warehouse: any) {
    selectedWarehouse.value = warehouse;
}

// ----------------------
// 3) Table Data
// ----------------------
const tableSearchKeyword = ref('');

// Example data for demonstration
const warehouseItems = ref([
    {
        warehouse: 'Warehouse 1',
        sku: '001',
        img: '/img/heineken.png',
        item: 'Heineken Original',
        variant: '620 ml',
        qty: 288,
        value: 8640,
        tags: ['Alcohol', 'Heineken'],
    },
    {
        warehouse: 'Warehouse 1',
        sku: '002',
        img: '/img/heineken.png',
        item: 'Heineken Original',
        variant: '500 ml',
        qty: 120,
        value: 3600,
        tags: ['Alcohol'],
    },
    {
        warehouse: 'Warehouse 2',
        sku: '010',
        img: '/img/pringles.png',
        item: 'Pringles Sour Cream',
        variant: '300 g',
        qty: 200,
        value: 6000,
        tags: ['Snacks'],
    },
    {
        warehouse: 'Home Inventory',
        sku: '020',
        img: '/img/snowbeer.png',
        item: 'Snow Weizen',
        variant: '500 ml',
        qty: 60,
        value: 1800,
        tags: ['Beer', 'Alcohol'],
    },
]);

// Filter data based on selected warehouse + search
const filteredData = computed(() => {
    if (!selectedWarehouse.value) return [];
    const whLabel = selectedWarehouse.value.label;
    // Filter items that match the selected warehouse
    let data = warehouseItems.value.filter(item => item.warehouse === whLabel);

    // If there's a search keyword, filter further
    const keyword = tableSearchKeyword.value.toLowerCase();
    if (keyword) {
        data = data.filter(
            item =>
                item.item.toLowerCase().includes(keyword) ||
                item.sku.toLowerCase().includes(keyword),
        );
    }
    return data;
});
</script>

<style scoped lang="scss">
.warehouse-management-page {
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

        .top-search-input {
            width: 250px;
        }

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
</style>
