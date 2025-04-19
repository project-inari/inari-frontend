<template>
    <div
        class="supplier-manager-page"
        :class="fontDMSansPrompt"
    >
        <!-- Header: Only Title Now -->
        <header class="supplier-manager-header">
            <div class="header-left">
                <h1 class="title">Supplier Manager</h1>
            </div>
            <div class="header-right">
                <!-- (Button removed from header) -->
            </div>
        </header>

        <!-- Search / Filter Bar -->
        <div class="header-actions">
            <div class="search-bar">
                <label>Search:</label>
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

        <!-- Upper Table: Supplier List -->
        <div class="supplier-list-section">
            <PrimeDataTable
                v-model:selection="selectedSupplier"
                :value="filteredSuppliers"
                selection-mode="single"
                removable-sort
                scrollable
                scroll-height="250px"
                responsive-layout="scroll"
                class="supplier-table"
            >
                <!-- Running number column -->
                <PrimeColumn header="#">
                    <template #body="slotProps">
                        <span>{{ slotProps.index + 1 }}</span>
                    </template>
                </PrimeColumn>
                <PrimeColumn
                    field="name"
                    header="Supplier"
                    sortable
                />
                <PrimeColumn
                    field="type"
                    header="Type"
                />
                <PrimeColumn
                    field="description"
                    header="Description"
                    sortable
                />
            </PrimeDataTable>
        </div>

        <!-- Lower Section: Supplier Contacts & Create Supplier Button -->
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
                {{ selectedSupplier.name }} Contacts
            </h2>
            <PrimeDataTable
                :value="selectedSupplierContacts"
                removable-sort
                scrollable
                scroll-height="250px"
                responsive-layout="scroll"
                class="supplier-contact-table"
            >
                <!-- Running number column -->
                <PrimeColumn header="#">
                    <template #body="slotProps">
                        <span>{{ slotProps.index + 1 }}</span>
                    </template>
                </PrimeColumn>
                <PrimeColumn
                    field="fullName"
                    header="Contact Person"
                    sortable
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
            <!-- New "Create Supplier" Button below contacts table -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Supplier } from '~/model/Supplier';

definePageMeta({
    layout: 'dashboard',
});

const { fontDMSansPrompt } = useFontClass();
const currentBusinessStore = useCurrentBusinessStore();

// Fetch suppliers from API
const supplierInfo = await $fetch<Supplier[]>(
    `/api/business/${currentBusinessStore.businessId}/supplier/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    },
);
const supplierList = ref(supplierInfo);

// Search keyword for filtering
const searchKeyword = ref('');

// Filtered suppliers computed property
const filteredSuppliers = computed(() => {
    if (!searchKeyword.value.trim()) {
        return supplierList.value;
    }
    return supplierList.value.filter(
        supp =>
            supp.name
                .toLowerCase()
                .includes(searchKeyword.value.toLowerCase()) ||
            (supp.description || '')
                .toLowerCase()
                .includes(searchKeyword.value.toLowerCase()),
    );
});

// Selected supplier (from the upper table)
const selectedSupplier = ref<Supplier | null>(null);

// Computed contacts for the selected supplier, or an empty array if none.
const selectedSupplierContacts = computed(() => {
    return selectedSupplier.value?.contacts || [];
});

// Handler for the Create Supplier button (moved down).
function onCreateSupplier() {
    console.log('Create Supplier button clicked.');
    // Here, add your logic to open a modal or navigate to a supplier creation page.
}

function onCreateSupplierContact() {
    console.log('Create Supplier Contact button clicked.');
    // Here, add your logic to open a modal or navigate to a supplier creation page.
}
</script>

<style scoped lang="scss">
.supplier-manager-page {
    padding: 1rem;
    background-color: #fff;
}

/* HEADER */
.supplier-manager-header {
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
    justify-content: space-between;
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

    .create-supplier-button-container {
        display: flex;
        justify-content: flex-end;
    }
}

/* SUPPLIER TABLE */
.supplier-list-section {
    margin-bottom: 1rem;

    .supplier-table {
        margin-bottom: 1rem;
    }
}

/* CONTACTS SECTION */
.supplier-contacts-section {
    margin-top: 1rem;

    .supplier-contact-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .supplier-contact-table {
        margin-bottom: 1rem;
    }

    .create-supplier-contact-button-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;
    }
}

/* Responsive */
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
