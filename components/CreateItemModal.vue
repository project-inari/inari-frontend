<template>
    <PrimeDialog v-model:visible="visible" :modal="true" :closable="true" :dismissable-mask="true" header="Item Details"
        :class="fontDMSansPrompt" class="item-detail-dialog-container">
        <div class="item-detail-dialog-content">
            <!-- Top Section: Image + Info -->
            <div class="top-section">
                <!-- Left: Main Image (clickable to upload a new photo) -->
                <div class="image-section" @click="triggerFileUpload">
                    <NuxtImg v-if="formData.images && formData.images.length" :src="formData.images[0]"
                        alt="Item Main Image" class="main-image" width="180" height="180" />
                    <div v-else class="placeholder-image">No Image</div>
                </div>

                <!-- Right: Fields -->
                <div class="info-section">
                    <!-- SKU -->
                    <div class="info-row">
                        <label class="info-label">SKU:</label>
                        <PrimeInputText v-model="formData.sku" class="info-input"
                            :class="{ 'p-invalid': errors.sku }" />
                    </div>
                    <small v-if="errors.sku" class="error-message">{{ errors.sku }}</small>

                    <!-- Item (Name) -->
                    <div class="info-row">
                        <label class="info-label">Item:</label>
                        <PrimeInputText v-model="formData.item" class="info-input"
                            :class="{ 'p-invalid': errors.item }" />
                    </div>
                    <small v-if="errors.item" class="error-message">{{ errors.item }}</small>

                    <!-- Purchase Price -->
                    <div class="info-row">
                        <label class="info-label">Purchase Price:</label>
                        <PrimeInputNumber v-model="formData.purchasePrice" class="info-input"
                            :class="{ 'p-invalid': errors.purchasePrice }" />
                    </div>
                    <small v-if="errors.purchasePrice" class="error-message">{{ errors.purchasePrice }}</small>

                    <!-- Supplier Dropdown -->
                    <div class="info-row">
                        <label class="info-label">Supplier:</label>
                        <PrimeDropdown v-model="formData.supplierId" :options="supplierList" optionLabel="name"
                            optionValue="id" placeholder="Select Supplier" class="info-input"
                            :class="{ 'p-invalid': errors.supplierId }" />
                    </div>
                    <small v-if="errors.supplierId" class="error-message">{{ errors.supplierId }}</small>

                    <!-- Category Dropdown -->
                    <div class="info-row">
                        <label class="info-label">Category:</label>
                        <PrimeDropdown v-model="formData.categoryId" :options="categoryList" optionLabel="name"
                            optionValue="id" placeholder="Select Category" class="info-input"
                            :class="{ 'p-invalid': errors.categoryId }" />
                    </div>
                    <small v-if="errors.categoryId" class="error-message">{{ errors.categoryId }}</small>

                    <!-- Tags MultiSelect -->
                    <div class="info-row">
                        <label class="info-label">Tags:</label>
                        <PrimeMultiSelect v-model="formData.tagIds" :options="tagList" optionLabel="name"
                            optionValue="id" placeholder="Select Tags" class="info-input"
                            :class="{ 'p-invalid': errors.tagIds }" />
                    </div>
                    <small v-if="errors.tagIds" class="error-message">{{ errors.tagIds }}</small>

                    <!-- Note (replacing description) -->
                    <div class="info-row">
                        <label class="info-label">Note:</label>
                        <PrimeInputText v-model="formData.note" class="info-input"
                            :class="{ 'p-invalid': errors.note }" />
                    </div>
                    <small v-if="errors.note" class="error-message">{{ errors.note }}</small>

                    <!-- Brand -->
                    <div class="info-row">
                        <label class="info-label">Brand:</label>
                        <PrimeInputText v-model="formData.brand" class="info-input"
                            :class="{ 'p-invalid': errors.brand }" />
                    </div>
                    <small v-if="errors.brand" class="error-message">{{ errors.brand }}</small>

                    <!-- Variant (replacing productVariant) -->
                    <div class="info-row">
                        <label class="info-label">Variant:</label>
                        <PrimeInputText v-model="formData.variant" class="info-input"
                            :class="{ 'p-invalid': errors.variant }" />
                    </div>
                    <small v-if="errors.variant" class="error-message">{{ errors.variant }}</small>

                    <!-- Selling Price -->
                    <div class="info-row">
                        <label class="info-label">Selling Price:</label>
                        <PrimeInputNumber v-model="formData.sellingPrice" class="info-input"
                            :class="{ 'p-invalid': errors.sellingPrice }" />
                    </div>
                    <small v-if="errors.sellingPrice" class="error-message">{{ errors.sellingPrice }}</small>
                </div>
            </div>

            <!-- Hidden File Input for Uploading New Image -->
            <input type="file" accept="image/*" ref="fileInput" style="display: none" @change="handleFileChange" />

            <!-- Footer Buttons -->
            <div class="footer-actions">
                <PrimeButton label="Cancel" icon="pi pi-times" class="p-button-text p-button-danger"
                    @click="onCancelEdit" />
                <PrimeButton label="Save" icon="pi pi-check" class="p-button-success" @click="onSave" />
            </div>
        </div>
    </PrimeDialog>
</template>

<script lang="ts" setup>
import type { InventoryItem } from '~/model/InventoryItem'
const currentBusinessStore = useCurrentBusinessStore()
const { fontDMSansPrompt } = useFontClass()

// Use the InventoryItem interface for the "item" prop
const props = defineProps<{
    isOpened?: boolean
    item?: InventoryItem
    selectedSupplierId?: number
}>()

// Set default values if no item is provided
const defaultItem: InventoryItem = {
    id: 0,
    sku: '',
    item: '',
    supplierId: 0,
    variant: '',
    brand: '',
    categoryId: [],
    tags: [],
    qty: 0,
    img: '',
    purchasePrice: 0,
    sellingPrice: 0,
    note: '',
    qtyInWarehouse: [],
}

// Emits: update:visible (for closing) and save (when the item is created/updated)
const emit = defineEmits(['update:visible', 'save'])
const visible = computed({
    get: () => props.isOpened,
    set: (val) => emit('update:visible', val),
})

// Always allow editing on open
const isEditing = ref(true)

// For form management, use a local reactive object that extends the InventoryItem interface.
// We add helper fields for the form: a temporary "categoryId" (assumes a single category) and "tagIds" for MultiSelect.
// For the image, we work with an array for the upload preview.
const formData = ref({
    ...defaultItem,
    ...(props.item || {}),
    // Helper fields:
    categoryId: props.item && props.item.categories.length ? props.item.categories[0].id : '',
    tagIds: props.item && props.item.tags.length ? props.item.tags.map((tag) => tag.id) : [],
    images: props.item && props.item.img ? [props.item.img] : [],
})

// Validation errors object
const errors = ref<{ [key: string]: string }>({})

// Fetch the supplier list from the API
const suppliers = await $fetch(`/api/business/${currentBusinessStore.businessId}/inventory/supplier/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
})
const supplierList = ref(suppliers)

// Fetch the category list from the API
const categories = await $fetch(`/api/business/${currentBusinessStore.businessId}/category/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
})
const categoryList = ref(categories)

// Fetch the tag list from the API
const tags = await $fetch(`/api/business/${currentBusinessStore.businessId}/tag/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
})
const tagList = ref(tags)

// When the modal opens, reset the formData based on the passed item or default values,
// and clear any previous errors.
watch(() => props.isOpened, (newVal) => {
    if (newVal) {
        formData.value = {
            ...defaultItem,
            ...(props.item || {}),
            categoryId: props.item && props.item.categories.length ? props.item.categories[0].id : '',
            tagIds: props.item && props.item.tags.length ? props.item.tags.map((tag) => tag.id) : [],
            images: props.item && props.item.img ? [props.item.img] : [],
        }
        isEditing.value = true
        errors.value = {}
        if (!props.item || !props.item.sku) {
            formData.value.supplierId = props.selectedSupplierId || 0
        }
    }
})

// Watch for changes in the selected category to auto-populate tagIds from that category's tags.
watch(
    () => formData.value.categoryId,
    (newCategoryId) => {
        if (newCategoryId) {
            const selectedCategory = categoryList.value.find((cat) => cat.id === newCategoryId)
            if (selectedCategory && selectedCategory.tags) {
                formData.value.tagIds = selectedCategory.tags.map((tag: { id: any }) => tag.id)
            } else {
                formData.value.tagIds = []
            }
        } else {
            formData.value.tagIds = []
        }
    }
)

watch(
    () => props.item,
    (newItem) => {
        if (newItem) {
            formData.value = {
                ...defaultItem,
                ...newItem,
                // Set helper fields
                categoryId: newItem.categories?.[0]?.id || '',
                tagIds: newItem.tags?.map((tag) => tag.id) || [],
                images: newItem.img ? [newItem.img] : [],
            }
        } else {
            // If no item, reset to default
            formData.value = {
                ...defaultItem,
                categoryId: '',
                tagIds: [],
                images: [],
            }
        }
    },
    { immediate: true }
)

// File input reference for image uploads.
const fileInput = ref<HTMLInputElement | null>(null)

// Trigger the hidden file input click when the image is clicked.
function triggerFileUpload() {
    if (isEditing.value && fileInput.value) {
        fileInput.value.click()
    }
}

// Handle file change event, read the file as a Data URL, and update the image preview.
function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files && target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            formData.value.images = [e.target?.result as string || '']
        }
        reader.readAsDataURL(file)
    }
}

// Validate the form fields (all required except photo).
function validateForm() {
    errors.value = {} // clear previous errors

    if (!formData.value.sku.trim()) {
        errors.value.sku = 'SKU is required'
    }
    if (!formData.value.item.trim()) {
        errors.value.item = 'Item is required'
    }
    if (!formData.value.purchasePrice || formData.value.purchasePrice <= 0) {
        errors.value.purchasePrice = 'Purchase Price must be greater than 0'
    }
    if (!formData.value.supplierId) {
        errors.value.supplierId = 'Supplier is required'
    }
    if (!formData.value.categoryId) {
        errors.value.categoryId = 'Category is required'
    }
    if (!formData.value.tagIds || formData.value.tagIds.length === 0) {
        errors.value.tagIds = 'At least one Tag is required'
    }
    if (!(formData.value.note ?? '').trim()) {
        errors.value.note = 'Note is required'
    }
    if (!formData.value.brand.trim()) {
        errors.value.brand = 'Brand is required'
    }
    if (!formData.value.variant.trim()) {
        errors.value.variant = 'Variant is required'
    }
    if (!formData.value.sellingPrice || formData.value.sellingPrice <= 0) {
        errors.value.sellingPrice = 'Selling Price must be greater than 0'
    }

    return Object.keys(errors.value).length === 0
}

// Cancel editing: revert changes and close the dialog.
function onCancelEdit() {
    formData.value = {
        ...defaultItem,
        ...props.item,
        categoryId: '',
        tagIds: [],
        images: props.item?.img ? [props.item.img] : [],
        id: props.item?.id || 0,
        sku: props.item?.sku || '',
        item: props.item?.item || '',
        supplierId: props.item?.supplierId || 0,
        variant: props.item?.variant || '',
        brand: props.item?.brand || '',
        categoryId: props.item?.categoryId || 0,
        tags: props.item?.tags || [],
        qty: props.item?.qty || 0,
        purchasePrice: props.item?.purchasePrice || 0,
        sellingPrice: props.item?.sellingPrice || 0,
        note: props.item?.note || '',
        qtyInWarehouse: props.item?.qtyInWarehouse || [],
    }
    errors.value = {}
    emit('update:visible', false)
}

// Save the changes, validate the form, perform API calls if needed, and emit the updated/created item.
// Before emitting, you might transform the helper fields into the InventoryItem structure.
// For example, you could map the selected categoryId into a categories array and tagIds into a tags array.
async function onSave() {
    if (!validateForm()) {
        return
    }
    // (Optional) API calls for update or create.
    if (props.item && props.item.id) {
        await $fetch(`/api/business/${currentBusinessStore.businessId}/product/update`, {
            method: 'PUT',
            body: formData.value,
            headers: { 'Content-Type': 'application/json' },
        })
    } else {
        await $fetch(`/api/business/${currentBusinessStore.businessId}/product/create`, {
            method: 'POST',
            body: formData.value,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    // Emit the saved item. (You may need to transform formData here to match your desired structure.)
    emit('save', formData.value)
    emit('update:visible', false)
}
</script>

<style scoped lang="scss">
.item-detail-dialog-container {
    width: 50rem; // Adjust as needed
}

.item-detail-dialog-content {
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
}

.footer-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
}
</style>