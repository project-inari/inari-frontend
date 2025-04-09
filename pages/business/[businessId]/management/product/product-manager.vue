<template>
    <div class="product-manager-page" :class="fontDMSansPrompt">
        <!-- LEFT SIDEBAR: Categories Tree -->
        <aside class="sidebar-categories">
            <h2>Categories</h2>
            <PrimeTree :value="treeData" selectionMode="single" v-model:selectionKeys="selectedKey" />
        </aside>

        <!-- MAIN CONTENT -->
        <section class="product-manager-content">
            <!-- TOP SECTION: Dynamic Display for Selected Product Variant -->
            <header class="product-detail-header" v-if="selectedProduct && selectedVariant">
                <div class="dynamic-display-section">
                    <!-- Variant Selector & Image -->
                    <div class="variant-header">
                        <!-- Variant Selector -->
                        <div class="variant-selector">
                            <label>Select Variant:</label>
                            <PrimeDropdown v-model="selectedVariant" :options="selectedProduct.variants"
                                optionLabel="name" placeholder="Select Variant" class="variant-dropdown" />
                        </div>
                        <!-- Variant Image -->
                        <NuxtImg :src="selectedVariant.pictureUrl" alt="selected product image" class="dynamic-item-img"
                            width="100" height="100" />
                    </div>
                    <div class="dynamic-display-left-side">
                        <div class="info-row">
                            <label class="dynamic-display-info-label">SKU:</label>
                            <span>{{ selectedVariant.sku }}</span>
                        </div>
                        <div class="info-row">
                            <label class="dynamic-display-info-label">Product Name:</label>
                            <span>{{ selectedProduct.name }}</span>
                        </div>
                        <div class="info-row">
                            <label class="dynamic-display-info-label">Variant:</label>
                            <span>{{ selectedVariant.name }}</span>
                        </div>
                        <div class="info-row">
                            <label class="dynamic-display-info-label">Categories:</label>
                            <span>{{ getCategoryPath(selectedProduct.categoryId).join(' → ') }}</span>
                        </div>
                        <div class="info-row">
                            <label class="dynamic-display-info-label">Selling Price:</label>
                            <span>{{ selectedVariant.sellingPrice }} Baht</span>
                        </div>
                        <div class="info-row">
                            <label class="dynamic-display-info-label">Stock Qty:</label>
                            <span>{{ calculateTotalStockQty(selectedVariant) }}</span>
                        </div>
                        <!-- Variant Tags (mapped from currentBusinessStore.businessTags) -->
                        <div class="info-row variant-tags" v-if="variantTags.length">
                            <label class="dynamic-display-info-label">Tags:</label>
                            <div class="tags-cell">
                                <PrimeTag v-for="(tag, idx) in variantTags" :key="idx" :value="tag?.name"
                                    :severity="tag ? getTagColor(tag) : ''" class="status-tag" />
                            </div>
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
                        <!-- Use first variant's pictureUrl as product image -->
                        <NuxtImg :src="product.variants[0].pictureUrl" alt="product-image" class="product-image"
                            width="80" height="80" />
                        <h4 class="product-name">{{ product.name }}</h4>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { Product, Variant } from '~/model/Product'

definePageMeta({
    layout: 'dashboard',
})

const { fontDMSansPrompt } = useFontClass()
const currentBusinessStore = useCurrentBusinessStore()

// ----- 1) Categories Tree (Sidebar) -----
const fetchedCategoryList = await $fetch<any[]>(`/api/business/${currentBusinessStore.businessId}/category/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
})
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
            if (parent) parent.children.push(cat)
        } else {
            tree.push(cat)
        }
    })
    return tree
}
const categoryTree = buildCategoryTree(fetchedCategoryList)
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
const selectedKey = ref({})

// Helper: Build full category path using fetchedCategoryList
function getCategoryPath(categoryId: number): string[] {
    const cat = fetchedCategoryList.find((c: any) => c.id === categoryId)
    if (!cat) return []
    const path: string[] = []
    function buildPath(c: any) {
        if (c.parentCategoryId) {
            const parent = fetchedCategoryList.find((p: any) => p.id === c.parentCategoryId)
            if (parent) buildPath(parent)
        }
        path.push(c.name)
    }
    buildPath(cat)
    return path
}

// Optionally derive selected category object from tree, if needed.
function getDescendantCategoryIds(category: any): number[] {
    let ids = [category.id]
    if (category.children && category.children.length) {
        category.children.forEach((child: any) => {
            ids = ids.concat(getDescendantCategoryIds(child))
        })
    }
    return ids
}
const selectedCategoryObj = computed(() => {
    const keys = Object.keys(selectedKey.value)
    if (!keys.length) return null
    const catId = Number(keys[0])
    return fetchedCategoryList.find(c => c.id === catId) || null
})

// ----- 2) Fetch Product Data from /product/list -----
const productList: Product[] = await $fetch<Product[]>(`/api/business/${currentBusinessStore.businessId}/product/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
})
// Store fetched product data.
const productData = ref(productList)

// ----- 3) Filter / Sort for Product Grid -----
const filterKeyword = ref('')
const sortOptions = ref([
    { label: 'Name (A-Z)', value: 'nameAsc' },
    { label: 'Name (Z-A)', value: 'nameDesc' },
])
const selectedSort = ref('nameAsc')
const filteredProducts = computed(() => {
    let list = [...productData.value]
    if (selectedCategoryObj.value) {
        const allowedIds = getDescendantCategoryIds(selectedCategoryObj.value)
        list = list.filter(prod => allowedIds.includes(prod.categoryId))
    }
    if (filterKeyword.value.trim()) {
        list = list.filter(prod => prod.name.toLowerCase().includes(filterKeyword.value.toLowerCase()))
    }
    if (selectedSort.value === 'nameAsc') {
        list.sort((a, b) => a.name.localeCompare(b.name))
    } else if (selectedSort.value === 'nameDesc') {
        list.sort((a, b) => b.name.localeCompare(a.name))
    }
    return list
})

// ----- 4) Dynamic Display: Selected Product & Variant -----
// Default: select the first product and its first variant if available.
const selectedProduct = ref<Product | null>(productData.value.length ? productData.value[0] : null)
const selectedVariant = ref<Variant | null>(
    selectedProduct.value && selectedProduct.value.variants.length ? selectedProduct.value.variants[0] : null
)

// When a product is clicked in the grid, update the selection.
function onSelectProduct(prod: Product) {
    selectedProduct.value = prod
    selectedVariant.value = prod.variants[0]
    console.log('Selected product:', prod)
}

// ----- 5) Variant Tags -----
// Use currentBusinessStore.businessTags (an array of { id, label, color } objects)
// Map selectedVariant.tagIds (an array of numbers) to tag objects.
const variantTags = computed(() => {
    if (selectedVariant.value && selectedVariant.value.tagIds) {
        return selectedVariant.value.tagIds
            .map((id: number) => currentBusinessStore.businessTags.find((t: any) => t.id === id))
            .filter((t: any) => t)
    }
    return []
})

// ----- 6) Helper: Calculate Total Stock Qty for a Variant -----
function calculateTotalStockQty(variant: Variant): number {
    return variant.qtyInWarehouse?.reduce((sum, wh) => sum + wh.qty, 0) || 0
}

// ----- 7) Additional Functions for Product Creation, Refresh, etc. -----
function onCreateProduct() {
    console.log('Create product clicked!')
    // Implement your product creation logic here (e.g., open a modal)
}
function onAddStock() {
    console.log('Add Stock button clicked!')
    // Implement additional "Add Stock" logic if needed.
}
const lastUpdated = ref(new Date().toLocaleString())
function refreshData() {
    lastUpdated.value = new Date().toLocaleString()
    // Optionally re-fetch product data.
}

// ----- 8) Grouped Filter Options for Product Grid -----
const groupedFilterOptions = ref([
    {
        label: 'Category',
        items: [
            { label: 'Beverage', value: 'Beverage' },
            { label: 'Alcohol', value: 'Alcohol' },
            { label: 'Beer', value: 'Beer' },
            { label: 'Snacks', value: 'Snacks' },
            { label: 'Chips', value: 'Chips' },
            { label: 'Potato', value: 'Potato' },
        ],
    },
    {
        label: 'Tag',
        items: [
            { label: 'In Stock', value: 'In Stock' },
            { label: 'Low Stock', value: 'Low Stock' },
            { label: 'Crispy', value: 'Crispy' },
            { label: 'Out of Stock', value: 'Out of Stock' },
        ],
    },
])
const selectedFilters = ref<any[]>([])

// (Optional) Further functions for additional modals, supplier order, etc., can be added here.
</script>

<style lang="scss" scoped>
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
        flex-direction: column;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        gap: 1rem;
        align-items: center;
    }

    .variant-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .variant-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        label {
            font-weight: 600;
        }

        .variant-dropdown {
            width: 180px;
        }
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
    border-radius: 4px;
}

.dynamic-display-left-side,
.dynamic-display-right-side {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.dynamic-display-save {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
}

.dynamic-display-info-label {
    font-weight: 600;
}

.form-row,
.info-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .p-inputtext {
        width: 300px;
    }

    .p-textarea {
        width: 350px;
    }
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

/* ADD ITEM MODAL STYLES */
.add-item-modal-content {
    padding: 1rem;
}

.product-options {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
}

.product-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border: 1px solid #eee;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.product-option:hover {
    background-color: #f5f5f5;
}

.order-qty {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.add-item-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
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