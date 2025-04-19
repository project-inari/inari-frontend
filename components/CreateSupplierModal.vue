<template>
    <PrimeDialog v-model:visible="visible" header="Create Supplier" :style="{ width: '50rem' }" :closable="true" modal
        :dismissable-mask="true" :class="fontDMSansPrompt">
        <!-- Supplier Fields -->
        <div class="form-grid">
            <div class="field">
                <label class="label">Name<span class="required">*</span>:</label>
                <PrimeInputText v-model="form.name" placeholder="Supplier name" />
            </div>
            <div class="field">
                <label class="label">Type:</label>
                <PrimeInputText v-model="form.type" placeholder="e.g. Manufacturer" />
            </div>
            <div class="field full-width">
                <label class="label">Description:</label>
                <PrimeInputText v-model="form.description" rows="3" placeholder="Description" />
            </div>
        </div>

        <!-- Contacts Section -->
        <h3 class="contacts-header">Contacts</h3>
        <div v-for="(c, idx) in form.contacts" :key="idx" class="contact-row">
            <div class="contact-fields">
                <div class="field">
                    <label class="label">Full Name<span class="required">*</span>:</label>
                    <PrimeInputText v-model="c.fullName" placeholder="Contact name" />
                </div>
                <div class="field">
                    <label class="label">Phone:</label>
                    <PrimeInputText v-model="c.phoneNo" placeholder="Phone number" />
                </div>
                <div class="field">
                    <label class="label">Email:</label>
                    <PrimeInputText v-model="c.email" placeholder="Email address" />
                </div>
                <div class="field full-width">
                    <label class="label">Address:</label>
                    <PrimeInputText v-model="c.address" rows="2" placeholder="Contact address" />
                </div>
                <div class="field">
                    <label class="label">Remarks:</label>
                    <PrimeInputText v-model="c.remarks" placeholder="Any remarks" />
                </div>
                <div class="field">
                    <label class="label">Status:</label>
                    <PrimeInputText v-model="c.status" placeholder="e.g. Active, Inactive" />
                </div>
            </div>
            <PrimeButton icon="pi pi-trash" severity="danger" text class="remove-btn" @click="removeContact(idx)" />
            <hr />
        </div>
        <PrimeButton label="Add Contact" icon="pi pi-plus" class="add-contact-btn" @click="addContact" outlined />

        <!-- Footer -->
        <div class="footer-actions">
            <PrimeButton label="Cancel" icon="pi pi-times" class="p-button-text p-button-danger" @click="close()" />
            <PrimeButton label="Save" icon="pi pi-check" :disabled="!form.name.trim()" @click="submit()" />
        </div>
    </PrimeDialog>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import type { Supplier, SupplierContact } from '~/model/Supplier'

const { fontDMSansPrompt } = useFontClass()
const currentBusinessStore = useCurrentBusinessStore()

// v-model:isOpened
const props = defineProps<{ isOpened: boolean }>()
const emit = defineEmits<{
    (e: 'update:isOpened', v: boolean): void
    (e: 'save', payload: Omit<Supplier, 'id'>): void
}>()

const visible = computed({
    get: () => props.isOpened,
    set: v => emit('update:isOpened', v),
})

// form state
const form = reactive<Omit<Supplier, 'id'>>({
    name: '',
    type: '',
    description: '',
    contacts: []
})

// add a blank contact
function addContact() {
    form.contacts?.push({
        fullName: '',
        phoneNo: '',
        email: '',
        address: '',
        remarks: '',
        status: ''
    })
}

// remove one
function removeContact(idx: number) {
    form.contacts?.splice(idx, 1)
}

// close without saving
function close() {
    visible.value = false
}

// submit payload
async function submit() {
    const payload: Omit<Supplier, 'id'> = {
        name: form.name.trim(),
        type: form.type?.trim() || undefined,
        description: form.description?.trim() || undefined,
        contacts: form.contacts?.map((c): SupplierContact => ({
            fullName: c.fullName.trim(),
            phoneNo: c.phoneNo?.trim() || undefined,
            email: c.email?.trim() || undefined,
            address: c.address?.trim() || undefined,
            remarks: c.remarks?.trim() || undefined,
            status: c.status?.trim() || undefined
        }))
    }
    await $fetch(`/api/business/${currentBusinessStore.businessId}/supplier/create`, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
    })
    emit('save', payload)
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

        .required {
            color: #c00;
        }
    }
}

.contacts-header {
    margin: 1rem 0 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
}

.contact-row {
    position: relative;
    padding-left: 2rem;
    margin-bottom: 1rem;

    .remove-btn {
        position: absolute;
        left: 0;
        top: 0;
    }

    .contact-fields {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;

        .field.full-width {
            grid-column: 1 / -1;
        }

        .label {
            font-weight: 600;
        }
    }
}

.add-contact-btn {
    margin-bottom: 1.5rem;
}

.footer-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
</style>