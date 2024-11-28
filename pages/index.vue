<template>
    <div>
        <p :class="fontDMSansPrompt">{{ $t('home.welcome') }}</p>
        <p :class="fontDMSansSarabun">{{ $t('home.welcome') }}</p>
    </div>
</template>

<script lang="ts" setup>
const { fontDMSansPrompt, fontDMSansSarabun } = useFontClass();

definePageMeta({
    title: 'Home Page',
    description: 'This is the home page',
    layout: 'custom',
});
</script>

<style lang="scss" scoped></style>
