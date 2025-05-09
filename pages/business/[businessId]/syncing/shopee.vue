<template>
    <div class="syncing-page" :class="fontDMSansPrompt">
        <header class="syncing-header">
            <h1>Syncing</h1>
        </header>
        <div class="syncing-content">
            <NuxtImg src="https://i.pinimg.com/736x/3d/e6/6c/3de66c82f9f28eed4a5c37dfc0c4069e.jpg" alt="shopee"
                class="shopee-icon" width="180" height="180" />
            <div class="shopee-text">
                <h2>Shopee</h2>
            </div>
            <PrimeButton label="Connect" @click="connectShopee" />
        </div>
        <PrimeToast ref="toast" :life="3000" :position="'top-right'" :baseZIndex="10000" :autoZIndex="true"
            :showCloseIcon="true" :closeOnEscape="true" />
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import type { CustomerOrder } from '~/model/CustomerOrder';

definePageMeta({
    layout: 'dashboard',
});

const { fontDMSansPrompt } = useFontClass();
const toast = useToast();
const currentBusinessStore = useCurrentBusinessStore();

const shopeeOrders: CustomerOrder[] = [
    {
        orderId: 'shopee-001',
        customerId: 1,
        channelId: 4,
        statusId: 5,
        shippingMethod: 'Shopee Express',
        shippingFee: 50,
        shippingCost: 100,
        items: [
            {
                variantId: 4,
                warehouseId: 1,
                quantity: 2,
                pricePerUnit: 100,
                discountPerUnit: 5
            }
        ],
    },
    {
        orderId: 'shopee-002',
        customerId: 2,
        channelId: 4,
        statusId: 3,
        shippingMethod: 'Shopee Express',
        shippingFee: 60,
        shippingCost: 120,
        items: [
            {
                variantId: 5,
                warehouseId: 2,
                quantity: 1,
                pricePerUnit: 180,
                discountPerUnit: 2
            },
            {
                variantId: 15,
                warehouseId: 2,
                quantity: 2,
                pricePerUnit: 85,
                discountPerUnit: 3
            }
        ],
    },
    {
        orderId: 'shopee-003',
        customerId: 1,
        channelId: 4,
        statusId: 2,
        shippingMethod: 'Seller Own Fleet',
        shippingFee: 50,
        shippingCost: 100,
        items: [
            {
                variantId: 10,
                warehouseId: 1,
                quantity: 10,
                pricePerUnit: 70,
                discountPerUnit: 10
            },
            {
                variantId: 11,
                warehouseId: 1,
                quantity: 5,
                pricePerUnit: 70,
                discountPerUnit: 3
            },
            {
                variantId: 12,
                warehouseId: 1,
                quantity: 3,
                pricePerUnit: 40,
                discountPerUnit: 5
            }
        ],
    },
];

async function connectShopee() {
    for (const order of shopeeOrders) {
        await $fetch(`/api/business/${currentBusinessStore.businessId}/order/create`, {
            method: 'POST',
            body: order,
        });
    }

    toast.add({ severity: 'success', summary: 'Success', detail: 'Connected to Shopee', life: 3000 });
}
</script>

<style lang="scss" scoped>
.syncing-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h1 {
        margin: 0;
        font-size: 28px;
    }
}

.syncing-content {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    .shopee-text {
        font-size: 28px;
    }
}
</style>
