<template>
    <div>
        <div class="navbar">
            <h1>Design System</h1>
            <i
                class="pi pi-moon"
                @click="toggleDarkMode"
            />
            <button @click="setLocale('en')">EN</button>
            <button @click="setLocale('th')">TH</button>
            <div class="router">
                <NuxtLinkLocale to="/">{{ $t('link.home') }}</NuxtLinkLocale>
                <NuxtLinkLocale to="/about">{{
                    $t('link.about')
                }}</NuxtLinkLocale>
                <NuxtLinkLocale to="/design">{{
                    $t('link.design')
                }}</NuxtLinkLocale>
            </div>
        </div>
        <div class="component-showcase">
            <PrimeMenu
                class="component-showcase-item sidebar"
                :model="components"
            />
            <div class="component-showcase-item showcase-area">
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { MenuItem } from 'primevue/menuitem';

const { setLocale } = useI18n();
const localePath = useLocalePath();

const toggleDarkMode = () => {
    const element = document.querySelector('html');
    element?.classList.toggle('dark-mode');

    const isDarkMode = element?.classList.contains('dark-mode');
    localStorage.setItem('dark-mode', isDarkMode ? 'true' : 'false');
};

const components: MenuItem[] = [
    {
        label: 'Button',
        command: () => navigateTo(localePath('/design/button')),
    },
    {
        label: 'ToggleSwitch',
        command: () => navigateTo(localePath('/design/toggleswitch')),
    },
];
</script>

<style lang="scss" scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 1rem;
    background-color: var(--p-slate-200);
    color: #000000;
    margin-bottom: 10px;
}

.pi-moon {
    cursor: pointer;
}

.router {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

:deep(.sidebar) {
    width: 100px;
    height: max-content;
    --p-menu-border-color: var(--p-gray-400);
}

.component-showcase {
    display: flex;
    gap: 1rem;
}

.component-showcase-item {
    padding-inline: 1rem;
    padding-bottom: 1rem;
    border: 1px solid var(--p-gray-400);
    border-radius: 5px;
    flex-grow: 1;
}

.dark-mode {
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-inline: 1rem;
        background-color: var(--p-slate-700);
        color: #ffffff;
    }
}
</style>
