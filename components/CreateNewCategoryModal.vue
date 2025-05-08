<template>
    <PrimeDialog v-model:visible="visible" header="Create New Category" :style="{ width: '40rem' }" :closable="true"
        :dismissable-mask="true" :class="fontDMSansPrompt" modal>
        <div class="form-grid">
            <!-- Name -->
            <div class="field">
                <label class="label">Category Name:</label>
                <PrimeInputText v-model="form.name" placeholder="Enter category name" />
            </div>

            <!-- Parent Category -->
            <div class="field">
                <label class="label">Parent Category:</label>
                <PrimeDropdown v-model="form.parentCategoryId" :options="parentOptions" option-label="name"
                    option-value="id" placeholder="— None —" show-clear />
            </div>

            <!-- Image Upload -->
            <div class="field">
                <label class="label">Image:</label>
                <div class="image-upload" @click="triggerFile">
                    <img v-if="form.pictureUrl" :src="form.pictureUrl" alt="Preview" class="preview" />
                    <div v-else class="placeholder">Click to upload</div>
                </div>
                <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="onFileChange" />
            </div>

            <!-- Description -->
            <div class="field full-width">
                <label class="label">Description:</label>
                <textarea v-model="form.description" rows="3" placeholder="Enter a description..."></textarea>
            </div>

            <!-- Tags -->
            <div class="field full-width">
                <label class="label">Tags:</label>
                <PrimeMultiSelect v-model="form.tags" :options="tagOptions" option-label="name" option-value="id"
                    placeholder="Select tags..." display="chip" />
            </div>
        </div>

        <div class="footer-actions">
            <PrimeButton label="Cancel" icon="pi pi-times" class="p-button-text p-button-danger" @click="close()" />
            <PrimeButton label="Save" icon="pi pi-check" :disabled="!form.name.trim()" @click="submit()" />
        </div>
    </PrimeDialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import type { Category } from '~/model/Category'
import type { Tag } from '~/model/Tag'

const { fontDMSansPrompt } = useFontClass()
const currentBusinessStore = useCurrentBusinessStore()

// Props & v-model
const props = defineProps<{ isOpened: boolean }>()
const emit = defineEmits<{
    (e: 'update:isOpened', v: boolean): void
    (e: 'save', newCategory: Omit<Category, 'id'>): void
}>()

// Control dialog visibility
const visible = computed({
    get: () => props.isOpened,
    set: v => emit('update:isOpened', v),
})

// Form state
const form = reactive<Omit<Category, 'id'>>({
    name: '',
    parentCategoryId: undefined,
    tags: [] as Tag[],
    pictureUrl: '',
    description: ''
})

// Refs & lookups
const fileInput = ref<HTMLInputElement | null>(null)
const allCategories = ref<Category[]>([])
const allTags = ref<Tag[]>([])

// Load categories & tags each time modal opens
watch(
    () => visible.value,
    async opened => {
        if (opened) {
            allCategories.value = await $fetch<Category[]>(
                `/api/business/${currentBusinessStore.businessId}/category/list`
            )
            allTags.value = await $fetch<Tag[]>(
                `/api/business/${currentBusinessStore.businessId}/tag/list`
            )
            // reset form
            form.name = ''
            form.parentCategoryId = undefined
            form.tags = []
            form.pictureUrl = ''
            form.description = ''
        }
    },
    { immediate: true }
)

// Dropdown options
const parentOptions = computed(() =>
    allCategories.value.map(c => ({ id: c.id, name: c.name }))
)
const tagOptions = computed(() =>
    allTags.value.map(t => ({ id: t.id, name: t.name }))
)

// Image upload handlers
function triggerFile() {
    fileInput.value?.click()
}
function onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
        form.pictureUrl = reader.result as string
    }
    reader.readAsDataURL(file)
}

// Emit payload
async function submit() {
    const payload: Omit<Category, 'id'> = {
        name: form.name.trim(),
        parentCategoryId: form.parentCategoryId,
        tags: form.tags,
        pictureUrl: form.pictureUrl,
        description: form.description.trim()
    }
    await $fetch(
        `/api/business/${currentBusinessStore.businessId}/category/create`,
        {
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/json' },
            params: {
                businessId: currentBusinessStore.businessId
            }
        },
    );
    emit('save', payload)

    visible.value = false
}

function close() {
    visible.value = false
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

        textarea {
            resize: vertical;
            padding: 0.5rem;
            font-family: inherit;
            font-size: 1rem;
        }
    }
}

.image-upload {
    width: 100%;
    height: 6rem;
    border: 1px dashed #bbb;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;

    .placeholder {
        color: #888;
    }

    .preview {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
}

.footer-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
</style>