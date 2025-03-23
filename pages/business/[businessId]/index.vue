<template>
    <div>{{ businessId }}</div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'dashboard',
});

const route = useRoute();

const businessId = route.params.businessId;
</script>

<style lang="scss" scoped></style>
