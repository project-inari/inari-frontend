<template>
    <PrimeDialog v-model:visible="visible" header="Add Supplier Contact" :closable="true" :dismissable-mask="true" modal
        :style="{ width: '40rem' }" :class="fontDMSansPrompt">
        <div class="form-grid">
            <div class="field">
                <label class="label">Full Name<span class="required">*</span>:</label>
                <PrimeInputText v-model="form.fullName" placeholder="Contact’s full name" />
            </div>
            <div class="field">
                <label class="label">Phone:</label>
                <PrimeInputText v-model="form.phoneNo" placeholder="Phone number" />
            </div>
            <div class="field">
                <label class="label">Email:</label>
                <PrimeInputText v-model="form.email" placeholder="Email address" />
            </div>
            <div class="field full-width">
                <label class="label">Address:</label>
                <PrimeInputText v-model="form.address" rows="2" placeholder="Address" />
            </div>
            <div class="field">
                <label class="label">Remarks:</label>
                <PrimeInputText v-model="form.remarks" placeholder="Any remarks" />
            </div>
            <div class="field">
                <label class="label">Status:</label>
                <PrimeInputText v-model="form.status" placeholder="e.g. Active, Inactive" />
            </div>
        </div>

        <div class="footer-actions">
            <PrimeButton label="Cancel" icon="pi pi-times" class="p-button-text p-button-danger" @click="close()" />
            <PrimeButton label="Save" icon="pi pi-check" :disabled="!form.fullName.trim()"
                @click="submit()" />
        </div>
    </PrimeDialog>
</template>

<script lang="ts" setup>
import type { SupplierContact } from '~/model/Supplier'

const { fontDMSansPrompt } = useFontClass()

// props & emits
const props = defineProps<{
    isOpened: boolean
    supplierId: number
}>()
const emit = defineEmits<{
    (e: 'update:isOpened', v: boolean): void
    (e: 'save', payload: { supplierId: number; contact: Omit<SupplierContact, 'id'> }): void
}>()

const visible = computed({
    get: () => props.isOpened,
    set: v => emit('update:isOpened', v),
})

// form
const form = reactive<Omit<SupplierContact, 'id'>>({
    fullName: '',
    phoneNo: '',
    email: '',
    address: '',
    remarks: '',
    status: ''
})

// close dialog
function close() {
    visible.value = false
}

// submit new contact
async function submit() {
    const contact: Omit<SupplierContact, 'id'> = {
        supplierId: props.supplierId,
        fullName: form.fullName.trim(),
        phoneNo: form.phoneNo?.trim() || undefined,
        email: form.email?.trim() || undefined,
        address: form.address?.trim() || undefined,
        remarks: form.remarks?.trim() || undefined,
        status: form.status || undefined
    }
    await $fetch(`/api/business/${props.supplierId}/supplier/contact/create`, {
        method: 'POST',
        body: contact
    })
    // emit the new contact
    emit('save', { supplierId: props.supplierId, contact })
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

.footer-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
</style>