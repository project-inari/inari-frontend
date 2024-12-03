<template>
    <div>
        <p :class="fontDMSansPrompt">{{ $t('home.welcome') }}</p>
        <p :class="fontDMSansSarabun">{{ $t('home.welcome') }}</p>
        <p>{{ $viewport.breakpoint.value }}</p>
    </div>
</template>

<script lang="ts" setup>
const { fontDMSansPrompt, fontDMSansSarabun } = useFontClass();

definePageMeta({
    title: 'INARI Inventory Management System',
    description: 'Landing page for INARI Inventory Management System',
    layout: 'landingpage',
});
</script>

<style lang="scss" scoped></style>
