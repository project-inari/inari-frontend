<template>
    <PrimeDialog maximizable modal header="Create Product" :style="{ width: '50rem' }" v-model:visible="visible"
        :class="fontDMSansPrompt" class="item-detail-dialog-container">
        <div class="item-detail-dialog-content">
            <!-- Product Info Section -->
            <div class="product-info-section">
                <h2>Product Details</h2>
                <div class="info-row">
                    <label class="info-label">Product Name:</label>
                    <PrimeInputText v-model="formData.name" class="info-input" :class="{ 'p-invalid': errors.name }" />
                </div>
                <small v-if="errors.name" class="error-message">{{ errors.name }}</small>

                <div class="info-row">
                    <label class="info-label">Supplier:</label>
                    <PrimeDropdown v-model="formData.supplierId" :options="supplierList" option-label="name"
                        option-value="id" placeholder="Select Supplier" class="info-input"
                        :class="{ 'p-invalid': errors.supplierId }" />
                </div>
                <small v-if="errors.supplierId" class="error-message">{{ errors.supplierId }}</small>

                <div class="info-row">
                    <label class="info-label">Category:</label>
                    <PrimeDropdown v-model="formData.categoryId" :options="categoryList" option-label="name"
                        option-value="id" placeholder="Select Category" class="info-input"
                        :class="{ 'p-invalid': errors.categoryId }" />
                </div>
                <small v-if="errors.categoryId" class="error-message">{{ errors.categoryId }}</small>

                <div class="info-row">
                    <label class="info-label">Brand:</label>
                    <PrimeInputText v-model="formData.brand" class="info-input"
                        :class="{ 'p-invalid': errors.brand }" />
                </div>
                <small v-if="errors.brand" class="error-message">{{ errors.brand }}</small>
            </div>

            <hr />

            <!-- Variants Section -->
            <div class="variants-section">
                <h2>Variants</h2>
                <div v-for="(variant, index) in formData.variants" :key="index" class="variant-form">
                    <h3>Variant {{ index + 1 }}</h3>
                    <div class="variant-row">
                        <label class="info-label">Variant Name:</label>
                        <PrimeInputText v-model="variant.name" class="info-input"
                            :class="{ 'p-invalid': variantErrors[index]?.name }" />
                    </div>
                    <small v-if="variantErrors[index]?.name" class="error-message">{{ variantErrors[index].name
                        }}</small>

                    <div class="variant-row">
                        <label class="info-label">SKU:</label>
                        <PrimeInputText v-model="variant.sku" class="info-input"
                            :class="{ 'p-invalid': variantErrors[index]?.sku }" />
                    </div>
                    <small v-if="variantErrors[index]?.sku" class="error-message">{{ variantErrors[index].sku }}</small>

                    <div class="variant-row">
                        <label class="info-label">Purchase Price:</label>
                        <PrimeInputNumber v-model="variant.purchasePrice" class="info-input"
                            :class="{ 'p-invalid': variantErrors[index]?.purchasePrice }" />
                    </div>
                    <small v-if="variantErrors[index]?.purchasePrice" class="error-message">{{
                        variantErrors[index].purchasePrice }}</small>

                    <div class="variant-row">
                        <label class="info-label">Selling Price:</label>
                        <PrimeInputNumber v-model="variant.sellingPrice" class="info-input"
                            :class="{ 'p-invalid': variantErrors[index]?.sellingPrice }" />
                    </div>
                    <small v-if="variantErrors[index]?.sellingPrice" class="error-message">{{
                        variantErrors[index].sellingPrice }}</small>

                    <div class="variant-row image-upload-row" @click="triggerVariantFileUpload(index)">
                        <label class="info-label">Image:</label>
                        <NuxtImg v-if="variant.pictureUrl" :src="variant.pictureUrl" alt="Variant Image"
                            class="variant-image" width="120" height="120" />
                        <div v-else class="placeholder-image">No Image</div>
                    </div>

                    <div class="variant-row">
                        <label class="info-label">Note:</label>
                        <PrimeInputText v-model="variant.note" class="info-input"
                            :class="{ 'p-invalid': variantErrors[index]?.note }" />
                    </div>
                    <small v-if="variantErrors[index]?.note" class="error-message">{{ variantErrors[index].note
                        }}</small>

                    <div class="variant-row">
                        <label class="info-label">Tags:</label>
                        <PrimeMultiSelect v-model="variant.tagIds" :options="tagList" option-label="name"
                            option-value="id" placeholder="Select Tags" class="info-input"
                            :class="{ 'p-invalid': variantErrors[index]?.tagIds }" />
                    </div>
                    <small v-if="variantErrors[index]?.tagIds" class="error-message">{{ variantErrors[index].tagIds
                        }}</small>

                    <!-- Button to remove this variant (if more than one) -->
                    <div class="variant-actions" v-if="formData.variants.length > 1">
                        <PrimeButton label="Remove Variant" icon="pi pi-minus" outlined severity="danger"
                            @click="removeVariant(index)" />
                    </div>

                    <hr />
                </div>
                <!-- Button to add a new variant -->
                <div class="add-variant-button">
                    <PrimeButton label="Add Variant" icon="pi pi-plus" outlined severity="primary"
                        @click="addVariant" />
                </div>
            </div>

            <!-- Hidden File Input for Variant Image Upload -->
            <input ref="variantFileInput" type="file" accept="image/*" style="display: none"
                @change="handleVariantFileChange" />

            <!-- Footer Buttons -->
            <div class="footer-actions">
                <PrimeButton label="Cancel" icon="pi pi-times" class="p-button-text p-button-danger"
                    @click="onCancelEdit" />
                <PrimeButton label="Save" icon="pi pi-check" @click="onSave" />
            </div>
        </div>
    </PrimeDialog>
</template>

<script lang="ts" setup>
import type { Product, Variant } from '~/model/Product'

const { fontDMSansPrompt } = useFontClass()
const currentBusinessStore = useCurrentBusinessStore()

// Define a default product (for creation) following the Product interface.
const defaultProduct: Product = {
    name: '',
    supplierId: 0,
    categoryId: 0,
    brand: '',
    variants: []
}

// Define a default variant following the Variant interface.
const defaultVariant: Variant = {
    name: '',
    sku: '',
    purchasePrice: 0,
    sellingPrice: 0,
    pictureUrl: '',
    note: '',
    tagIds: [],
    qtyInWarehouse: []
}

// Props and v-model for dialog visibility and editing.
const props = defineProps<{
    isOpened?: boolean,
    item?: Product,          // If editing, product data is passed in.
    selectedSupplierId?: number
}>()
const emit = defineEmits(['update:visible', 'save'])

const visible = computed({
    get: () => props.isOpened,
    set: (val: boolean) => emit('update:visible', val)
})

// Reactive form data for product creation.
const formData = ref<Product>({
    ...defaultProduct,
    ...(props.item || {}),
    variants: props.item && props.item.variants.length ? [...props.item.variants] : [{ ...defaultVariant }]
})

// When dialog opens, reset formData.
watch(() => props.isOpened, (newVal) => {
    if (newVal) {
        formData.value = {
            ...defaultProduct,
            ...(props.item || {}),
            variants: props.item && props.item.variants.length ? [...props.item.variants] : [{ ...defaultVariant }]
        }
        // Optionally, if a supplier ID was provided via props, prefill it.
        if (!props.item) {
            formData.value.supplierId = props.selectedSupplierId || 0
        }
        clearErrors()
    }
}, { immediate: true })

// Validation errors object (for product and variants).
const errors = ref<{ [key: string]: string }>({})
const variantErrors = ref<Record<number, { [key: string]: string }>>({})

// File input for variant image uploads.
const variantFileInput = ref<HTMLInputElement | null>(null)
const currentVariantIndex = ref<number | null>(null)

function triggerVariantFileUpload(index: number) {
    currentVariantIndex.value = index
    if (variantFileInput.value) {
        variantFileInput.value.click()
    }
}

function handleVariantFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files && target.files[0]
    if (file && currentVariantIndex.value !== null) {
        const reader = new FileReader()
        reader.onload = (e) => {
            formData.value.variants[currentVariantIndex.value!].pictureUrl = (e.target?.result as string) || ''
        }
        reader.readAsDataURL(file)
    }
}

// Functions to add and remove variant forms.
function addVariant() {
    formData.value.variants.push({ ...defaultVariant })
}

function removeVariant(index: number) {
    if (formData.value.variants.length > 1) {
        formData.value.variants.splice(index, 1)
        // Also remove any errors for that variant.
        delete variantErrors.value[index]
    }
}

// Validate the product form.
function validateForm() {
    clearErrors()
    // Product-level validations.
    if (!formData.value.name.trim()) {
        errors.value.name = 'Product name is required'
    }
    if (!formData.value.supplierId) {
        errors.value.supplierId = 'Supplier is required'
    }
    if (!formData.value.categoryId) {
        errors.value.categoryId = 'Category is required'
    }
    if (!formData.value.brand.trim()) {
        errors.value.brand = 'Brand is required'
    }
    // Variant-level validations.
    formData.value.variants.forEach((variant, index) => {
        const err: { [key: string]: string } = {}
        if (!variant.name.trim()) {
            err.name = 'Variant name is required'
        }
        if (!variant.sku.trim()) {
            err.sku = 'SKU is required'
        }
        if (!variant.purchasePrice || variant.purchasePrice <= 0) {
            err.purchasePrice = 'Purchase Price must be > 0'
        }
        if (!variant.sellingPrice || variant.sellingPrice <= 0) {
            err.sellingPrice = 'Selling Price must be > 0'
        }
        if (Object.keys(err).length > 0) {
            variantErrors.value[index] = err
        }
    })
    return Object.keys(errors.value).length === 0 && Object.keys(variantErrors.value).length === 0
}

function clearErrors() {
    errors.value = {}
    variantErrors.value = {}
}

// When Cancel is clicked.
function onCancelEdit() {
    emit('update:visible', false)
}

// On Save, validate and emit the product data (with variants).
async function onSave() {
    if (!validateForm()) {
        return
    }
    // Optionally, transform tag selections if needed.
    // For this example, we assume variant.tagIds already contains numbers.
    emit('save', formData.value)
    emit('update:visible', false)
}

// ----- Supplier, Category, and Tag Lists -----
const suppliers = await $fetch(`/api/business/${currentBusinessStore.businessId}/supplier/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
})
const supplierList = ref(suppliers)

// For categories and tags we use the values already in currentBusinessStore.
const categoryList = ref(currentBusinessStore.businessCategories)
const tagList = ref(currentBusinessStore.businessTags)
</script>

<style lang="scss" scoped>
.item-detail-dialog-container {
    width: 50rem;
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

.variant-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    label {
        font-weight: 600;
    }

    .variant-dropdown {
        width: 180px;
    }
}

/* Additional variant form styling */
.variant-form {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1rem;
}

.variant-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.image-upload-row {
    cursor: pointer;
}

.variant-image {
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>