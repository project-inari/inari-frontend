<template>
    <div
        class="order-manager-page"
        :class="fontDMSansPrompt"
    >
        <!-- HEADER -->
        <header class="order-manager-header">
            <div class="header-left">
                <h1>Order Manager</h1>
            </div>
            <div class="header-right">
                <PrimeButton
                    label="Create Order"
                    icon="pi pi-plus"
                    class="create-order-button"
                    @click="onCreateOrder"
                />
            </div>
        </header>

        <!-- SEARCH & FILTER BAR -->
        <div class="header-actions">
            <div class="search-bar">
                <label>Search Orders:</label>
                <PrimeInputText
                    v-model="searchKeyword"
                    placeholder="Search by ID..."
                    class="global-search-input"
                />
            </div>
            <div class="filter-bar">
                <label>Channel:</label>
                <PrimeDropdown
                    v-model="selectedChannel"
                    :options="channels"
                    option-label="name"
                    option-value="id"
                    placeholder="All Channels"
                    show-clear
                />
                <label>Status:</label>
                <PrimeDropdown
                    v-model="selectedStatusFilter"
                    :options="statuses"
                    option-label="name"
                    option-value="id"
                    placeholder="All Statuses"
                    show-clear
                />
            </div>
        </div>

        <!-- ORDERS TABLE -->
        <PrimeDataTable
            v-model:selection="selectedOrder"
            :value="filteredOrders"
            selection-mode="single"
            removable-sort
            scrollable
            scroll-height="300px"
            responsive-layout="scroll"
            class="order-table"
        >
            <PrimeColumn header="#">
                <template #body="p">{{ p.index + 1 }}</template>
            </PrimeColumn>
            <PrimeColumn
                field="orderId"
                header="Order ID"
                sortable
            />
            <PrimeColumn header="Ordered At">
                <template #body="p">{{
                    new Date(p.data.orderedAt).toLocaleString()
                }}</template>
            </PrimeColumn>
            <PrimeColumn header="Customer">
                <template #body="p">{{
                    getCustomerName(p.data.customerId)
                }}</template>
            </PrimeColumn>
            <PrimeColumn header="Order Status">
                <template #body="p">{{
                    getStatusName(p.data.statusId)
                }}</template>
            </PrimeColumn>
            <PrimeColumn header="Channel">
                <template #body="p">{{
                    getChannelName(p.data.channelId)
                }}</template>
            </PrimeColumn>
            <PrimeColumn
                field="shippingMethod"
                header="Shipping Method"
            />
            <PrimeColumn header="Total Price">
                <template #body="p"
                    >{{ calculateOrderTotal(p.data) }} Baht</template
                >
            </PrimeColumn>
        </PrimeDataTable>

        <!-- DYNAMIC DISPLAY -->
        <section
            v-if="selectedOrder"
            class="dynamic-display-section"
        >
            <div class="dynamic-display-header">
                <h3>Order Information</h3>
            </div>
            <div class="dynamic-display-card">
                <!-- Left: Customer details -->
                <div class="dynamic-display-left">
                    <div class="info-row">
                        <label>Full Name:</label
                        ><span>{{ selectedCustomer?.name }}</span>
                    </div>
                    <div class="info-row">
                        <label>Tel:</label
                        ><span>{{ selectedCustomer?.phoneNo }}</span>
                    </div>
                    <div class="info-row">
                        <label>Address:</label
                        ><span>{{ selectedCustomer?.address }}</span>
                    </div>
                </div>

                <!-- Right: Items + summary -->
                <div class="dynamic-display-right">
                    <PrimeDataTable
                        :value="selectedOrder.items"
                        scrollable
                        scroll-height="200px"
                        class="order-items-table"
                    >
                        <PrimeColumn header="#"
                            ><template #body="p">{{
                                p.index + 1
                            }}</template></PrimeColumn
                        >
                        <PrimeColumn header="Image">
                            <template #body="p">
                                <NuxtImg
                                    v-if="getProduct(p.data.variantId)"
                                    :src="getProduct(p.data.variantId)!.img"
                                    width="40"
                                    height="40"
                                />
                            </template>
                        </PrimeColumn>
                        <PrimeColumn header="SKU">
                            <template #body="p">{{
                                getProduct(p.data.variantId)?.sku
                            }}</template>
                        </PrimeColumn>
                        <PrimeColumn header="Inventory Item">
                            <template #body="p">{{
                                getProduct(p.data.variantId)?.item
                            }}</template>
                        </PrimeColumn>
                        <PrimeColumn header="Variant">
                            <template #body="p">{{
                                getProduct(p.data.variantId)?.variant
                            }}</template>
                        </PrimeColumn>
                        <PrimeColumn
                            field="quantity"
                            header="Quantity"
                        />
                        <PrimeColumn
                            field="pricePerUnit"
                            header="Price/unit"
                        />
                        <PrimeColumn header="Subtotal">
                            <template #body="p"
                                >{{
                                    p.data.quantity * p.data.pricePerUnit
                                }}
                                Baht</template
                            >
                        </PrimeColumn>
                    </PrimeDataTable>

                    <div class="summary-info">
                        <div class="line">
                            <label>Shipping Fee:</label
                            ><strong
                                >{{ selectedOrder.shippingFee }} Baht</strong
                            >
                        </div>
                        <div class="line">
                            <label>Total Price:</label
                            ><strong
                                >{{
                                    calculateOrderTotal(selectedOrder)
                                }}
                                Baht</strong
                            >
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CreateOrder Modal -->
        <CreateNewOrderModal
            :is-opened="isCreateModalOpen"
            @update:visible="isCreateModalOpen = $event"
            @save="onOrderCreated"
        />
    </div>
</template>

<script setup lang="ts">
import type { CustomerOrder } from '~/model/CustomerOrder';
import CreateNewOrderModal from '~/components/CreateNewOrderModal.vue';
import type { Customer } from '~/model/Customer';
import type { InventoryItem } from '~/model/InventoryItem';

definePageMeta({ layout: 'dashboard' });

const { fontDMSansPrompt } = useFontClass();
const currentBusinessStore = useCurrentBusinessStore();

// state
const searchKeyword = ref('');
const selectedChannel = ref<number | null>(null);
const selectedStatusFilter = ref<number | null>(null);
const selectedOrder = ref<CustomerOrder | null>(null);
const selectedCustomer = ref<Customer | null>(null);

// modal flag
const isCreateModalOpen = ref(false);

// fetch data
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
const channels = ref<{ id: number; name: string }[]>(
    await $fetch<{ id: number; name: string }[]>(
        `/api/business/${currentBusinessStore.businessId}/order/channel/list`,
    ),
);
const productList = ref<InventoryItem[]>(
    await $fetch<InventoryItem[]>(
        `/api/business/${currentBusinessStore.businessId}/inventory/list`,
    ),
);

// filtered view
const filteredOrders = computed(() => {
    return orders.value.filter(o => {
        if (
            searchKeyword.value &&
            !o.orderId.toLowerCase().includes(searchKeyword.value.toLowerCase())
        )
            return false;
        if (selectedChannel.value && o.channelId !== selectedChannel.value)
            return false;
        if (
            selectedStatusFilter.value &&
            o.statusId !== selectedStatusFilter.value
        )
            return false;
        return true;
    });
});

// lookup selected customer
watch(selectedOrder, o => {
    selectedCustomer.value =
        customers.value.find(c => c.id === o?.customerId) || null;
});

// lookups
const getCustomerName = (id: number) =>
    customers.value.find(c => c.id === id)?.name ?? '–';
const getStatusName = (id: number) =>
    statuses.value.find(s => s.id === id)?.name ?? '–';
const getChannelName = (id: number) =>
    channels.value.find(c => c.id === id)?.name ?? '–';
const getProduct = (vid: number) => productList.value.find(p => p.id === vid);

// total calc
function calculateOrderTotal(o: CustomerOrder) {
    const itemsTotal = o.items.reduce(
        (sum, i) => sum + i.quantity * i.pricePerUnit,
        0,
    );
    return itemsTotal + (o.shippingFee || 0);
}

// when new order is saved
function onOrderCreated(newOrder: CustomerOrder) {
    orders.value.unshift(newOrder); // add to list
    isCreateModalOpen.value = false; // close modal
}

// Create Order button
function onCreateOrder() {
    isCreateModalOpen.value = true;
}
</script>

<style scoped lang="scss">
.order-manager-page {
    padding: 1rem;
    background: #fff;
}

.order-manager-header {
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
    gap: 1rem;
    margin-bottom: 1rem;

    .global-search-input {
        width: 240px;
    }
}

.filter-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    label {
        font-weight: 600;
    }

    .p-dropdown {
        width: 180px;
    }
}

.order-table {
    margin-bottom: 2rem;
}

.dynamic-display-section {
    border-top: 1px solid #ddd;
    padding-top: 1rem;
}

.dynamic-display-card {
    display: flex;
    gap: 2rem;
}

.dynamic-display-left,
.dynamic-display-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.info-row {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;

    label {
        width: 140px;
        font-weight: 600;
    }
}

.summary-info {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .line {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;

        label {
            width: 140px;
            font-weight: 600;
        }
    }
}
</style>
