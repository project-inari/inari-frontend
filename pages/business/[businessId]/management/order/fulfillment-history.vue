<template>
    <div
        class="fulfillment-history-page"
        :class="fontDMSansPrompt"
    >
        <!-- HEADER -->
        <header class="page-header">
            <div class="header-left">
                <h1>Fulfillment History</h1>
            </div>
            <div class="header-right">
                <PrimeButton
                    label="Create Order"
                    icon="pi pi-plus"
                    @click="openCreateOrder"
                />
            </div>
        </header>

        <!-- SEARCH BAR -->
        <div class="header-actions">
            <div class="search-bar">
                <label>Search:</label>
                <PrimeInputText
                    v-model="searchKeyword"
                    placeholder="Search by Order ID..."
                    class="global-search-input"
                />
            </div>
        </div>

        <!-- FULFILLMENT TABLE (non‑selectable) -->
        <PrimeDataTable
            :value="filteredOrders"
            removable-sort
            scrollable
            scroll-height="300px"
            responsive-layout="scroll"
            class="order-table"
        >
            <PrimeColumn
                header="#"
                style="width: 3rem"
            >
                <template #body="p">{{ p.index + 1 }}</template>
            </PrimeColumn>
            <PrimeColumn
                field="orderId"
                header="Order ID"
                sortable
            />
            <PrimeColumn header="Date">
                <template #body="p">{{
                    new Date(p.data.orderedAt).toLocaleDateString()
                }}</template>
            </PrimeColumn>
            <PrimeColumn header="Order Status">
                <template #body="p">{{
                    getStatusName(p.data.statusId)
                }}</template>
            </PrimeColumn>
            <PrimeColumn header="Customer">
                <template #body="p">{{
                    getCustomerName(p.data.customerId)
                }}</template>
            </PrimeColumn>
            <PrimeColumn
                header="Shipping Method"
                field="shippingMethod"
            />
            <PrimeColumn header="Total Price">
                <template #body="p"
                    >{{ calculateOrderTotal(p.data) }} Baht</template
                >
            </PrimeColumn>
        </PrimeDataTable>

        <!-- CREATE ORDER MODAL -->
        <CreateNewOrderModal
            :is-opened="isCreateModalOpen"
            @update:visible="isCreateModalOpen = $event"
            @save="onOrderCreated"
        />
    </div>
</template>

<script lang="ts" setup>
import type { Customer } from '~/model/Customer';
import type { CustomerOrder } from '~/model/CustomerOrder';

definePageMeta({ layout: 'dashboard' });

const { fontDMSansPrompt } = useFontClass();
const currentBusinessStore = useCurrentBusinessStore();

// state
const searchKeyword = ref('');
const isCreateModalOpen = ref(false);

// fetch base data
const orders = ref<CustomerOrder[]>(
    await $fetch<CustomerOrder[]>(
        `/api/business/${currentBusinessStore.businessId}/order/list`,
    ),
);
const customers = ref<Customer[]>(
    await $fetch<Customer[]>(
        `/api/business/${currentBusinessStore.businessId}/order/customer/list`,
    ),
);
const statuses = ref<{ id: number; name: string }[]>(
    await $fetch<{ id: number; name: string }[]>(
        `/api/business/${currentBusinessStore.businessId}/order/status/list`,
    ),
);

// computed filtered list
const filteredOrders = computed(() => {
    return orders.value.filter(o => {
        if (
            searchKeyword.value &&
            !o.orderId.toLowerCase().includes(searchKeyword.value.toLowerCase())
        ) {
            return false;
        }
        return true;
    });
});

// lookup helpers
const getCustomerName = (id: number) =>
    customers.value.find(c => c.id === id)?.name ?? '–';
const getStatusName = (id: number) =>
    statuses.value.find(s => s.id === id)?.name ?? '–';

function calculateOrderTotal(o: CustomerOrder) {
    const itemsSum = o.items.reduce(
        (sum, i) => sum + i.quantity * i.pricePerUnit,
        0,
    );
    return itemsSum + (o.shippingFee || 0);
}

// open & handle new order modal
function openCreateOrder() {
    isCreateModalOpen.value = true;
}

function onOrderCreated(newOrder: CustomerOrder) {
    // prepend to history
    orders.value.unshift(newOrder);
    isCreateModalOpen.value = false;
}
</script>

<style scoped lang="scss">
.fulfillment-history-page {
    padding: 1rem;
    background: #fff;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h1 {
        font-size: 28px;
    }
}

.header-actions {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    .search-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .global-search-input {
            width: 240px;
        }
    }
}

.order-table {
    margin-bottom: 2rem;
}
</style>
