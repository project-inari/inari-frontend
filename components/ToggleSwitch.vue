<template>
    <div>
        <PrimeToggleSwitch
            v-model="checked"
            :class="[
                'toggleswitch',
                {
                    'toggleswitch--large': props.large,
                },
            ]"
            @change="props.onChange"
        />
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    checked: {
        type: Boolean,
        default: false,
    },
    large: {
        type: Boolean,
        default: false,
    },
    onChange: {
        type: Function as PropType<(event: Event) => void>,
        default: () => {},
    },
});

const checked = ref(props.checked);
</script>

<style lang="scss" scoped>
.toggleswitch {
    --p-toggleswitch-checked-background: var(--p-green-500);
    --p-toggleswitch-checked-hover-background: var(--p-green-600);

    &--large {
        --p-toggleswitch-width: 56px;
        --p-toggleswitch-height: 32px;
        --p-toggleswitch-handle-size: 24px;
    }
}

html.dark-mode {
    .toggleswitch {
        --p-toggleswitch-handle-background: #ffffff;
        --p-toggleswitch-handle-hover-background: var(--p-gray-100);

        --p-toggleswitch-handle-checked-background: #ffffff;
        --p-toggleswitch-handle-checked-hover-background: var(--p-gray-100);
    }
}
</style>
