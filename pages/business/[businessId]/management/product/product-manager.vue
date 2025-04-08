<template>
    <div class="product-manager-page" :class="fontDMSansPrompt">
        <!-- LEFT SIDEBAR: Categories Tree -->
        <aside class="sidebar-categories">
            <h2>Categories</h2>
            <PrimeTree :value="treeData" selectionMode="single" v-model:selectionKeys="selectedKey" />
        </aside>

        <!-- MAIN CONTENT -->
        <section class="product-manager-content">
            <!-- TOP SECTION: Dynamic Display for Selected Product -->
            <header class="product-detail-header" v-if="selectedProduct">
                <div class="dynamic-display-section">
                    <NuxtImg :src="selectedProduct.img" alt="selected product image" class="dynamic-item-img"
                        width="100" height="100" />
                    <div class="dynamic-display-left-side">
                        <div class="info-row">
                            <label class="dynamic-display-info-label">SKU:</label>
                            <span>{{ selectedProduct.sku }}</span>
                        </div>
                        <div class="info-row">
                            <label class="dynamic-display-info-label">Name:</label>
                            <span>{{ selectedProduct.item }}</span>
                        </div>
                        <div class="info-row">
                            <label class="dynamic-display-info-label">Variant:</label>
                            <span>{{ selectedProduct.variant }}</span>
                        </div>
                        <div class="info-row">
                            <label class="dynamic-display-info-label">Categories:</label>
                            <span>{{ getCategoryPath(selectedProduct.categoryId).join(' → ') }}</span>
                        </div>
                        <div class="info-row">
                            <label class="dynamic-display-info-label">Selling Price:</label>
                            <span>{{ selectedProduct.sellingPrice }} Baht</span>
                        </div>
                    </div>
                </div>
                <div class="detail-right">
                    <PrimeButton label="Create" icon="pi pi-plus" class="create-button" @click="onCreateProduct" />
                </div>
            </header>

            <!-- FILTER BAR & PRODUCT GRID -->
            <div class="product-manager-grid-section">
                <div class="filter-bar">
                    <PrimeInputText v-model="filterKeyword" placeholder="Filter" class="filter-input" />
                    <div class="sort-dropdown">
                        <label>SORT BY</label>
                        <PrimeDropdown v-model="selectedSort" :options="sortOptions" optionLabel="label"
                            optionValue="value" placeholder="Select" />
                    </div>
                </div>
                <!-- PRODUCT GRID -->
                <div class="product-grid">
                    <div v-for="(product, index) in filteredProducts" :key="index" class="product-card"
                        @click="onSelectProduct(product)">
                        <NuxtImg :src="product.img" alt="product-image" class="product-image" width="80" height="80" />
                        <h4 class="product-name">{{ product.item }}</h4>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PrimeTree from 'primevue/tree'
import PrimeInputText from 'primevue/inputtext'
import PrimeButton from 'primevue/button'
import PrimeDropdown from 'primevue/dropdown'
import type { InventoryItem } from '~/model/InventoryItem'
import { useFontClass } from '~/composables/useFontClass'

definePageMeta({
    layout: 'dashboard',
})

const { fontDMSansPrompt } = useFontClass()
const currentBusinessStore = useCurrentBusinessStore()

// ----- Fetch Category List and Build Hierarchy -----
const fetchedCategoryList = await $fetch(`/api/business/${currentBusinessStore.businessId}/category/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
})

// Build a hierarchy from the flat list using parentCategoryId
function buildCategoryTree(categories: any[]): any[] {
    const map = new Map<number, any>()
    categories.forEach(cat => {
        cat.children = []
        map.set(cat.id, cat)
    })
    const tree: any[] = []
    categories.forEach(cat => {
        if (cat.parentCategoryId) {
            const parent = map.get(cat.parentCategoryId)
            if (parent) {
                parent.children.push(cat)
            }
        } else {
            tree.push(cat)
        }
    })
    return tree
}
const categoryTree = buildCategoryTree(fetchedCategoryList)

// Convert the hierarchical tree into the format required by PrimeVue Tree.
const treeData = computed(() => {
    function convertNode(node: any) {
        return {
            key: String(node.id),
            label: node.name,
            data: node,
            children: node.children && node.children.length ? node.children.map(convertNode) : undefined,
        }
    }
    return categoryTree.map(convertNode)
})

// Use selectedKey from the tree to derive the selected category ID.
const selectedKey = ref({})
const selectedCategoryId = computed(() => {
    const keys = Object.keys(selectedKey.value)
    return keys.length ? Number(keys[0]) : null
})

// Helper: Recursively gather descendant category IDs (including self)
function getDescendantCategoryIds(category: any): number[] {
    let ids = [category.id]
    if (category.children && category.children.length) {
        category.children.forEach((child: any) => {
            ids = ids.concat(getDescendantCategoryIds(child))
        })
    }
    return ids
}

function getCategoryPath(categoryId: number): string[] {
    const cat = fetchedCategoryList.find((c: any) => c.id === categoryId)
    if (!cat) return []
    const path: string[] = []
    function buildPath(c: any) {
        if (c.parentCategoryId) {
            const parent = fetchedCategoryList.find((p: any) => p.id === c.parentCategoryId)
            if (parent) {
                buildPath(parent)
            }
        }
        path.push(c.name)
    }
    buildPath(cat)
    return path
}

// Find the selected category object from the hierarchical tree.
function findCategoryById(tree: any[], id: number): any | null {
    for (const node of tree) {
        if (node.id === id) return node
        if (node.children && node.children.length) {
            const result = findCategoryById(node.children, id)
            if (result) return result
        }
    }
    return null
}
const selectedCategoryObj = computed(() => {
    if (selectedCategoryId.value === null) return null
    return findCategoryById(categoryTree, selectedCategoryId.value)
})

// ----- Fetch Inventory Data -----
const inventoryList = await $fetch<InventoryItem[]>(`/api/business/${currentBusinessStore.businessId}/inventory/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
})
const inventoryData = ref(inventoryList)

// ----- Filter / Sort for Product Grid -----
const filterKeyword = ref('')
const sortOptions = ref([
    { label: 'Name (A-Z)', value: 'nameAsc' },
    { label: 'Name (Z-A)', value: 'nameDesc' },
])
const selectedSort = ref('nameAsc')

const filteredProducts = computed(() => {
    let list = [...inventoryData.value]
    // If a category is selected in the tree, filter by its ID and its descendants.
    if (selectedCategoryObj.value) {
        const allowedIds = getDescendantCategoryIds(selectedCategoryObj.value)
        list = list.filter(prod => allowedIds.includes(prod.categoryId))
    }
    if (filterKeyword.value.trim()) {
        list = list.filter(prod =>
            prod.item.toLowerCase().includes(filterKeyword.value.toLowerCase())
        )
    }
    if (selectedSort.value === 'nameAsc') {
        list.sort((a, b) => a.item.localeCompare(b.item))
    } else if (selectedSort.value === 'nameDesc') {
        list.sort((a, b) => b.item.localeCompare(a.item))
    }
    return list
})

// ----- Helper: Calculate Total Stock Quantity & Value -----
function calculateTotalStockQty(item: InventoryItem): number {
    return item.qtyInWarehouse ? item.qtyInWarehouse.reduce((sum, wh) => sum + wh.qty, 0) : 0
}
function getWarehouseQty(item: InventoryItem): number {
    return calculateTotalStockQty(item)
}
function getWarehouseValue(item: InventoryItem): number {
    return calculateTotalStockQty(item) * item.purchasePrice
}

// ----- Dynamic Display: Selected Product -----
// Default to first product if available.
const selectedProduct = ref<InventoryItem | null>(inventoryData.value.length ? inventoryData.value[0] : null)

// ----- Product Selection -----
function onSelectProduct(prod: InventoryItem) {
    console.log('Selected product from grid:', prod)
    selectedProduct.value = prod
}

// ----- Product Creation -----
function onCreateProduct() {
    console.log('Create product clicked!')
    // Add your product creation logic here (e.g., show a modal)
}
</script>

<style scoped lang="scss">
.product-manager-page {
    display: flex;
    min-height: 100vh;
    background-color: #fff;
}

/* LEFT SIDEBAR: Categories Tree */
.sidebar-categories {
    width: 250px;
    border-right: 1px solid #ddd;
    padding: 1rem;
}

.sidebar-categories h2 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
}

/* MAIN CONTENT */
.product-manager-content {
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

/* Top detail header (Dynamic Display) */
.product-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    .dynamic-display-section {
        display: flex;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        gap: 1rem;
        align-items: center;
    }

    .dynamic-item-img {
        border-radius: 4px;
    }

    .dynamic-display-left-side {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .dynamic-display-info-label {
        font-weight: 600;
    }
}

/* Filter bar & product grid */
.product-manager-grid-section {
    margin-top: 1rem;

    .filter-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;

        .filter-input {
            width: 200px;
        }

        .sort-dropdown {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    }

    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1rem;
    }

    .product-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: #fafafa;
        transition: box-shadow 0.2s;

        &:hover {
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .product-image {
            margin-bottom: 0.5rem;
            border-radius: 4px;
        }

        .product-name {
            margin: 0;
            font-size: 0.9rem;
            text-align: center;
        }
    }
}
</style>