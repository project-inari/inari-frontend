<template>
    <PrimeDialog
        v-model:visible="visible"
        :modal="true"
        :closable="true"
        :dismissable-mask="true"
        header="Warehouse Creation"
        class="warehouse-create-dialog-container"
        :class="fontDMSansPrompt"
    >
        <div class="warehouse-create-dialog-content">
            <!-- Top Section: Image + Fields -->
            <div class="top-section">
                <!-- Left: Main Image (clickable to upload a new photo) -->
                <div
                    class="image-section"
                    @click="triggerFileUpload"
                >
                    <NuxtImg
                        v-if="editData.images && editData.images.length"
                        :src="editData.images[0]"
                        alt="Warehouse Main Image"
                        class="main-image"
                        width="180"
                        height="180"
                    />
                    <div
                        v-else
                        class="placeholder-image"
                    >
                        No Image
                    </div>
                    <input
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        style="display: none"
                        @change="handleFileChange"
                    />
                </div>

                <!-- Right: Fields -->
                <div class="info-section">
                    <!-- Warehouse Name -->
                    <div class="info-row">
                        <label class="info-label">Name:</label>
                        <PrimeInputText
                            v-model="editData.name"
                            class="info-input"
                            :class="{ 'p-invalid': errors.name }"
                        />
                    </div>
                    <small
                        v-if="errors.name"
                        class="error-message"
                        >{{ errors.name }}</small
                    >

                    <!-- Description -->
                    <div class="info-row">
                        <label class="info-label">Description:</label>
                        <PrimeInputText
                            v-model="editData.description"
                            class="info-input"
                            :class="{ 'p-invalid': errors.description }"
                        />
                    </div>
                    <small
                        v-if="errors.description"
                        class="error-message"
                        >{{ errors.description }}</small
                    >
                </div>
            </div>

            <!-- Footer Buttons -->
            <div class="footer-actions">
                <PrimeButton
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-text p-button-danger"
                    @click="onCancel"
                />
                <PrimeButton
                    label="Create"
                    icon="pi pi-check"
                    class="p-button-success"
                    @click="onSave"
                />
            </div>
        </div>
    </PrimeDialog>
</template>

<script lang="ts" setup>
const currentBusinessStore = useCurrentBusinessStore();
const { fontDMSansPrompt } = useFontClass();

const props = defineProps({
    isOpened: {
        type: Boolean,
        default: false,
    },
    warehouse: {
        // If editing an existing warehouse, pass it here
        type: Object,
        default: () => ({
            id: null,
            name: '',
            description: '',
            images: [],
        }),
    },
});

const emit = defineEmits(['update:visible', 'save']);

const visible = computed({
    get: () => props.isOpened,
    set: val => emit('update:visible', val),
});

// Local state for editing
const editData = ref({
    id: props.warehouse?.id || null,
    name: props.warehouse?.name || '',
    description: props.warehouse?.description || '',
    images: props.warehouse?.images || [],
});

// Validation errors
const errors = ref<{ [key: string]: string }>({});

// Whenever the modal is opened, reset the data
watch(
    () => props.isOpened,
    newVal => {
        if (newVal) {
            errors.value = {};
            editData.value = {
                id: props.warehouse?.id || null,
                name: props.warehouse?.name || '',
                description: props.warehouse?.description || '',
                images: props.warehouse?.images || [],
            };
        }
    },
);

// File input reference
const fileInput = ref<HTMLInputElement | null>(null);
function triggerFileUpload() {
    if (fileInput.value) {
        fileInput.value.click();
    }
}

// Handle file change
function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files && target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = evt => {
            editData.value.images = [evt.target?.result];
        };
        reader.readAsDataURL(file);
    }
}

// Validate fields
function validateForm() {
    errors.value = {};
    if (!editData.value.name.trim()) {
        errors.value.name = 'Name is required';
    }
    if (!editData.value.description.trim()) {
        errors.value.description = 'Description is required';
    }
    return Object.keys(errors.value).length === 0;
}

// Cancel
function onCancel() {
    visible.value = false;
}

// Save
async function onSave() {
    if (!validateForm()) return;

    // If there's an ID, call update; otherwise create
    try {
        if (editData.value.id) {
            await $fetch(
                `/api/business/${currentBusinessStore.businessId}/inventory/warehouse/update`,
                {
                    method: 'PUT',
                    body: editData.value,
                },
            );
        } else {
            await $fetch(
                `/api/business/${currentBusinessStore.businessId}/inventory/warehouse/create`,
                {
                    method: 'POST',
                    body: editData.value,
                },
            );
        }
        emit('save', editData.value);
        visible.value = false;
    } catch (error) {
        console.error('Error saving warehouse:', error);
    }
}
</script>

<style scoped lang="scss">
.warehouse-create-dialog-container {
    width: 45rem; // adjust as needed
}

.warehouse-create-dialog-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.top-section {
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;
}

.image-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    .main-image {
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .placeholder-image {
        width: 180px;
        height: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #eee;
        color: #999;
        margin-bottom: 1rem;
        border-radius: 4px;
    }
}

.info-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .info-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .info-label {
            width: 8rem;
            font-weight: 600;
            color: #555;
            text-align: right;
        }

        .info-input {
            flex: 1;
        }
    }
}

.error-message {
    color: red;
    font-size: 0.8rem;
    margin-left: 8rem;
    /* align with input field */
}

.footer-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
}
</style>
