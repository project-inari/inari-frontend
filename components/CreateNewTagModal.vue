<template>
    <PrimeDialog
        v-model:visible="visible"
        header="Create New Tag"
        :style="{ width: '30rem' }"
        :closable="true"
        modal
        :dismissable-mask="true"
        :class="fontDMSansPrompt"
    >
        <div class="form-grid">
            <!-- Tag Name -->
            <div class="field">
                <label class="label">Tag Name:</label>
                <PrimeInputText
                    v-model="form.name"
                    placeholder="Enter tag name"
                />
            </div>

            <!-- Color Dropdown -->
            <div class="field">
                <label class="label">Color:</label>
                <PrimeDropdown
                    v-model="form.color"
                    :options="colorOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select color"
                />
            </div>

            <!-- Description -->
            <div class="field full-width">
                <label class="label">Description:</label>
                <PrimeInputText
                    v-model="form.description"
                    :rows="3"
                    placeholder="Description"
                />
            </div>
        </div>

        <div class="footer-actions">
            <PrimeButton
                label="Cancel"
                icon="pi pi-times"
                class="p-button-text p-button-danger"
                @click="close()"
            />
            <PrimeButton
                label="Save"
                icon="pi pi-check"
                class="p-button-success"
                :disabled="!form.name.trim() || !form.color"
                @click="submit()"
            />
        </div>
    </PrimeDialog>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue';
import type { Tag } from '~/model/Tag';

const { fontDMSansPrompt } = useFontClass();
const currentBusinessStore = useCurrentBusinessStore();

// v-model:isOpened
const props = defineProps<{ isOpened: boolean }>();
const emit = defineEmits<{
    (e: 'update:isOpened', v: boolean): void;
    (e: 'save', newTag: Omit<Tag, 'id'>): void;
}>();

const visible = computed({
    get: () => props.isOpened,
    set: (v: boolean) => emit('update:isOpened', v),
});

// form state
const form = reactive<Omit<Tag, 'id'>>({
    name: '',
    color: '',
    description: '',
});

// fixed color options
const colorOptions = [
    { label: 'White', value: 'white' },
    { label: 'Black', value: 'black' },
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
    { label: 'Orange', value: 'orange' },
];

// close modal
function close() {
    visible.value = false;
}

// submit new tag
async function submit() {
    const payload: Omit<Tag, 'id'> = {
        name: form.name.trim(),
        color: form.color,
        description: form.description?.trim(),
    };
    await $fetch(
        `/api/business/${currentBusinessStore.businessId}/tag/create`,
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
            params: {
                businessId: currentBusinessStore.businessId,
            },
        },
    );
    emit('save', payload);
    visible.value = false;
}
</script>

<style scoped lang="scss">
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .field {
        display: flex;
        flex-direction: column;

        &.full-width {
            grid-column: 1 / -1;
        }

        .label {
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
    }
}

.footer-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
</style>
