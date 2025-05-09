<template>
    <div
        class="tag-management-page"
        :class="fontDMSansPrompt"
    >
        <!-- HEADER -->
        <header class="tag-header">
            <h1>Tags</h1>
            <div class="tag-header-actions">
                <PrimeButton
                    label="Create New"
                    class="create-new-button"
                    icon="pi pi-plus"
                    @click="onCreateNewTag"
                />
            </div>
        </header>

        <div class="tag-content">
            <!-- LEFT SIDEBAR: List of Tags -->
            <aside class="sidebar-tags">
                <h2>All Products</h2>
                <ul class="tag-list">
                    <li
                        v-for="(tg, idx) in tagList"
                        :key="idx"
                        :class="[
                            'tag-list-item',
                            { active: selectedTag && selectedTag.id === tg.id },
                        ]"
                        @click="selectTag(tg)"
                    >
                        {{ tg.name }}
                    </li>
                </ul>
            </aside>

            <!-- MAIN CONTENT: Selected Tag Details + Inventory Table -->
            <section class="main-content">
                <!-- TOP BOX: Selected Tag Details -->
                <div
                    v-if="selectedTag"
                    class="selected-tag-box"
                >
                    <div class="selected-tag-header">
                        <NuxtImg
                            v-if="tagIconUrl"
                            :src="tagIconUrl"
                            alt="tag-icon"
                            class="tag-icon"
                            width="64"
                            height="64"
                        />
                        <div class="tag-info">
                            <h2>{{ selectedTag.name.toUpperCase() }}</h2>
                            <!-- Example: Show color and date created if available -->
                            <div class="tag-meta">
                                <span class="tag-color-label">
                                    Color:
                                    <PrimeTag
                                        :value="selectedTag.color"
                                        :severity="getTagColor(selectedTag)"
                                        class="tag-color-tag"
                                    />
                                </span>
                            </div>
                            <!-- Tag description if any -->
                            <p
                                v-if="selectedTagDescription"
                                class="tag-description"
                            >
                                {{ selectedTagDescription }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- TABLE: Items that have the selected tag -->
                <div
                    v-if="selectedTag"
                    class="tag-items-section"
                >
                    <h3>Assigned Items</h3>
                    <PrimeDataTable
                        :value="filteredItems"
                        :rows="5"
                        scrollable
                        class="tag-items-table"
                    >
                        <PrimeColumn
                            field="sku"
                            header="SKU"
                        />
                        <PrimeColumn header="Inventory Item">
                            <template #body="slotProps">
                                <div class="item-cell">
                                    <NuxtImg
                                        :src="slotProps.data.img"
                                        alt="item-image"
                                        width="40"
                                        height="40"
                                    />
                                    <span>{{ slotProps.data.item }}</span>
                                </div>
                            </template>
                        </PrimeColumn>
                        <PrimeColumn
                            field="variant"
                            header="Variant"
                        />
                        <PrimeColumn header="Stock Qty">
                            <template #body="slotProps">
                                <span>{{
                                    calculateTotalStockQty(slotProps.data)
                                }}</span>
                            </template>
                        </PrimeColumn>
                    </PrimeDataTable>
                </div>
            </section>
        </div>

        <CreateNewTagModal
            v-model:is-opened="isTagModalOpen"
            @save="onTagCreated"
            @update:visible="isTagModalOpen = $event"
        />
    </div>
</template>

<script setup lang="ts">
import type { Tag } from '~/model/Tag';

definePageMeta({
    layout: 'dashboard',
});

const { fontDMSansPrompt } = useFontClass();
const currentBusinessStore = useCurrentBusinessStore();

const isTagModalOpen = ref(false);
function onTagCreated(newTag: any) {
    // Handle the new tag creation logic here
    console.log('New Tag Created:', newTag);
}

// 1) "Create New" button logic
function onCreateNewTag() {
    console.log('Create New Tag clicked!');
    // Example: open a modal or navigate to a create-tag page
    isTagModalOpen.value = true;
}

// 2) Fetch tags from API
const tagList = await $fetch<Tag[]>(
    `/api/business/${currentBusinessStore.businessId}/tag/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    },
);

// 3) Left sidebar selection
const selectedTag = ref<any>(null);
function selectTag(tg: any) {
    selectedTag.value = tg;
}

// Example: Tag icon (optional) - if you have a default icon or per-tag icons
const tagIconUrl = ''; // Provide an icon URL or dynamic logic

// 4) Tag details
const selectedTagDescription = computed(() => {
    // If your tag object has a "description" field, show it. Otherwise, provide a placeholder.
    return selectedTag.value?.description || '';
});

// 5) Inventory Data
const inventoryList = await $fetch(
    `/api/business/${currentBusinessStore.businessId}/inventory/list`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    },
);
const inventoryData = ref(inventoryList);

// 6) Items that have the selected tag
const filteredItems = computed(() => {
    if (!selectedTag.value) return [];
    // Return only items whose tags array contains the selectedTag
    return inventoryData.value.filter(
        item =>
            item.tags &&
            item.tags.some((t: any) => t.id === selectedTag.value.id),
    );
});

// 7) Calculate total stock
function calculateTotalStockQty(item: any) {
    if (!item.qtyInWarehouse) return 0;
    return item.qtyInWarehouse.reduce(
        (sum: number, wh: any) => sum + wh.qty,
        0,
    );
}
</script>

<style scoped lang="scss">
.tag-management-page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: #fff;
}

/* HEADER */
.tag-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h1 {
        margin: 0;
        font-size: 28px;
    }

    .tag-header-actions {
        display: flex;
        gap: 1rem;
    }
}

/* MAIN CONTENT */
.tag-content {
    display: flex;
    gap: 1rem;
}

/* LEFT SIDEBAR: Tag List */
.sidebar-tags {
    width: 200px;
    border-right: 1px solid #ddd;
    padding: 1rem;

    h2 {
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
    }

    .tag-list {
        list-style: none;
        padding: 0;
        margin: 0;

        .tag-list-item {
            cursor: pointer;
            margin-bottom: 0.5rem;
            color: #444;

            &.active {
                font-weight: 600;
                color: #007ad9;
            }
        }
    }
}

/* RIGHT MAIN CONTENT */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* SELECTED TAG BOX */
.selected-tag-box {
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fefefe;
    padding: 1rem;

    .selected-tag-header {
        display: flex;
        align-items: center;
        gap: 1rem;

        .tag-icon {
            border-radius: 4px;
        }

        .tag-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;

            h2 {
                margin: 0;
                font-size: 1.2rem;
            }

            .tag-meta {
                display: flex;
                align-items: center;
                gap: 1rem;

                .tag-color-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .tag-color-tag {
                    margin-left: 0.25rem;
                }
            }

            .tag-description {
                margin-top: 0.5rem;
                color: #555;
            }
        }
    }
}

/* TABLE: Assigned Items */
.tag-items-section {
    .tag-items-table {
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: #fff;
        padding: 0.5rem;
    }

    .item-cell {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        img {
            border-radius: 4px;
        }
    }
}
</style>
