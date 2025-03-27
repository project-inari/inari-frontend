<template>
    <div class="dashboard-layout">
        <!-- TOP BAR -->
        <header class="topbar-container">
            <!-- Left: Logo + Title + Dropdown -->
            <div class="topbar-left">
                <div class="logo-container">
                    <img
                        src="/img/default-logo.png"
                        alt="INARI-Logo"
                        class="logo"
                    />
                    <h2 class="topbar-title">INARI</h2>
                </div>

                <!-- Business Dropdown -->
                <PrimeDropdown
                    v-model="selectedBusiness"
                    :options="businessOptions"
                    class="topbar-dropdown"
                    option-label="label"
                    option-value="value"
                />
            </div>

            <!-- Right: Breadcrumb -->
            <div class="topbar-right">
                <PrimeBreadcrumb :model="breadcrumbItems" />
            </div>
        </header>

        <!-- MAIN CONTAINER -->
        <div class="main-container">
            <!-- SIDEBAR -->
            <aside
                class="sidebar-container"
                :class="{ collapsed: isSidebarCollapsed }"
                @mouseenter="onSidebarHover(true)"
                @mouseleave="onSidebarHover(false)"
            >
                <h4 class="menu-heading">MAIN MENU</h4>
                <ul class="menu-list">
                    <!-- Top-level items -->
                    <li
                        v-for="(item, i) in menuItems"
                        :key="i"
                    >
                        <div
                            class="menu-item-content"
                            :class="{ active: isActive([item.label]) }"
                            @click="onMenuItemClick(item)"
                        >
                            <!-- Icon (SVG or FA) -->
                            <template v-if="item.iconPath">
                                <img
                                    :src="item.iconPath"
                                    class="menu-icon"
                                    alt=""
                                />
                            </template>

                            <span class="menu-text">{{ item.label }}</span>
                        </div>

                        <!-- First-level children -->
                        <ul
                            v-if="item.children && item.children.length"
                            class="submenu-list"
                        >
                            <li
                                v-for="(child, cIndex) in item.children"
                                :key="cIndex"
                            >
                                <div
                                    class="menu-item-content"
                                    :class="{
                                        active: isActive([
                                            item.label,
                                            child.label,
                                        ]),
                                    }"
                                    @click.stop="onChildClick(item, child)"
                                >
                                    <span class="menu-text">{{
                                        child.label
                                    }}</span>
                                </div>

                                <!-- Second-level children -->
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
                                        <div
                                            class="menu-item-content"
                                            :class="{
                                                active: isActive([
                                                    item.label,
                                                    child.label,
                                                    subChild.label,
                                                ]),
                                            }"
                                            @click.stop="
                                                onSubChildClick(
                                                    item,
                                                    child,
                                                    subChild,
                                                )
                                            "
                                        >
                                            <span class="menu-text">{{
                                                subChild.label
                                            }}</span>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </aside>

            <!-- CONTENT -->
            <main class="content-container">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Business } from '~/model/Business';

// ---------- 1) GET CURRENT USER + BUSINESS LIST ----------
const currentUsername = useCookie('username');
const route = useRoute();
const pathBusinessId = route.params.businessId;

// Example: fetch user businesses from an API
const businesses: Business[] = await $fetch(
    `/api/user/${currentUsername.value}/business`,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    },
);

// ---------- 2) INITIALIZE THE STORE + SELECTED BUSINESS ----------
const currentBusinessStore = useCurrentBusinessStore();
if (pathBusinessId) {
    const found = businesses.find(b => b.id === Number(pathBusinessId));
    if (found) {
        currentBusinessStore.setCurrentBusiness(found.id, found.name);
    }
}

// ---------- 3) CREATE THE DROPDOWN OPTIONS + SELECTED VALUE ----------
const businessOptions = ref(
    businesses.map(b => ({
        label: b.name,
        value: b.id,
    })),
);
const selectedBusiness = ref<number | null>(currentBusinessStore.businessId);

// ---------- 4) BREADCRUMB DATA ----------
const breadcrumbItems = ref([
    { label: currentBusinessStore.businessName || 'No Business' },
]);

// ---------- 5) WATCH FOR DROPDOWN CHANGES ----------
const router = useRouter();
watch(selectedBusiness, newId => {
    if (newId == null) return;

    const foundBiz = businesses.find(b => b.id === newId);
    if (!foundBiz) return;

    currentBusinessStore.setCurrentBusiness(foundBiz.id, foundBiz.name);
    breadcrumbItems.value = [{ label: foundBiz.name }];
    // Navigate to /business/{businessId}
    router.push(`/business/${foundBiz.id}`);
});

// ---------- 6) SIDEBAR MENU WITH ROUTES ----------
const isSidebarCollapsed = ref(true);
function onSidebarHover(hovering: boolean) {
    isSidebarCollapsed.value = !hovering;
}

/**
 * Each menu item now has a 'route' property (its URL segment).
 * We will combine these segments with the current business ID.
 */
const menuItems = ref([
    {
        label: 'Setting',
        iconPath: '/img/dashboard/settings.svg',
        route: 'setting',
        children: [],
    },
    {
        label: 'Business Profile',
        iconPath: '/img/dashboard/business-profile.svg',
        route: 'business-profile',
        children: [],
    },
    {
        label: 'Management',
        iconPath: '/img/dashboard/management.svg',
        route: 'management',
        children: [
            {
                label: 'Inventory',
                route: 'inventory',
                children: [
                    { label: 'Inventory Manager', route: 'inventory-manager' },
                    { label: 'Warehouse', route: 'warehouse' },
                    { label: 'Stock Movement', route: 'stock-movement' },
                ],
            },
            {
                label: 'Product',
                route: 'product',
                children: [
                    { label: 'Product Manager', route: 'product-manager' },
                    { label: 'Category', route: 'category' },
                    { label: 'Tags', route: 'tags' },
                ],
            },
            {
                label: 'Order',
                route: 'order',
                children: [
                    { label: 'Order Manager', route: 'order-manager' },
                    {
                        label: 'Fulfillment History',
                        route: 'fulfillment-history',
                    },
                ],
            },
            {
                label: 'Supplier',
                route: 'supplier',
                children: [
                    {
                        label: 'Supplier Manager',
                        route: 'supplier-manager',
                        children: [
                            { label: 'Add Supplier', route: 'add-supplier' },
                            {
                                label: 'Delete Supplier',
                                route: 'delete-supplier',
                            },
                        ],
                    },
                    { label: 'Supplier', route: 'supplier' },
                    { label: 'Order History', route: 'order-history' },
                ],
            },
        ],
    },
    {
        label: 'Analytics',
        iconPath: '/img/dashboard/analytics.svg',
        route: 'analytics',
        children: [],
    },
    {
        label: 'Syncing',
        iconPath: '/img/dashboard/syncing.svg',
        route: 'syncing',
        children: [],
    },
    {
        label: 'Documentation',
        iconPath: '/img/dashboard/documentation.svg',
        route: 'documentation',
        children: [],
    },
]);

// The currently active path in the menu (for styling)
const activePath = ref<string[]>([]);

function updateBreadcrumb(pathLabels: string[]) {
    breadcrumbItems.value = [
        { label: currentBusinessStore.businessName },
        ...pathLabels.map(p =>
            // Optionally, format the label (e.g. capitalize)
            ({
                label: p
                    .replace(/-/g, ' ')
                    .replace(/^\w/, c => c.toUpperCase()),
            }),
        ),
    ];
}

/**
 * Helper to combine the current businessId and route segments,
 * then push the new route.
 */
function pushRoute(...segments: string[]) {
    const bizId = selectedBusiness.value;
    if (!bizId) return;
    const fullPath = `/business/${bizId}/${segments.join('/')}`;
    router.push(fullPath);
}

function onMenuItemClick(item: any) {
    activePath.value = [item.label];
    updateBreadcrumb(activePath.value);
    if (item.route) {
        pushRoute(item.route);
    }
}

function onChildClick(item: any, child: any) {
    activePath.value = [item.label, child.label];
    updateBreadcrumb(activePath.value);
    if (item.route && child.route) {
        pushRoute(item.route, child.route);
    }
}

function onSubChildClick(item: any, child: any, subChild: any) {
    activePath.value = [item.label, child.label, subChild.label];
    updateBreadcrumb(activePath.value);
    if (item.route && child.route && subChild.route) {
        pushRoute(item.route, child.route, subChild.route);
    }
}

function isActive(pathArray: string[]) {
    if (pathArray.length !== activePath.value.length) return false;
    return pathArray.every((label, idx) => label === activePath.value[idx]);
}

// ---------- 7) UPDATE BREADCRUMB BASED ON THE CURRENT ROUTE ----------
// If users navigate directly (e.g. via URL), parse the route segments (after businessId)
// and update the breadcrumb accordingly.
function capitalizeText(text: string): string {
    return text
        .split('-') // Split by hyphen
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join back with spaces
}

onMounted(() => {
    const segments = route.path.split('/').filter(Boolean);
    // Expecting path format: ['business', '{businessId}', ...slugSegments]
    if (segments[0] === 'business' && segments.length > 2) {
        const slugSegments = segments.slice(2); // Segments after the businessId
        breadcrumbItems.value = [
            { label: currentBusinessStore.businessName },
            ...slugSegments.map(seg => ({
                label: capitalizeText(seg),
            })),
        ];
        activePath.value = slugSegments.map(seg => capitalizeText(seg));
    } else {
        breadcrumbItems.value = [{ label: currentBusinessStore.businessName }];
        activePath.value = [];
    }
});

// Also update breadcrumb on route change.
watch(
    () => route.path,
    newPath => {
        const segments = newPath.split('/').filter(Boolean);
        if (segments[0] === 'business' && segments.length > 2) {
            const slugSegments = segments.slice(2);
            breadcrumbItems.value = [
                { label: currentBusinessStore.businessName },
                ...slugSegments.map(seg => ({
                    label: capitalizeText(seg),
                })),
            ];
            activePath.value = slugSegments.map(seg => capitalizeText(seg));
        } else {
            breadcrumbItems.value = [
                { label: currentBusinessStore.businessName },
            ];
            activePath.value = [];
        }
    },
);
</script>

<style scoped lang="scss">
/* Layout Container */
.dashboard-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* Top Bar */
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
    gap: 1rem;
}

.logo-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.logo {
    width: 50px;
    height: 50px;
}

.topbar-title {
    font-size: 24px;
    font-weight: 700;
    color: #727272;
}

.topbar-dropdown {
    width: 200px;
}

.topbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

/* Main Container (Sidebar + Content) */
.main-container {
    display: flex;
    flex: 1;
}

/* Sidebar */
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

/* Expand on hover */
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

/* Menu List */
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

/* Icon + text row */
.menu-item-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;
    color: #333;
    position: relative;
}

.menu-icon {
    width: 24px;
    height: 24px;
    text-align: center;
}

/* In collapsed mode, center the icon */
.sidebar-container.collapsed .menu-item-content {
    justify-content: center;
}

/* Hide text & submenus if collapsed */
.sidebar-container.collapsed .menu-text,
.sidebar-container.collapsed .submenu-list,
.sidebar-container.collapsed .submenu-list-l2,
.sidebar-container.collapsed .menu-heading {
    display: none;
}

.menu-item-content:hover {
    background-color: #d1fae5;
}

/* Active state: black text + left border or highlight */
.menu-item-content.active {
    color: #000;
    background-color: #d1fae5;
    border-left: 4px solid #000;
    padding-left: 0.5rem;
}

/* First-level submenu */
.submenu-list {
    list-style: none;
    margin: 0.2rem 0 0 2rem;
    padding: 0;
    display: none;
}

/* Show submenu on hover */
.menu-list > li:hover > .submenu-list {
    display: block;
}

.submenu-list li {
    color: #333;
    font-size: 14px;
}

/* Second-level submenu */
.submenu-list-l2 {
    list-style: none;
    margin: 0.2rem 0 0 1.5rem;
    padding: 0;
    display: none;
}

/* Show second-level submenu on hover */
.submenu-list li:hover > .submenu-list-l2 {
    display: block;
}

.submenu-list-l2 li {
    font-size: 14px;
    color: #555;
}

/* Content Area */
.content-container {
    flex: 1;
    padding: 1rem 2rem;
}

/* Responsive */
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
