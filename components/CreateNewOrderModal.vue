<template>
    <div>
        <!-- Main Dialog -->
        <PrimeDialog
            v-model:visible="visible"
            maximizable
            modal
            header="Create New Order"
            :style="{ width: '70rem' }"
            :class="fontDMSansPrompt"
            :closable="true"
            :dismissable-mask="true"
        >
            <!-- Customer / Channel / Status / Shipping -->
            <div class="action-bar">
                <div class="form-row">
                    <label>Customer:</label>
                    <PrimeDropdown
                        v-model="form.customerId"
                        :options="customers"
                        option-label="name"
                        option-value="id"
                        placeholder="Select Customer"
                        class="customer-dropdown"
                    />
                    <PrimeButton
                        label="New Customer"
                        icon="pi pi-user-plus"
                        class="p-button-text"
                        @click="isCreateCustomerModalVisible = true"
                    />
                </div>
                <div class="form-row">
                    <label>Channel:</label>
                    <PrimeDropdown
                        v-model="form.channelId"
                        :options="channels"
                        option-label="name"
                        option-value="id"
                        placeholder="Select Channel"
                    />
                </div>
                <div class="form-row">
                    <label>Status:</label>
                    <PrimeDropdown
                        v-model="form.statusId"
                        :options="statuses"
                        option-label="name"
                        option-value="id"
                        placeholder="Select Status"
                    />
                </div>
                <div class="form-row">
                    <label>Ship Method:</label>
                    <PrimeInputText
                        v-model="form.shippingMethod"
                        placeholder="e.g. Standard"
                    />
                </div>
                <div class="form-row">
                    <label>Shipping Fee:</label>
                    <PrimeInputNumber
                        v-model="form.shippingFee"
                        :min="0"
                        placeholder="0"
                    />
                </div>
                <div class="form-row">
                    <label>Shipping Cost:</label>
                    <PrimeInputNumber
                        v-model="form.shippingCost"
                        :min="0"
                        placeholder="0"
                    />
                </div>
            </div>

            <!-- Search & Add Items -->
            <div class="action-bar">
                <div class="form-row">
                    <label>Search Items:</label>
                    <PrimeInputText
                        v-model="searchKeyword"
                        placeholder="Filter inventory..."
                    />
                </div>
                <div class="action-buttons">
                    <PrimeButton
                        label="Create New Item"
                        outlined
                        severity="primary"
                        @click="isCreateItemModalVisible = true"
                    />
                    <PrimeButton
                        label="Add Item"
                        severity="primary"
                        @click="openAddItemModal"
                    />
                </div>
            </div>

            <!-- Items Table -->
            <PrimeDataTable
                :value="form.items"
                removable-sort
                scrollable
                scroll-height="300px"
                responsive-layout="scroll"
                class="inventory-table"
            >
                <PrimeColumn
                    header="#"
                    style="width: 3rem"
                >
                    <template #body="p">{{ p.index + 1 }}</template>
                </PrimeColumn>
                <PrimeColumn header="Image">
                    <template #body="p">
                        <img
                            :src="getProduct(p.data.variantId)?.img"
                            alt="Product"
                            width="50"
                        />
                    </template>
                </PrimeColumn>
                <PrimeColumn header="SKU">
                    <template #body="p">{{
                        getProduct(p.data.variantId)?.sku
                    }}</template>
                </PrimeColumn>
                <PrimeColumn header="Item">
                    <template #body="p">{{
                        getProduct(p.data.variantId)?.item
                    }}</template>
                </PrimeColumn>
                <PrimeColumn header="Variant">
                    <template #body="p">{{
                        getProduct(p.data.variantId)?.variant
                    }}</template>
                </PrimeColumn>
                <PrimeColumn header="Qty">
                    <template #body="p">
                        <PrimeInputNumber
                            v-model="p.data.quantity"
                            :min="1"
                            show-buttons
                            size="small"
                        />
                    </template>
                </PrimeColumn>
                <PrimeColumn header="Price/Unit">
                    <template #body="p">
                        <PrimeInputNumber
                            v-model="p.data.pricePerUnit"
                            :min="0"
                            show-buttons
                            size="small"
                        />
                    </template>
                </PrimeColumn>
                <PrimeColumn header="Discount/Unit">
                    <template #body="p">
                        <PrimeInputNumber
                            v-model="p.data.discountPerUnit"
                            :min="0"
                            show-buttons
                            size="small"
                        />
                    </template>
                </PrimeColumn>
                <PrimeColumn header="Total">
                    <template #body="p">{{ lineTotal(p.data) }} Baht</template>
                </PrimeColumn>
                <PrimeColumn style="width: 3rem">
                    <template #body="p">
                        <PrimeButton
                            icon="pi pi-times"
                            outlined
                            severity="danger"
                            size="small"
                            @click="removeItem(p.data)"
                        />
                    </template>
                </PrimeColumn>
            </PrimeDataTable>

            <!-- Grand Total and Submit -->
            <div class="total-row">
                <span class="label">Grand Total:</span>
                <span class="value">{{ grandTotal }} Baht</span>
            </div>
            <PrimeButton
                label="Submit Order"
                class="mt-4"
                @click="submit()"
            />
        </PrimeDialog>

        <!-- New Customer Dialog -->
        <PrimeDialog
            v-model:visible="isCreateCustomerModalVisible"
            modal
            header="New Customer"
            :class="fontDMSansPrompt"
            :closable="true"
            :dismissable-mask="true"
        >
            <div class="form-row">
                <label>Name:</label>
                <PrimeInputText v-model="newCustomer.name" />
            </div>
            <div class="form-row">
                <label>Type:</label>
                <PrimeInputText v-model="newCustomer.type" />
            </div>
            <div class="form-row">
                <label>Address:</label>
                <PrimeInputText v-model="newCustomer.address" />
            </div>
            <div class="form-row">
                <label>Phone:</label>
                <PrimeInputText v-model="newCustomer.phoneNo" />
            </div>
            <div
                class="mt-4"
                style="text-align: right"
            >
                <PrimeButton
                    label="Cancel"
                    class="p-button-text p-button-danger"
                    @click="isCreateCustomerModalVisible = false"
                />
                <PrimeButton
                    label="Save"
                    @click="saveCustomer()"
                />
            </div>
        </PrimeDialog>

        <!-- Add Item Dialog -->
        <PrimeDialog
            v-model:visible="isAddItemModalVisible"
            modal
            header="Add Inventory Items"
            :class="fontDMSansPrompt"
        >
            <PrimeDataTable
                v-model:selection="toAdd"
                :value="filteredInventory"
                selection-mode="multiple"
                data-key="id"
                scrollable
                scroll-height="400px"
            >
                <PrimeColumn
                    selection-mode="multiple"
                    header-style="width:3rem"
                />
                <PrimeColumn
                    field="sku"
                    header="SKU"
                    sortable
                />
                <PrimeColumn header="Item">
                    <template #body="p">{{ p.data.item }}</template>
                </PrimeColumn>
                <PrimeColumn
                    field="variant"
                    header="Variant"
                    sortable
                />
                <PrimeColumn header="Stock Qty">
                    <template #body="p">{{ aggregateStock(p.data) }}</template>
                </PrimeColumn>
            </PrimeDataTable>
            <PrimeButton
                label="Add Selected"
                class="mt-2"
                severity="primary"
                @click="addSelected()"
            />
        </PrimeDialog>

        <!-- Create New Item Modal -->
        <CreateItemModal v-model:visible="isCreateItemModalVisible" />
    </div>
</template>

<script lang="ts" setup>
import type { Customer } from '~/model/Customer';
import type { CustomerOrder, CustomerOrderItem } from '~/model/CustomerOrder';
import type { InventoryItem } from '~/model/InventoryItem';

definePageMeta({ layout: 'dashboard' });

const { fontDMSansPrompt } = useFontClass();
const currentBusinessStore = useCurrentBusinessStore();

const emit = defineEmits<{
    (e: 'update:visible', v: boolean): void;
    (e: 'save', order: CustomerOrder): void;
}>();
const props = defineProps<{ isOpened: boolean }>();

// Main dialog visibility
const visible = computed({
    get: () => props.isOpened,
    set(v: boolean) {
        emit('update:visible', v);
    },
});

// Lookup data
const customers = ref<Customer[]>(
    await $fetch<Customer[]>(
        `/api/business/${currentBusinessStore.businessId}/order/customer/list`,
    ),
);
const channels = ref<{ id: number; name: string }[]>(
    await $fetch<{ id: number; name: string }[]>(
        `/api/business/${currentBusinessStore.businessId}/order/channel/list`,
    ),
);
const statuses = ref<{ id: number; name: string }[]>(
    await $fetch(
        `/api/business/${currentBusinessStore.businessId}/order/status/list`,
    ),
);
const inventory = ref<InventoryItem[]>(
    await $fetch(
        `/api/business/${currentBusinessStore.businessId}/inventory/list`,
    ),
);

// Form state
const form = reactive<CustomerOrder>({
    id: 0,
    orderId: '',
    customerId: 0,
    channelId: 0,
    statusId: 0,
    shippingMethod: '',
    shippingFee: 0,
    shippingCost: 0,
    orderedAt: new Date().toISOString(),
    items: [],
});

// New Customer dialog
const isCreateCustomerModalVisible = ref(false);
const newCustomer = reactive<Omit<Customer, 'id'>>({
    name: '',
    type: '',
    address: '',
    phoneNo: '',
});

async function saveCustomer() {
    const created = await $fetch<Customer>(
        `/api/business/${currentBusinessStore.businessId}/order/customer/create`,
        {
            method: 'POST',
            body: newCustomer,
        },
    );
    customers.value.push(created);
    form.customerId = created.id ?? 0;
    isCreateCustomerModalVisible.value = false;
    Object.assign(newCustomer, {
        name: '',
        type: '',
        address: '',
        phoneNo: '',
    });
}

// Search & add‑item dialog
const searchKeyword = ref('');
const isAddItemModalVisible = ref(false);
const isCreateItemModalVisible = ref(false);
const toAdd = ref<InventoryItem[]>([]);

// Helpers
const getProduct = (vid: number) => inventory.value.find(p => p.id === vid);
function openAddItemModal() {
    isAddItemModalVisible.value = true;
}
const filteredInventory = computed(() =>
    inventory.value.filter(
        i =>
            !searchKeyword.value ||
            i.sku.includes(searchKeyword.value) ||
            i.item.toLowerCase().includes(searchKeyword.value.toLowerCase()),
    ),
);
function aggregateStock(i: InventoryItem) {
    return i.qtyInWarehouse?.reduce((s, w) => s + w.qty, 0) ?? 0;
}
function addSelected() {
    toAdd.value.forEach(i => {
        if (!form.items.some(x => x.variantId === i.id)) {
            form.items.push({
                variantId: i.id,
                quantity: 1,
                pricePerUnit: i.purchasePrice,
                discountPerUnit: 0,
            });
        }
    });
    toAdd.value = [];
    isAddItemModalVisible.value = false;
}
function removeItem(item: CustomerOrderItem) {
    form.items = form.items.filter(x => x !== item);
}

// Totals
function lineTotal(item: CustomerOrderItem) {
    return (item.pricePerUnit - item.discountPerUnit) * item.quantity;
}
const grandTotal = computed(
    () => form.items.reduce((s, i) => s + lineTotal(i), 0) + form.shippingFee,
);

// Submit
async function submit() {
    await $fetch(
        `/api/business/${currentBusinessStore.businessId}/order/create`,
        {
            method: 'POST',
            body: form,
        },
    );
    emit('save', { ...form });
    visible.value = false;
}
</script>

<style scoped lang="scss">
.action-bar {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
}

.form-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;

    label {
        width: 100px;
        font-weight: 600;
    }
}

.customer-dropdown {
    width: 200px;
    margin-right: 0.5rem;
}

.inventory-table {
    margin-bottom: 1rem;
}

.total-row {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-bottom: 1rem;

    .label {
        font-weight: 600;
    }

    .value {
        font-weight: 600;
        color: #1e88e5;
    }
}
</style>
