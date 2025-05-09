<template>
    <div
        class="inventory-manager-page"
        :class="fontDMSansPrompt"
    >
        <!-- HEADER -->
        <header class="inventory-header">
            <div class="header-left">
                <h1 :class="fontDMSansPrompt">Inventory Manager</h1>
            </div>
            <div class="header-right">
                <PrimeButton
                    label="Add Stock"
                    icon="pi pi-plus"
                    class="add-stock-button"
                    :class="fontDMSansPrompt"
                    @click="onAddStock"
                />
            </div>
        </header>

        <div class="header-actions">
            <!-- GLOBAL SEARCH -->
            <div class="search-bar">
                <label>Search:</label>
                <PrimeInputText
                    v-model="searchKeyword"
                    placeholder="Type to search any field..."
                    class="global-search-input"
                />
            </div>

            <!-- Grouped Filter (Tag + Category) -->
            <div class="filter-bar">
                <label class="filter-label">Filter:</label>
                <PrimeMultiSelect
                    v-model="selectedFilters"
                    :options="groupedFilterOptions"
                    option-label="label"
                    option-group-label="label"
                    option-group-children="items"
                    placeholder="Select Filter"
                    display="chip"
                    class="w-full md:w-80"
                >
                    <template #optiongroup="{ option }">
                        <div class="flex items-center gap-2">
                            <i
                                class="pi pi-filter"
                                style="font-size: 1rem"
                            />
                            <span>{{ option.label }}</span>
                        </div>
                    </template>
                </PrimeMultiSelect>
            </div>

            <PrimeButton
                icon="pi pi-refresh"
                class="p-button-sm"
                severity="secondary"
                @click="refreshData"
            />
        </div>

        <!-- INVENTORY TABLE (scrollable, sortable) -->
        <PrimeDataTable
            v-model:selection="selectedRowItem"
            :value="filteredProducts"
            removable-sort
            scrollable
            scroll-height="400px"
            responsive-layout="scroll"
            selection-mode="single"
            class="inventory-table"
            :class="fontDMSansPrompt"
        >
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
                field="purchasePrice"
                header="Purchase Price"
                sortable
            />
            <!-- Stock Qty using aggregated qtyInWarehouse -->
            <PrimeColumn
                header="Stock Qty"
                sortable
            >
                <template #body="slotProps">
                    <span>{{ calculateTotalStockQty(slotProps.data) }}</span>
                </template>
            </PrimeColumn>
            <!-- Categories Column using new categoryId -->
            <PrimeColumn header="Categories">
                <template #body="slotProps">
                    <span>{{
                        getCategoryPath(slotProps.data.categoryId).join(' → ')
                    }}</span>
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
            <PrimeColumn>
                <template #body="slotProps">
                    <PrimeButton
                        icon="pi pi-pencil"
                        outlined
                        severity="secondary"
                        @click="editItem(slotProps.data)"
                    />
                </template>
            </PrimeColumn>
        </PrimeDataTable>

        <!-- TABLE FOOTER: Last Updated -->
        <div class="table-footer">
            <p class="last-updated">Last Updated: {{ lastUpdated }}</p>
        </div>

        <!-- DYNAMIC DISPLAY SECTION -->
        <section
            v-if="selectedItem"
            class="dynamic-display-section"
        >
            <div class="dynamic-display-header">
                <h3>Dynamic Display</h3>
            </div>
            <div class="dynamic-display-card">
                <NuxtImg
                    :src="selectedItem.img"
                    class="dynamic-item-img"
                    width="100"
                />
                <div class="dynamic-display-left-side">
                    <div class="info-row">
                        <label class="dynamic-display-info-label">SKU:</label>
                        <span>{{ selectedItem.sku }}</span>
                    </div>
                    <div class="info-row">
                        <label class="dynamic-display-info-label">Item:</label>
                        <span>{{ selectedItem.item }}</span>
                    </div>
                    <div class="info-row">
                        <label class="dynamic-display-info-label"
                            >Variant:</label
                        >
                        <span>{{ selectedItem.variant }}</span>
                    </div>
                    <div class="info-row">
                        <label class="dynamic-display-info-label"
                            >Categories:</label
                        >
                        <span>{{
                            getCategoryPath(selectedItem.categoryId).join(' → ')
                        }}</span>
                    </div>
                    <div class="info-row">
                        <label class="dynamic-display-info-label"
                            >Stock Qty:</label
                        >
                        <span>{{ calculateTotalStockQty(selectedItem) }}</span>
                    </div>
                    <div class="info-row">
                        <label class="dynamic-display-info-label"
                            >Purchase Price:</label
                        >
                        <span>{{ selectedItem.purchasePrice }}</span>
                    </div>
                </div>
                <div class="dynamic-display-right-side">
                    <div class="info-row">
                        <label class="dynamic-display-info-label">Note:</label>
                        <span>{{ selectedItem.note }}</span>
                    </div>
                    <div class="dynamic-display-warehouse-info">
                        <div
                            v-for="(
                                warehouse, index
                            ) in selectedItem.qtyInWarehouse || []"
                            :key="index"
                            class="stock-card"
                        >
                            <div class="stock-info">
                                <div class="line">
                                    <span>Stock Qty:</span>
                                    <strong>{{ warehouse.qty }}</strong>
                                </div>
                                <div class="line">
                                    <span>Value:</span>
                                    <strong>{{
                                        warehouse.qty *
                                            selectedItem.purchasePrice || 0
                                    }}</strong>
                                </div>
                            </div>
                            <div class="divider"></div>
                            <div class="warehouse-name">
                                Warehouse {{ warehouse.warehouseId }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Create Supplier Order Modal -->
        <CreateSupplierOrderModal
            v-model:visible="isSupplierOrderModalOpen"
            :is-opened="isSupplierOrderModalOpen"
            :on-submit="submitSupplierOrder"
            @close="closeSupplierOrderModal"
        />

        <!-- Create/Edit Item Modal (using CreateItemModal component) -->
        <CreateItemModal
            v-model:visible="isEditItemModalOpen"
            :item="selectedItemForEdit"
            @save="onItemModalSave"
        />
    </div>
</template>

<script setup lang="ts">
import type { InventoryItem } from '~/model/InventoryItem';
import type { Product } from '~/model/Product';

definePageMeta({
    layout: 'dashboard',
});

const { fontDMSansPrompt } = useFontClass();
const currentBusinessStore = useCurrentBusinessStore();

/* ----------------------------
   1) Grouped Filter Options
---------------------------- */
const categories = await $fetch(
    `/api/business/${currentBusinessStore.businessId}/category/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    },
);
const tags = await $fetch(
    `/api/business/${currentBusinessStore.businessId}/tag/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    },
);
const groupedFilterOptions = ref([
    {
        label: 'Category',
        items: categories.map((cat: any) => ({
            label: cat.name,
            value: cat.name,
        })),
    },
    {
        label: 'Tag',
        items: tags.map((tag: any) => ({ label: tag.name, value: tag.name })),
    },
]);
const selectedFilters = ref<any[]>([]);

/* ----------------------------
   2) Global Search
---------------------------- */
const searchKeyword = ref('');

/* ----------------------------
   3) Inventory Data
---------------------------- */
// Fetch inventory data from API; assumed to return an array of InventoryItem objects.
const inventoryList = await $fetch<InventoryItem[]>(
    `/api/business/${currentBusinessStore.businessId}/inventory/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    },
).catch(() => []);
const inventoryData = ref(inventoryList);

/* ----------------------------
   4) Category Tree & Hierarchy
---------------------------- */
// Build hierarchical tree from fetched categories (using parentCategoryId)
function buildCategoryTree(categories: any[]): any[] {
    const map = new Map<number, any>();
    categories.forEach(cat => {
        cat.children = [];
        map.set(cat.id, cat);
    });
    const tree: any[] = [];
    categories.forEach(cat => {
        if (cat.parentCategoryId) {
            const parent = map.get(cat.parentCategoryId);
            if (parent) {
                parent.children.push(cat);
            }
        } else {
            tree.push(cat);
        }
    });
    return tree;
}
const categoryTree = buildCategoryTree(categories);
const treeData = computed(() => {
    function convertNode(node: any) {
        return {
            key: String(node.id),
            label: node.name,
            data: node,
            children:
                node.children && node.children.length
                    ? node.children.map(convertNode)
                    : undefined,
        };
    }
    return categoryTree.map(convertNode);
});
const selectedKey = ref({});

// Use selectedKey to derive the selected category object.
const selectedCategoryObj = computed(() => {
    const keys = Object.keys(selectedKey.value);
    if (keys.length === 0) return null;
    const catId = Number(keys[0]);
    return categories.find((c: any) => c.id === catId) || null;
});

// Helper: Recursively get descendant category IDs (including self)
function getDescendantCategoryIds(category: any): number[] {
    let ids = [category.id];
    if (category.children && category.children.length) {
        category.children.forEach((child: any) => {
            ids = ids.concat(getDescendantCategoryIds(child));
        });
    }
    return ids;
}

/* ----------------------------
   5) Filtered Data
---------------------------- */
const filterKeyword = ref('');
const sortOptions = ref([
    { label: 'Name (A-Z)', value: 'nameAsc' },
    { label: 'Name (Z-A)', value: 'nameDesc' },
]);
const selectedSort = ref('nameAsc');

const filteredProducts = computed(() => {
    let list = [...inventoryData.value];
    if (selectedCategoryObj.value) {
        const allowedIds = getDescendantCategoryIds(selectedCategoryObj.value);
        list = list.filter(prod => allowedIds.includes(prod.categoryId));
    }
    if (filterKeyword.value.trim()) {
        list = list.filter(prod =>
            prod.item.toLowerCase().includes(filterKeyword.value.toLowerCase()),
        );
    }
    if (selectedSort.value === 'nameAsc') {
        list.sort((a, b) => a.item.localeCompare(b.item));
    } else if (selectedSort.value === 'nameDesc') {
        list.sort((a, b) => b.item.localeCompare(a.item));
    }
    return list;
});

/* ----------------------------
   6) Stock Quantity & Value Functions
---------------------------- */
function calculateTotalStockQty(item: InventoryItem): number {
    return item.qtyInWarehouse?.reduce((sum, wh) => sum + wh.qty, 0) || 0;
}
function getWarehouseQty(item: InventoryItem): number {
    return calculateTotalStockQty(item);
}
function getWarehouseValue(item: InventoryItem): number {
    return calculateTotalStockQty(item) * item.purchasePrice;
}

/* ----------------------------
   7) Dynamic Display: Selected Product & Row Selection
---------------------------- */
const selectedRowItem = ref<InventoryItem | null>(null);
const selectedItem = ref<InventoryItem | null>(
    inventoryData.value.length ? inventoryData.value[0] : null,
);

watch(selectedRowItem, newVal => {
    if (newVal) {
        viewItem(newVal);
    }
});

async function viewItem(rowData: any) {
    selectedItem.value = await $fetch<InventoryItem>(
        `/api/business/${currentBusinessStore.businessId}/inventory/${rowData.id}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        },
    );
    console.log('Viewed item:', selectedItem.value);
}

/* ----------------------------
   8) Helper: Build Category Path for a Product
---------------------------- */
// Given a product's categoryId, build a full category path using the fetched categories.
function getCategoryPath(categoryId: number): string[] {
    const cat = categories.find((c: any) => c.id === categoryId);
    if (!cat) return [];
    const path: string[] = [];
    function buildPath(c: any) {
        if (c.parentCategoryId) {
            const parent = categories.find(
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

/* ----------------------------
   9) Product Selection & Creation
---------------------------- */
function onSelectProduct(prod: InventoryItem) {
    console.log('Selected product from grid:', prod);
    selectedItem.value = prod;
}

function onCreateProduct() {
    console.log('Create product clicked!');
    // Add your product creation logic here (e.g., show a modal)
}

/* ----------------------------
   10) Additional Functions: onAddStock, refreshData, editItem, etc.
---------------------------- */
function onAddStock() {
    console.log('Add Stock button clicked!');
    isSupplierOrderModalOpen.value = true;
    // Add your "Add Stock" logic here
}

const lastUpdated = ref(new Date().toLocaleString());
function refreshData() {
    lastUpdated.value = new Date().toLocaleString();
    // Optionally, re-fetch inventory data here.
}

const isEditItemModalOpen = ref(false);
const selectedItemForEdit = ref<Product>();
async function editItem(rowData: InventoryItem) {
    // Adjust this if your InventoryItem has a different field for the variant ID.
    const variantId = rowData.id;
    if (!variantId) {
        console.error('No variantId found in the inventory item.');
        return;
    }
    try {
        // Fetch the product data for this variant.
        const productData = await $fetch<Product>(
            `/api/business/${currentBusinessStore.businessId}/product/${variantId}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            },
        );
        // Set the reactive product for editing.
        selectedItemForEdit.value = productData;
        // Open the modal.
        isEditItemModalOpen.value = true;
    } catch (error) {
        console.error(
            'Failed to fetch product data for variant',
            variantId,
            error,
        );
    }
}

function onItemModalSave(updatedItem: InventoryItem) {
    console.log('Item saved from modal:', updatedItem);
    // Update inventoryData as needed.
    isEditItemModalOpen.value = false;
}

/* ----------------------------
   11) Create Supplier Order Modal Functions
---------------------------- */
const isSupplierOrderModalOpen = ref(false);
function submitSupplierOrder(event: Event) {
    console.log('Supplier order submitted', event);
    isSupplierOrderModalOpen.value = false;
}
function closeSupplierOrderModal() {
    isSupplierOrderModalOpen.value = false;
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

.header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.add-stock-button {
    .p-button-icon-left {
        margin-right: 0.5rem;
    }
}

/* HEADER ACTIONS */
.header-actions {
    display: flex;
    align-items: center;
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

    .filter-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-grow: 1;

        .filter-label {
            font-weight: 600;
        }
    }
}

/* TABLE */
.inventory-table {
    margin-bottom: 1rem;
}

.tags-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.category-tag,
.status-tag {
    margin: 4px 4px 0 0;
}

/* TABLE FOOTER */
.table-footer {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;

    .last-updated {
        margin: 0;
        color: #777;
    }
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

.dynamic-display-card {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    background-color: #fefefe;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.dynamic-item-img {
    width: 120px; /* or whatever width you prefer */
    height: auto; /* auto so aspect ratio is preserved */
    object-fit: contain; /* ensures the entire image fits without distortion */
    border-radius: 4px;
}

.dynamic-display-left-side {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.dynamic-display-right-side {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.dynamic-display-warehouse-info {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    .stock-card {
        width: 160px;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 0.5rem;
        text-align: center;
        overflow: hidden;

        .stock-info {
            padding: 10px;
            margin-bottom: 0.5rem;
            text-align: left;

            .line {
                display: flex;
                justify-content: space-between;
                margin: 5px 0;

                strong {
                    font-weight: 600;
                }
            }
        }

        .divider {
            border-top: 1px solid #ddd;
            margin: 0.5rem 0;
        }

        .warehouse-name {
            font-weight: bold;
            padding: 10px;
        }
    }
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .header-actions {
        flex-direction: column;
        align-items: flex-start;
    }

    .inventory-table {
        margin-bottom: 1rem;
    }

    .table-footer {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
