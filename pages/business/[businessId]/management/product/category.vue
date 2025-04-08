<template>
    <div class="category-manager-page" :class="fontDMSansPrompt">
        <!-- PAGE HEADER -->
        <header class="cm-header">
            <h1>Category</h1>
            <div class="cm-header-actions">
                <PrimeButton label="Create New" class="p-button-sm create-new-button" icon="pi pi-plus"
                    @click="onCreateNew" />
            </div>
        </header>

        <div class="category-content">
            <!-- LEFT SIDEBAR: PrimeVue Tree -->
            <aside class="sidebar-tree">
                <h2>All Products</h2>
                <PrimeTree :value="treeData" selectionMode="single" v-model:selectionKeys="selectedKey" />
            </aside>

            <!-- RIGHT CONTENT: Selected Category & Subcategory Table -->
            <section class="main-content">
                <!-- UPPER BOX: Selected Category Details -->
                <div class="selected-category-box" v-if="selectedCategoryObj">
                    <div class="selected-category-header">
                        <h2>{{ selectedCategoryObj.name.toUpperCase() }}</h2>
                    </div>
                    <!-- Category Image -->
                    <div class="selected-category-image" v-if="selectedCategoryObj.pictureUrl">
                        <NuxtImg :src="selectedCategoryObj.pictureUrl" alt="Category Image" width="200" height="100" />
                    </div>
                    <!-- Category Description -->
                    <p class="selected-category-description" v-if="selectedCategoryObj.description">
                        {{ selectedCategoryObj.description }}
                    </p>
                    <!-- Assigned Tags -->
                    <div class="assigned-tags" v-if="selectedCategoryObj.tags && selectedCategoryObj.tags.length">
                        <span>Assigned Tags:</span>
                        <div class="tags-row">
                            <PrimeTag v-for="(tag, idx) in selectedCategoryObj.tags" :key="idx" :value="tag.name"
                                class="category-tag" />
                        </div>
                    </div>
                </div>

                <!-- LOWER TABLE: Subcategories of the Selected Category -->
                <PrimeDataTable :value="subCategoryList" class="subcategory-table" :showGridlines="true" :rows="5">
                    <PrimeColumn field="id" header="No." />
                    <PrimeColumn field="name" header="Sub-Category" />
                    <PrimeColumn field="description" header="Description" />
                </PrimeDataTable>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">

definePageMeta({
    layout: 'dashboard',
})

const { fontDMSansPrompt } = useFontClass()

const currentBusinessStore = useCurrentBusinessStore()

// 1) "Create New" button logic
const isCreateCategoryModalOpen = ref(false)
function onCreateNew() {
    console.log('Create New Category clicked!')
    // Example: open a modal or navigate to a create-category page
    isCreateCategoryModalOpen.value = true
}

// 2) Fetch categories from API
const fetchedCategoryList = await $fetch(
    `/api/business/${currentBusinessStore.businessId}/category/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
)

// 3) Build a hierarchical tree using parentCategoryId
function buildCategoryTree(categories: any[]): any[] {
    const map = new Map<number, any>()
    categories.forEach(cat => {
        // Add children array to each category
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

// 4) Convert hierarchical tree to PrimeVue Tree format
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

// 5) Selected Key from Tree
const selectedKey = ref({})
const selectedCategoryObj = computed(() => {
    const keys = Object.keys(selectedKey.value)
    if (!keys.length) return null
    const catId = Number(keys[0])
    return fetchedCategoryList.find(cat => cat.id === catId) || null
})

// 6) Subcategory List of the selected category
const subCategoryList = computed(() => {
    if (!selectedCategoryObj.value) return []
    return selectedCategoryObj.value.children || []
})
</script>

<style scoped lang="scss">
.category-manager-page {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background-color: #fff;
}

.cm-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h1 {
        margin: 0;
        font-size: 28px;
    }

    .cm-header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
}

.category-content {
    display: flex;
    gap: 1rem;
}

/* LEFT SIDEBAR: Tree */
.sidebar-tree {
    width: 250px;
    border-right: 1px solid #ddd;
    padding: 1rem;

    h2 {
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
    }
}

/* RIGHT CONTENT */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Selected Category Box */
.selected-category-box {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
    background-color: #fefefe;

    .selected-category-header {
        margin-bottom: 0.5rem;

        h2 {
            margin: 0;
            font-size: 1.2rem;
            color: #333;
        }
    }

    .selected-category-image {
        margin-bottom: 0.5rem;

        img {
            border-radius: 4px;
        }
    }

    .selected-category-description {
        margin-bottom: 0.5rem;
        color: #555;
    }

    .assigned-tags {
        margin-top: 0.5rem;

        .tags-row {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-top: 0.5rem;
        }
    }
}

/* Subcategory Table */
.subcategory-table {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem;
    background-color: #fff;
}

/* Basic example styling */
</style>