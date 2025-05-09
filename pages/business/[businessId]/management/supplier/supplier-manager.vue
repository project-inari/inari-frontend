<template>
    <div
        class="supplier-manager-page"
        :class="fontDMSansPrompt"
    >
        <!-- PAGE HEADER -->
        <header class="supplier-manager-header">
            <div class="header-left">
                <h1 class="title">Supplier Manager</h1>
            </div>
        </header>

        <!-- SEARCH & CREATE BAR -->
        <div class="header-actions">
            <div class="search-bar">
                <label>Search Suppliers:</label>
                <PrimeInputText
                    v-model="searchKeyword"
                    placeholder="Search suppliers..."
                    class="global-search-input"
                />
            </div>
            <div class="create-supplier-button-container">
                <PrimeButton
                    label="Create Supplier"
                    icon="pi pi-plus"
                    @click="onCreateSupplier"
                />
            </div>
        </div>

        <!-- SUPPLIER LIST -->
        <div class="supplier-list-section">
            <PrimeDataTable
                v-model:selection="selectedSupplier"
                :value="filteredSuppliers"
                selection-mode="single"
                scrollable
                scroll-height="250px"
                class="supplier-table"
            >
                <PrimeColumn header="#">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </PrimeColumn>
                <PrimeColumn
                    field="name"
                    header="Name"
                    sortable
                />
                <PrimeColumn
                    field="type"
                    header="Type"
                />
                <PrimeColumn
                    field="description"
                    header="Description"
                />
            </PrimeDataTable>
        </div>

        <!-- CONTACTS & ADD CONTACT -->
        <div
            v-if="selectedSupplier"
            class="supplier-contacts-section"
        >
            <div class="create-supplier-contact-button-container">
                <PrimeButton
                    label="Create Supplier Contact"
                    icon="pi pi-plus"
                    outlined
                    @click="onCreateSupplierContact"
                />
            </div>
            <h2 class="supplier-contact-title">
                {{ selectedSupplier.name }}’s Contacts
            </h2>
            <PrimeDataTable
                :value="selectedSupplierContacts"
                scrollable
                scroll-height="250px"
                class="supplier-contact-table"
            >
                <PrimeColumn header="#">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </PrimeColumn>
                <PrimeColumn
                    field="fullName"
                    header="Name"
                />
                <PrimeColumn
                    field="phoneNo"
                    header="Phone"
                />
                <PrimeColumn
                    field="email"
                    header="Email"
                />
                <PrimeColumn
                    field="address"
                    header="Address"
                />
                <PrimeColumn
                    field="remarks"
                    header="Remarks"
                />
                <PrimeColumn
                    field="status"
                    header="Status"
                />
            </PrimeDataTable>
        </div>

        <!-- Create Supplier Modal -->
        <CreateSupplierModal
            v-model:is-opened="isSupplierModalOpen"
            @save="onSupplierCreated"
        />

        <!-- Create Supplier Contact Modal -->
        <CreateNewSupplierContactModal
            v-model:is-opened="isSupplierContactModalOpen"
            :supplier-id="selectedSupplier?.id || 0"
            @save="onSupplierContactCreated"
        />
    </div>
</template>

<script lang="ts" setup>
import type { Supplier } from '~/model/Supplier';

definePageMeta({
    layout: 'dashboard',
});

const { fontDMSansPrompt } = useFontClass();
const currentBusinessStore = useCurrentBusinessStore();

// raw list from API
const allSuppliers = ref<Supplier[]>(
    await $fetch<Supplier[]>(
        `/api/business/${currentBusinessStore.businessId}/supplier/list`,
    ),
);

// search/filter
const searchKeyword = ref('');
const filteredSuppliers = computed(() => {
    if (!searchKeyword.value.trim()) return allSuppliers.value;
    return allSuppliers.value.filter(s =>
        s.name.toLowerCase().includes(searchKeyword.value.toLowerCase()),
    );
});

// table selection
const selectedSupplier = ref<Supplier | null>(null);
const selectedSupplierContacts = computed(
    () => selectedSupplier.value?.contacts || [],
);

// create-supplier modal
const isSupplierModalOpen = ref(false);
function onCreateSupplier() {
    isSupplierModalOpen.value = true;
}
function onSupplierCreated(newSupplier: Supplier) {
    allSuppliers.value.unshift(newSupplier);
    isSupplierModalOpen.value = false;
}

// create-supplier-contact modal
const isSupplierContactModalOpen = ref(false);
function onCreateSupplierContact() {
    if (!selectedSupplier.value) return;
    isSupplierContactModalOpen.value = true;
}
function onSupplierContactCreated({
    supplierId,
    contact,
}: {
    supplierId: number;
    contact: Omit<NonNullable<Supplier['contacts']>[0], 'id'>;
}) {
    const sup = allSuppliers.value.find(s => s.id === supplierId);
    if (sup) {
        sup.contacts = sup.contacts || [];
        sup.contacts.push(contact as any);
    }
    isSupplierContactModalOpen.value = false;
}
</script>

<style scoped lang="scss">
.supplier-manager-page {
    padding: 1rem;
    background: #fff;
}

.supplier-manager-header {
    margin-bottom: 1rem;
}

.header-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.global-search-input {
    width: 240px;
}

.create-supplier-button-container,
.create-supplier-contact-button-container {
    display: flex;
    justify-content: flex-end;
}

.supplier-table,
.supplier-contact-table {
    margin-bottom: 1rem;
}

.supplier-contacts-section {
    margin-top: 1rem;
}
</style>
