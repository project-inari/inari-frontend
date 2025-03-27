<template>
    <div
        class="main-container"
        :class="fontDMSansPrompt"
    >
        Create new business page
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'dashboard',
});

const { fontDMSansPrompt } = useFontClass();
</script>

<style lang="scss" scoped>
.main-container {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
}
</style>
