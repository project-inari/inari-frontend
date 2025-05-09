<template>
    <div class="syncing-page" :class="fontDMSansPrompt">
        <header class="syncing-header">
            <h1>Syncing</h1>
        </header>
        <div class="syncing-content">
            <NuxtLinkLocale to="/business/[businessId]/syncing/shopee">
                <div class="shopee-box">
                    <NuxtImg src="https://i.pinimg.com/736x/3d/e6/6c/3de66c82f9f28eed4a5c37dfc0c4069e.jpg" alt="shopee"
                        class="shopee-icon" width="72" height="72" />
                    <div class="shopee-box-text">
                        <h2>Shopee</h2>
                    </div>
                </div>
            </NuxtLinkLocale>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
});

const { fontDMSansPrompt } = useFontClass();
</script>

<style lang="scss" scoped>
.syncing-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h1 {
        margin: 0;
        font-size: 28px;
    }
}

.syncing-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 1rem;

    .shopee-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        border-color: #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        width: 120px;
        height: 120px;
    }

    .shopee-box-text {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        h2 {
            margin: 0;
            font-size: 1.5rem;
            color: #333;
        }
    }
}
</style>
