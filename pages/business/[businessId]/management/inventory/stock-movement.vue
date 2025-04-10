<template>
    <div class="stock-movement-page">
        <!-- TOP BAR: Search + Move Stock Button -->
        <div class="stock-movement-header">
            <PrimeInputText
                v-model="topSearch"
                placeholder="Search your business"
                class="stock-search-input"
            />
            <PrimeButton
                label="Move Stock"
                icon="pi pi-external-link"
                class="move-stock-button"
                @click="onMoveStock"
            />
        </div>

        <!-- MOVEMENT HISTORY TABLE -->
        <PrimeDataTable
            :value="filteredMovementData"
            scrollable
            class="movement-table"
        >
            <PrimeColumn
                field="dateTime"
                header="Date &amp; Time"
            />
            <PrimeColumn
                field="from"
                header="From"
            />
            <PrimeColumn
                field="to"
                header="To"
            />
            <PrimeColumn
                field="reason"
                header="Reason"
            />
            <PrimeColumn
                field="items"
                header="Items"
                :style="{ minWidth: '180px' }"
            />
            <PrimeColumn
                field="totalQty"
                header="Total Qty."
            />
        </PrimeDataTable>

        <CreateStockMovementModal
            v-model:visible="showCreateStockMovementModal"
            :isOpened="showCreateStockMovementModal"
        />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
});

// -------------------------
// 1) Movement Table
// -------------------------
const topSearch = ref('');
const movementData = ref([
    {
        dateTime: '10 Mar 2025',
        from: 'Warehouse 2',
        to: 'Warehouse 1',
        reason: 'Reason 1',
        items: 'Snow Weizen',
        totalQty: 10,
    },
    {
        dateTime: '9 Mar 2025',
        from: 'Warehouse 1',
        to: 'Home Inventory',
        reason: 'Reason 1',
        items: 'Hoegaarden Rose',
        totalQty: 10,
    },
    {
        dateTime: '8 Mar 2025',
        from: 'Home Inventory',
        to: 'Warehouse 2',
        reason: 'Reason 1',
        items: 'Heineken Original',
        totalQty: 15,
    },
    {
        dateTime: '7 Mar 2025',
        from: 'Home Inventory',
        to: 'Warehouse 1',
        reason: 'Reason 1',
        items: 'Heineken Original',
        totalQty: 20,
    },
    {
        dateTime: '6 Mar 2025',
        from: 'Warehouse 2',
        to: 'Warehouse 1',
        reason: 'Reason 1',
        items: 'Snow Weizen',
        totalQty: 10,
    },
    {
        dateTime: '5 Mar 2025',
        from: 'Home Inventory',
        to: 'Warehouse 1',
        reason: 'Reason 1',
        items: 'Heineken Original',
        totalQty: 10,
    },
]);

// Filter logic for the movement table
const filteredMovementData = computed(() => {
    const keyword = topSearch.value.toLowerCase();
    if (!keyword) return movementData.value;

    return movementData.value.filter(row => {
        return (
            row.dateTime.toLowerCase().includes(keyword) ||
            row.from.toLowerCase().includes(keyword) ||
            row.to.toLowerCase().includes(keyword) ||
            row.reason.toLowerCase().includes(keyword) ||
            row.items.toLowerCase().includes(keyword)
        );
    });
});

const showCreateStockMovementModal = ref(false);
function onMoveStock() {
    console.log('Move Stock clicked');
    showCreateStockMovementModal.value = true;
}

// -------------------------
// 2) Stock Table
// -------------------------
</script>

<style scoped lang="scss">
.stock-movement-page {
    background-color: #fff;
    padding: 1rem;
}

/* TOP BAR */
.stock-movement-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;

    .stock-search-input {
        width: 250px;
    }

    .move-stock-button {
        margin-left: auto;

        .p-button-icon-left {
            margin-right: 0.5rem;
        }
    }
}

/* MOVEMENT TABLE */
.movement-table {
    margin-bottom: 2rem;
}

/* SECOND SEARCH BAR */
.stock-table-search {
    margin-bottom: 1rem;

    .stock-search-input {
        width: 250px;
    }
}

/* STOCK TABLE */
.stock-table {
    margin-bottom: 2rem;
}

.item-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    img {
        border-radius: 4px;
    }
}
</style>
