<template>
    <div>
        <!-- Hero Element -->
        <div
            v-motion-slide-visible-bottom:duration="10000"
            class="hero-container"
            style="background-image: url('/img/hero-bg.png')"
        >
            <div class="hero-content">
                <h1
                    class="hero-title"
                    :class="fontDMSansPrompt"
                >
                    INARI Inventory Management System
                </h1>
                <p
                    class="hero-subtitle"
                    :class="fontDMSansPrompt"
                >
                    A simple inventory management system for small businesses
                </p>
            </div>
        </div>
        <!-- End of Hero Element -->
    </div>
</template>

<script lang="ts" setup>
const { fontDMSansPrompt } = useFontClass();

definePageMeta({
    title: 'INARI Inventory Management System',
    description: 'Landing page for INARI Inventory Management System',
    layout: 'landingpage',
});
</script>

<style lang="scss" scoped>
.hero-container {
    height: 450px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    background-position: center;
}
</style>
