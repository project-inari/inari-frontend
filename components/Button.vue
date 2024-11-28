<template>
    <div>
        <PrimeButton
            :label="props.textLabel"
            :icon="props.buttonIcon"
            :severity="props.severity"
            :rounded
        />
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    textLabel: {
        type: String,
        required: true,
    },
    buttonIcon: {
        type: String,
        default: '',
    },
    rounded: {
        type: Boolean,
        default: false,
    },
    severity: {
        type: String,
        default: 'primary',
    },
});
</script>

<style lang="scss" scoped>
.p-button {
    // --p-button-primary-background: var(--p-amber-500);
    // --p-button-primary-hover-background: var(--p-primary-600);
    // --p-button-primary-border-color: var(--p-amber-500);
    // --p-button-primary-hover-border-color: var(--p-primary-600);
    width: 90px;
    height: 40px;
}

html.dark-mode {
    .p-button {
        --p-button-primary-background: var(--p-blue-400);
    }
}
</style>
