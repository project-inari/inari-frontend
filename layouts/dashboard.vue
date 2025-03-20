<template>
    <div class="dashboard-layout">
        <header class="topbar-container">
            <div class="topbar-left">
                <div class="logo-container">
                    <img
                        src="/img/default-logo.png"
                        alt="INARI-Logo"
                        class="logo"
                    />
                    <h2 class="topbar-title">INARI</h2>
                </div>
            </div>

            <div class="topbar-right">
                <PrimeBreadcrumb :model="breadcrumbItems" />
                <div class="topbar-user">
                    <i class="fa fa-user-circle"></i>
                </div>
            </div>
        </header>

        <div class="main-container">
            <aside
                class="sidebar-container"
                :class="{ collapsed: isSidebarCollapsed }"
                @mouseenter="onSidebarHover(true)"
                @mouseleave="onSidebarHover(false)"
            >
                <PrimeDropdown
                    v-show="!isSidebarCollapsed"
                    v-model="selectedBusiness"
                    :options="businessOptions"
                    option-label="label"
                    class="sidebar-dropdown"
                />

                <h4 class="menu-heading">MAIN MENU</h4>

                <ul class="menu-list">
                    <li
                        v-for="(item, index) in menuItems"
                        :key="index"
                    >
                        <div class="menu-item-content">
                            <i :class="[item.icon, 'menu-icon']"></i>
                            <span class="menu-text">{{ item.label }}</span>
                        </div>

                        <ul
                            v-if="item.children && item.children.length"
                            class="submenu-list"
                        >
                            <li
                                v-for="(child, cIndex) in item.children"
                                :key="cIndex"
                            >
                                <div class="menu-item-content">
                                    <i
                                        v-if="child.icon"
                                        :class="[child.icon, 'menu-icon']"
                                    ></i>
                                    <span class="menu-text">{{
                                        child.label
                                    }}</span>
                                </div>

                                <ul
                                    v-if="
                                        child.children && child.children.length
                                    "
                                    class="submenu-list-l2"
                                >
                                    <li
                                        v-for="(
                                            subChild, sIndex
                                        ) in child.children"
                                        :key="sIndex"
                                    >
                                        {{ subChild.label }}
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </aside>

            <main class="content-container">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PrimeBreadcrumb from 'primevue/breadcrumb';
import PrimeDropdown from 'primevue/dropdown';

const isSidebarCollapsed = ref(true);
function onSidebarHover(hovering: boolean) {
    isSidebarCollapsed.value = !hovering;
}

const breadcrumbItems = ref([
    { label: 'Beer Garden' },
    { label: 'Inventory' },
    { label: 'All Stock' },
]);

const businessOptions = ref([
    { label: 'Beer Garden', value: 'beer-garden' },
    { label: 'Wine Cellar', value: 'wine-cellar' },
    { label: 'Pub House', value: 'pub-house' },
]);
const selectedBusiness = ref('beer-garden');

const menuItems = ref([
    {
        label: 'Setting',
        icon: 'fa fa-cog',
        children: [],
    },
    {
        label: 'Business Profile',
        icon: 'fa fa-user',
        children: [],
    },
    {
        label: 'Management',
        icon: 'fa fa-briefcase',
        children: [
            {
                label: 'Inventory',
                children: [
                    { label: 'Inventory Manager' },
                    { label: 'Warehouse' },
                    { label: 'Stock Movement' },
                ],
            },
            {
                label: 'Product',
                children: [
                    { label: 'Product Manager' },
                    { label: 'Category' },
                    { label: 'Tags' },
                ],
            },
            {
                label: 'Order',
                children: [
                    { label: 'Order Manager' },
                    { label: 'Fulfillment History' },
                ],
            },
            {
                label: 'Supplier',
                children: [
                    {
                        label: 'Supplier Manager',
                        children: [
                            { label: 'Add Supplier' },
                            { label: 'Delete Supplier' },
                        ],
                    },
                    { label: 'Supplier' },
                    { label: 'Order History' },
                ],
            },
        ],
    },
    {
        label: 'Analytics',
        icon: 'fa fa-chart-bar',
        children: [],
    },
    {
        label: 'Syncing',
        icon: 'fa fa-sync',
        children: [],
    },
    {
        label: 'Documentation',
        icon: 'fa fa-book',
        children: [],
    },
]);
</script>

<style scoped lang="scss">
.dashboard-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.topbar-container {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.topbar-left {
    display: flex;
    align-items: center;
}

.logo-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.logo {
    width: 40px;
    height: 40px;
}

.topbar-title {
    font-size: 24px;
    font-weight: 700;
    color: #727272;
}

.topbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.topbar-user i {
    font-size: 24px;
    color: #727272;
}

.main-container {
    display: flex;
    flex: 1;
}

.sidebar-container {
    width: 60px;
    background-color: #effff0;
    border-right: 1px solid #e2e2e2;
    transition: width 0.3s ease;
    overflow: hidden;
    padding: 1rem 0.5rem;
    display: flex;
    flex-direction: column;
}

.sidebar-dropdown {
    margin-bottom: 1rem;
    width: 100%;
}

.sidebar-container:not(.collapsed) {
    width: 240px;
}

.menu-heading {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    color: #555;
    margin: 0 0 1rem 0.5rem;
    white-space: nowrap;
    transition: opacity 0.2s;
}

.sidebar-container.collapsed .menu-heading {
    opacity: 0;
    height: 0;
    margin: 0;
}

.menu-list {
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 1;
}

.menu-list > li {
    position: relative;
    display: block;
    padding: 0.3rem 0;
    cursor: pointer;
    white-space: nowrap;
}

.menu-item-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.menu-item-content:hover {
    background-color: #d1fae5;
}

.menu-icon {
    font-size: 18px;
    width: 24px;
    text-align: center;
}

.menu-text {
    transition: opacity 0.2s;
}

.submenu-list {
    list-style: none;
    margin: 0.2rem 0 0 2rem;
    padding: 0;
    display: none;
}

.menu-list > li:hover > .submenu-list {
    display: block;
}

.submenu-list li {
    color: #333;
    font-size: 14px;
}

.submenu-list-l2 {
    list-style: none;
    margin: 0.2rem 0 0 1.5rem;
    padding: 0;
    display: none;
}

.submenu-list li:hover > .submenu-list-l2 {
    display: block;
}

.submenu-list-l2 li {
    font-size: 14px;
    color: #555;
}

.sidebar-container.collapsed .menu-text,
.sidebar-container.collapsed .submenu-list,
.sidebar-container.collapsed .submenu-list-l2,
.sidebar-container.collapsed .menu-heading {
    display: none;
}

.content-container {
    flex: 1;
    padding: 1rem 2rem;
}

@media (max-width: 768px) {
    .main-container {
        flex-direction: column;
    }

    .sidebar-container {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #e2e2e2;
    }
}
</style>
