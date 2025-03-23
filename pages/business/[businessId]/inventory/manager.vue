<template>
    <div class="inventory-manager-page">
        <!-- Title and Header Actions -->
        <header class="inventory-header">
            <div class="header-left">
                <h1>Inventory Manager</h1>

                <!-- Example: Category Tabs -->
                <div class="header-tabs">
                    <PrimeButton
                        label="All Stock"
                        class="p-button-text"
                    />
                    <PrimeButton
                        label="Beverage"
                        class="p-button-text"
                    />
                    <PrimeButton
                        label="Snacks"
                        class="p-button-text"
                    />
                </div>
            </div>

            <div class="header-right">
                <!-- Search Bar -->
                <PrimeInputText
                    v-model="searchKeyword"
                    placeholder="Search your items"
                    class="search-input"
                />
                <!-- Add Stock Button -->
                <PrimeButton
                    label="Add Stock"
                    icon="pi pi-plus"
                    class="add-stock-button"
                    @click="onAddStock"
                />
            </div>
        </header>

        <!-- Filter Bar & Sort Dropdown -->
        <div class="filter-bar">
            <label class="filter-label">Filter:</label>
            <PrimeButton
                label="All Stock"
                class="p-button-text p-button-sm"
            />
            <PrimeButton
                label="Beverage"
                class="p-button-text p-button-sm"
            />
            <PrimeButton
                label="Snacks"
                class="p-button-text p-button-sm"
            />

            <div class="sort-section">
                <span class="sort-label">SORT BY</span>
                <PrimeDropdown
                    v-model="selectedSort"
                    :options="sortOptions"
                    option-label="label"
                    class="sort-dropdown"
                />
            </div>
        </div>

        <!-- Inventory Table -->
        <PrimeDataTable
            :value="inventoryData"
            :paginator="true"
            :rows="5"
            responsive-layout="scroll"
            class="inventory-table"
        >
            <PrimeColumn
                field="sku"
                header="SKU"
            />
            <PrimeColumn header="Inventory Items">
                <template #body="slotProps">
                    <div class="item-cell">
                        <!-- Example: show product image if you have one -->
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
            <PrimeColumn header="">
                <template #body="slotProps">
                    <!-- Show tags as chips -->
                    <PrimeChip
                        v-for="(tag, idx) in slotProps.data.tags"
                        :key="idx"
                        :label="tag"
                        class="status-chip"
                    />
                </template>
            </PrimeColumn>
        </PrimeDataTable>

        <!-- Dynamic Display Section -->
        <section class="dynamic-display-section">
            <div class="dynamic-display-header">
                <h3>Dynamic Display</h3>
                <p class="last-updated">Last Updated: {{ lastUpdated }}</p>
            </div>

            <div class="dynamic-display-card">
                <!-- Example: Product Image -->
                <NuxtImg
                    :src="selectedItem.img"
                    alt="selected-item"
                    class="dynamic-item-img"
                    width="80"
                    height="80"
                />

                <!-- Details & Inputs -->
                <div class="dynamic-item-details">
                    <div class="form-row">
                        <label>Item:</label>
                        <PrimeInputText v-model="selectedItem.item" />
                    </div>
                    <div class="form-row">
                        <label>Variant:</label>
                        <PrimeInputText v-model="selectedItem.variant" />
                    </div>
                    <div class="form-row">
                        <label>SKU:</label>
                        <PrimeInputText v-model="selectedItem.sku" />
                    </div>

                    <div class="info-row">
                        <label>Category:</label>
                        <span>{{ selectedItem.category }}</span>
                    </div>
                    <div class="info-row">
                        <label>Stock Qty:</label>
                        <span>{{ selectedItem.qty }}</span>
                    </div>
                    <div class="info-row">
                        <label>Average Purchase Price:</label>
                        <span>{{ selectedItem.avgPrice }}</span>
                    </div>

                    <div class="form-row">
                        <label>Note:</label>
                        <PrimeInputText v-model="selectedItem.note" />
                    </div>

                    <div class="dropdown-row">
                        <PrimeDropdown
                            v-model="selectedWarehouse"
                            :options="warehouseOptions"
                            option-label="label"
                            placeholder="Warehouse"
                        />
                        <PrimeDropdown
                            v-model="selectedStore"
                            :options="storeOptions"
                            option-label="label"
                            placeholder="Store"
                        />
                    </div>

                    <PrimeButton
                        label="Add Stock"
                        icon="pi pi-plus"
                        class="p-button-success"
                    />
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
});

// Search bar
const searchKeyword = ref('');

// Sorting
const sortOptions = ref([
    { label: 'SKU', value: 'sku' },
    { label: 'Name', value: 'item' },
    { label: 'Stock Qty', value: 'qty' },
    { label: 'Stock Value', value: 'value' },
]);
const selectedSort = ref(null);

// Inventory Table Data
const inventoryData = ref([
    {
        sku: '001',
        img: '/img/heineken.png',
        item: 'Heineken Original',
        variant: '330 ml',
        qty: 288,
        value: 8640,
        tags: ['In Stock'],
    },
    {
        sku: '002',
        img: '/img/heineken.png',
        item: 'Heineken Original',
        variant: '500 ml',
        qty: 120,
        value: 3600,
        tags: ['In Stock'],
    },
    {
        sku: '003',
        img: '/img/hoegaarden.png',
        item: 'Hoegaarden Rose',
        variant: '250 ml',
        qty: 150,
        value: 3750,
        tags: ['Low Stock'],
    },
    {
        sku: '004',
        img: '/img/snowbeer.png',
        item: 'Snow Weizen',
        variant: '490 ml',
        qty: 80,
        value: 2400,
        tags: ['Crispy'],
    },
    {
        sku: '006',
        img: '/img/pringles.png',
        item: 'Pringles Sour Cream',
        variant: '300 g',
        qty: 300,
        value: 9000,
        tags: ['In Stock'],
    },
]);

// Last Updated
const lastUpdated = ref('January 2025 10:10 AM');

// Example: currently selected item for the Dynamic Display
const selectedItem = ref({
    img: '/img/heineken.png',
    sku: '001',
    item: 'Heineken Original',
    variant: '620 ml',
    category: 'Beer',
    qty: 288,
    avgPrice: '30 THB',
    note: 'Heineken Original Beer at 620 ml',
});

// Warehouse / Store dropdowns
const warehouseOptions = ref([
    { label: 'Warehouse 1', value: 'w1' },
    { label: 'Warehouse 2', value: 'w2' },
]);
const selectedWarehouse = ref(null);

const storeOptions = ref([
    { label: 'Store A', value: 'storeA' },
    { label: 'Store B', value: 'storeB' },
]);
const selectedStore = ref(null);

// Example event
function onAddStock() {
    console.log('Add Stock button clicked!');
    // Implement your logic here
}
</script>

<style scoped lang="scss">
.inventory-manager-page {
    padding: 1rem;
    background-color: #fff;
}

/* HEADER */
.inventory-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 2rem;

    h1 {
        margin: 0;
        font-size: 28px;
    }
}

.header-tabs {
    display: flex;
    gap: 0.5rem;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.search-input {
    width: 200px;
}

.add-stock-button {
    .p-button-icon-left {
        margin-right: 0.5rem;
    }
}

/* FILTER BAR */
.filter-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .filter-label {
        font-weight: 600;
    }

    .sort-section {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .sort-label {
        font-weight: 600;
    }

    .sort-dropdown {
        width: 120px;
    }
}

/* TABLE */
.inventory-table {
    margin-bottom: 1rem;
}

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

/* DYNAMIC DISPLAY SECTION */
.dynamic-display-section {
    border-top: 1px solid #ddd;
    padding-top: 1rem;
}

.dynamic-display-header {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.last-updated {
    font-size: 14px;
    color: #777;
}

.dynamic-display-card {
    display: flex;
    gap: 1rem;
    background-color: #fefefe;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.dynamic-item-img {
    border-radius: 4px;
}

.dynamic-item-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
}

.form-row,
.info-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.dropdown-row {
    display: flex;
    gap: 0.5rem;
}
</style>
