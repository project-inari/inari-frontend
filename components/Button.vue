<template>
    <div>
        <PrimeButton
            :label="props.textLabel"
            :icon="props.buttonIcon"
            :severity="props.severity"
            :variant="props.outlined ? 'outlined' : undefined"
            :rounded
            :style="{
                width: sizeMapping[
                    props.size as 'small' | 'medium' | 'large' | 'extraLarge'
                ].width,
                height: sizeMapping[
                    props.size as 'small' | 'medium' | 'large' | 'extraLarge'
                ].height,
            }"
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
    outlined: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: 'medium',
        validator: (value: string) =>
            ['small', 'medium', 'large', 'extraLarge'].includes(value),
    },
});

const sizeMapping: {
    [key in 'small' | 'medium' | 'large' | 'extraLarge']: {
        width: string;
        height: string;
    };
} = {
    small: {
        width: '80px',
        height: '24px',
    },
    medium: {
        width: '100px',
        height: '36px',
    },
    large: {
        width: '120px',
        height: '48px',
    },
    extraLarge: {
        width: '140px',
        height: '60px',
    },
};
</script>

<style lang="scss" scoped>
html.dark-mode {
    .p-button {
        --p-button-primary-background: var(--p-blue-400);
    }
}
</style>
